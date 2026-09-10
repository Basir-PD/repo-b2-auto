import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import { siteConfig } from "@/config/site";
import { phoneIsValid } from "@/lib/phone";

/**
 * ============================================================
 * POST /api/quote  —  lead handler
 * ============================================================
 * Validates, stores in Convex (which schedules the notification
 * email), then fires the SMS/WhatsApp webhook. Both are tried
 * independently and a lead is only refused when neither accepted
 * it, so a store outage costs the /admin record but still pages a
 * human, and a webhook outage costs the ping but not the lead.
 *
 * Two kinds of submission arrive here:
 *
 *   partial: false  a completed form
 *   partial: true   someone typed a valid phone number on step 3
 *                   and left. Sent via sendBeacon, so the response
 *                   is never read and the payload must be small.
 *
 * A partial is a real lead — a phone number and a vehicle is all
 * anyone needs to call back — so it is stored, flagged, and
 * notified like any other, just marked so nobody mistakes it for
 * a finished enquiry.
 *
 * Next app env (.env.local):
 *   NEXT_PUBLIC_CONVEX_URL   written by `npx convex dev`
 *   INGEST_SECRET            optional; must match the Convex var
 *   LEAD_WEBHOOK_URL         optional; Zapier/Make → Twilio or WhatsApp
 *
 * Convex deployment env (`npx convex env set …`):
 *   RESEND_API_KEY, QUOTE_FROM, QUOTE_INBOX, ADMIN_EMAILS
 * ============================================================
 */

export const runtime = "nodejs";

const MAX_LEN = 2000;

/**
 * Throttle. Resets on cold start, which is fine for spam control.
 *
 * 15 in ten minutes: high enough that a real person correcting a typo three
 * times never sees it, low enough to be useless to a script. The old limit
 * of 8 was tight enough that ordinary testing tripped it.
 */
const recentSubmissions = new Map<string, number[]>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(key: string) {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentSubmissions.set(key, hits);
  return hits.length > RATE_LIMIT;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

/** Flatten the captured click IDs into something readable in an inbox. */
function describeAttribution(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  return Object.entries(raw as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string" && v)
    .map(([k, v]) => `${k}=${String(v).slice(0, 200)}`)
    .join(" · ");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real people never fill a hidden field. Answer 200 so the bot
  // records a success and moves on.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const partial = body.partial === true;

  const name = clean(body.name);
  const phone = clean(body.phone);
  const postal = clean(body.postal);
  const vehicleInput = clean(body.vehicle);
  const source = clean(body.source) || "unknown";
  const locale = clean(body.locale) === "en" ? "en" : "fr";
  const attribution = describeAttribution(body.attribution);

  const errors: Record<string, string> = {};

  // A phone number is the one thing that makes a lead actionable, so it is
  // the only field required on both paths.
  if (!phone) errors.phone = "required";
  else if (!phoneIsValid(phone)) errors.phone = "invalid";

  if (!partial) {
    if (!name) errors.name = "required";
    if (!postal) errors.postal = "required";
    if (!vehicleInput) errors.vehicle = "required";
    /*
      No consent field is checked here any more: the checkbox was removed
      from the form, and requiring it server-side would 422 every real
      submission. The consent statement now sits above the submit button.
    */
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "validation", errors }, { status: 422 });
  }

  /*
    Throttle per identified client. Vercel always sets x-forwarded-for, so in
    production this is a real per-visitor bucket.

    When the header is absent — running locally, or behind a proxy that drops
    it — the old code fell back to the literal string "unknown", which put
    EVERY visitor in one shared bucket. Fifteen submissions site-wide would
    then lock the form for everybody. Falling back to the phone number keeps
    one person from being throttled by another's attempts, which is the
    failure that actually costs leads.
  */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const throttleKey = ip || `phone:${phone.replace(/\D/g, "")}`;

  if (isRateLimited(throttleKey)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const vehicle = vehicleInput || "(non précisé)";

  /*
    The consent line is stamped into the lead itself, with the moment it was
    given. If anyone ever asks us to show that a person agreed to be called,
    this is the record — a checkbox that is only enforced in the browser
    proves nothing after the fact.

    Partial leads are the exception and are labelled as such: that path fires
    when someone types a valid number and leaves WITHOUT ticking the box, so
    there is no consent to record. See README before working those.
  */
  /*
    Still recorded, but describing what actually happened. The consent is now
    given by sending the form, having read the line above the button — not by
    ticking a box. Partials never reached that line at all.
  */
  const consentLine = partial
    ? "⚠️ AUCUN CONSENTEMENT — formulaire abandonné avant l'envoi"
    : `Formulaire envoyé le ${new Date().toISOString()} — avis de consentement affiché (téléphone, texto, courriel)`;

  const message = [
    partial ? "⚠️ FORMULAIRE ABANDONNÉ" : null,
    consentLine,
    postal && `Code postal / ville : ${postal}`,
    `Source : ${source}`,
    attribution && `Attribution : ${attribution}`,
  ]
    .filter(Boolean)
    .join("\n");

  const lead = {
    name: name || "(partiel)",
    phone,
    vehicle,
    message: message || undefined,
    locale,
  };

  /*
   * Two independent sinks: Convex (the record of the lead, which also
   * schedules the notification email) and the webhook (the SMS/WhatsApp ping
   * that gets a human dialling). Both are attempted, and the submission is
   * only refused if NEITHER of them accepted it.
   *
   * It used to return 503 the instant NEXT_PUBLIC_CONVEX_URL was missing,
   * before the webhook was even tried. That is not hypothetical: production
   * ran that way, answering every single submission with
   * {"error":"backend_not_configured"} while the visitor was told to phone
   * instead. An unconfigured datastore is an outage. It must not also be a
   * lost customer when there is a second route to a human sitting right
   * there, unused.
   */
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  let stored = false;

  if (convexUrl) {
    try {
      const convex = new ConvexHttpClient(convexUrl);
      await convex.mutation(api.quotes.submit, {
        ...lead,
        secret: process.env.INGEST_SECRET,
      });
      stored = true;
    } catch (err) {
      // Log the whole lead so it stays recoverable from the server logs.
      console.error(
        "[quote] failed to store lead:",
        err instanceof ConvexError ? err.data : err,
        JSON.stringify(lead)
      );
    }
  } else {
    console.error(
      "[quote] NEXT_PUBLIC_CONVEX_URL is not set — lead NOT stored. Captured:",
      JSON.stringify(lead)
    );
  }

  /*
   * `stored` rides along in the payload so whoever receives the ping knows
   * whether this lead also exists in /admin or whether the message they are
   * reading is the only copy of it anywhere.
   */
  let notified = false;
  if (siteConfig.leadWebhook) {
    try {
      await fetch(siteConfig.leadWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, partial, source, attribution, stored }),
        signal: AbortSignal.timeout(3000),
      });
      notified = true;
    } catch (err) {
      console.error("[quote] webhook failed:", err, stored ? "(lead is stored)" : "(lead is LOST)");
    }
  }

  if (!stored && !notified) {
    /*
     * Nowhere for the lead to go. The console.error above is now the only
     * record it ever existed, so the visitor genuinely does need the phone
     * number the form is about to show them.
     */
    return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
