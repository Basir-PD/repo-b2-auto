"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  type ConsentState,
  parseConsent,
  serializeConsent,
  toConsentMode,
} from "@/lib/consent";

type Labels = {
  title: string;
  body: string;
  necessary: string;
  analytics: string;
  marketing: string;
  alwaysOn: string;
  acceptAll: string;
  save: string;
  rejectAll: string;
  policyLink: string;
  privacyHref: string;
};

function writeCookie(state: ConsentState) {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    serializeConsent(state)
  )};path=/;max-age=${CONSENT_MAX_AGE};samesite=lax`;
}

function applyConsentMode(state: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  // Consent Mode v2 expects the arguments-object shape gtag() produces, not
  // an object literal — pushing a plain object here silently does nothing.
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  }
  gtag("consent", "update", toConsentMode(state));
  window.dataLayer.push({ event: "consent_update", ...toConsentMode(state) });
  // Tags without Consent Mode — the Meta Pixel — listen for this to mount.
  window.dispatchEvent(new CustomEvent("b2-consent-updated"));
}

/**
 * Law 25 consent, as a small card rather than a wall.
 *
 * Three things about this are deliberate and should survive a redesign.
 *
 * WHERE IT SITS. It is offset off the bottom edge, not pinned to it. The
 * mobile call/WhatsApp bar is fixed at `bottom-0` and is the single most
 * valuable element on the site; the previous banner sat at `bottom-0` with
 * `z-[80]` and covered it outright, which means the page asked for a cookie
 * decision by hiding the phone number. On phones this clears the bar's height
 * exactly; on desktop it sits bottom-LEFT so it cannot cover the WhatsApp
 * float bottom-right.
 *
 * HOW BIG. One line of body copy and three compact rows, on the site's own
 * white, instead of a full-width dark slab with a paragraph. A consent
 * request that looks like a warning gets dismissed like one.
 *
 * ACCEPT AND REFUSE MATCH. Same size, same weight, same row. In Quebec that
 * symmetry is a legal requirement rather than a design preference, and it is
 * the part most banners get wrong — refusing must be no harder than accepting.
 * "Enregistrer" is the third option and only does something different when a
 * box has been ticked.
 *
 * The optional boxes start UNCHECKED and must stay that way: pre-ticked
 * consent is not consent under Law 25, which is the whole reason this exists.
 */
export default function CookieConsent({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
      ?.split("=")[1];
    const existing = parseConsent(raw ? decodeURIComponent(raw) : null);
    if (existing) {
      // Re-assert the stored decision on every load. Consent Mode defaults to
      // denied on each fresh page, so a previous yes has to be replayed or the
      // visitor is silently un-consented after the first page view.
      applyConsentMode(existing);
      return;
    }
    setOpen(true);
  }, []);

  function decide(next: { analytics: boolean; marketing: boolean }) {
    const state: ConsentState = { necessary: true, ...next, decidedAt: new Date().toISOString() };
    writeCookie(state);
    applyConsentMode(state);
    setOpen(false);
  }

  if (!open) return null;

  const button =
    "flex-1 rounded-lg px-3 py-2 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1";

  return (
    /*
      A section, not role="dialog". It traps no focus and the page stays
      fully usable behind it, so announcing it as a dialog would promise a
      modal that is not there. As a labelled landmark it is still reachable
      by region navigation, which is what a screen-reader user actually
      needs from a bar like this.
    */
    <section
      aria-labelledby="consent-title"
      /*
        bottom offsets, not bottom-0:
          phones  — 4.25rem is the call bar's height, matching the spacer
                    MobileContactBar renders; plus the safe-area inset so it
                    clears a home indicator too.
          md+     — the call bar is hidden, so a normal margin is enough, and
                    `left` keeps it away from the WhatsApp float on the right.
      */
      className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom)+0.5rem)] z-50 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_30px_rgba(15,23,42,0.16)]">
        <h2 id="consent-title" className="text-[13px] font-black text-slate-900">
          {labels.title}
        </h2>
        <p className="mt-1 text-xs leading-snug text-slate-600">
          {labels.body}{" "}
          <Link
            href={labels.privacyHref}
            className="font-semibold text-brand-700 underline underline-offset-2"
          >
            {labels.policyLink}
          </Link>
        </p>

        <div className="mt-2.5 space-y-1.5 rounded-lg bg-slate-50 px-2.5 py-2">
          <Row label={labels.necessary} hint={labels.alwaysOn} checked disabled />
          <Row label={labels.analytics} checked={analytics} onChange={setAnalytics} />
          <Row label={labels.marketing} checked={marketing} onChange={setMarketing} />
        </div>

        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => decide({ analytics: true, marketing: true })}
            className={`${button} bg-brand-600 text-white hover:bg-brand-700`}
          >
            {labels.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => decide({ analytics: false, marketing: false })}
            className={`${button} bg-slate-200 text-slate-900 hover:bg-slate-300`}
          >
            {labels.rejectAll}
          </button>
        </div>

        {/*
          Only meaningful once a box is ticked, so it is quieter than the two
          above rather than a third equal-weight choice competing with them.
        */}
        {(analytics || marketing) && (
          <button
            type="button"
            onClick={() => decide({ analytics, marketing })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            {labels.save}
          </button>
        )}
      </div>
    </section>
  );
}

function Row({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-xs ${
        disabled ? "text-slate-500" : "cursor-pointer text-slate-800"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-3.5 w-3.5 shrink-0 accent-brand-600 disabled:opacity-70"
      />
      <span className="font-semibold">{label}</span>
      {hint && <span className="ml-auto text-[11px] font-medium text-slate-400">{hint}</span>}
    </label>
  );
}
