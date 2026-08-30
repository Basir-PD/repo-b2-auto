import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";

/**
 * ============================================================
 * POST /api/quote  —  quote-request lead handler
 * ============================================================
 * Validates, then hands the lead to Convex, which stores it and
 * schedules the notification email. Storing first means a mail
 * outage costs a notification, never a lead — the request shows
 * up in /admin either way.
 *
 * Next app env (.env.local):
 *   NEXT_PUBLIC_CONVEX_URL   written by `npx convex dev`
 *   INGEST_SECRET            optional; must match the Convex var
 *
 * Convex deployment env (`npx convex env set …`):
 *   RESEND_API_KEY, QUOTE_FROM, QUOTE_INBOX, ADMIN_EMAILS
 * ============================================================
 */

export const runtime = "nodejs";

const MAX_LEN = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{10,20}$/;

/** Crude per-IP throttle. Resets on cold start, which is fine for spam control. */
const recentSubmissions = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentSubmissions.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentSubmissions.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real people never fill a hidden field.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name);
  const phone = clean(body.phone);
  const email = clean(body.email);
  const vehicle = clean(body.vehicle);
  const condition = clean(body.condition);
  const message = clean(body.message);
  const locale = clean(body.locale) === "en" ? "en" : "fr";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "required";
  if (!phone) errors.phone = "required";
  else if (!PHONE_RE.test(phone)) errors.phone = "invalid";
  // Email is optional — the short hero form asks for a phone number only,
  // which is what we actually need to call someone back. A supplied address
  // still has to be well formed.
  if (email && !EMAIL_RE.test(email)) errors.email = "invalid";
  if (!vehicle) errors.vehicle = "required";

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "validation", errors }, { status: 422 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.error(
      "[quote] NEXT_PUBLIC_CONVEX_URL is not set — lead NOT stored. Captured:",
      JSON.stringify({ name, phone, email, vehicle, condition, message })
    );
    return NextResponse.json({ error: "backend_not_configured" }, { status: 503 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    await convex.mutation(api.quotes.submit, {
      name,
      phone,
      email: email || undefined,
      vehicle,
      condition: condition || undefined,
      message: message || undefined,
      locale,
      secret: process.env.INGEST_SECRET,
    });
  } catch (err) {
    // Log the whole lead so it is recoverable from the server logs.
    console.error(
      "[quote] failed to store lead:",
      err instanceof ConvexError ? err.data : err,
      JSON.stringify({ name, phone, email, vehicle, condition, message })
    );
    return NextResponse.json({ error: "store_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
