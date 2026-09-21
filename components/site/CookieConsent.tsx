"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isHomePath } from "@/config/routes";
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
 * WHERE IT SITS. Against the bottom edge, and it clears the mobile
 * call/WhatsApp bar ONLY on the pages that have one. That bar is fixed at
 * `bottom-0` and is the most valuable element on the site — an earlier
 * banner sat on top of it, so the page asked for a cookie decision by hiding
 * the phone number. But MobileContactBar renders nothing on the homepage,
 * and reserving its height there pushed this card up into the middle of the
 * hero, over the very CTAs it was moved off the bar to protect. Hence
 * `isHomePath`: same test the bar itself uses, from one place so the two
 * cannot drift. On desktop it sits bottom-LEFT, away from the WhatsApp
 * float bottom-right.
 *
 * WHEN IT APPEARS. Once the quote form has scrolled off the top, not after
 * a fixed number of pixels. The form is the page's whole job and it sits in
 * the hero, so any threshold short enough to be "after the fold" on a laptop
 * still landed on the form on a tall phone. Waiting for the form itself is
 * the rule that actually holds across every viewport and page type, because
 * it is measured from the thing being protected rather than guessed at.
 *
 * Pages with no form — privacy, terms — fall back to 150px, the same
 * threshold MobileContactBar uses.
 *
 * This costs nothing legally: every non-essential storage type is denied
 * until someone chooses, so nothing is being set during the wait. The card
 * unlocks tracking, it does not hold anything back.
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
  const pathname = usePathname();
  const [undecided, setUndecided] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    setUndecided(true);
  }, []);

  useEffect(() => {
    /*
      `data-quote-form` is on every QuoteForm instance and nothing else, which
      is why it exists — GTM keys off it too. The first one in the document is
      the hero's on every page that has one.
    */
    const form = document.querySelector<HTMLElement>("[data-quote-form]");

    const onScroll = () => {
      if (!form) {
        setScrolled(window.scrollY > 150);
        return;
      }
      // Past it, not merely level with it: the bottom edge has to clear the
      // top of the viewport before the card is allowed in.
      setScrolled(form.getBoundingClientRect().bottom < 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function decide(next: { analytics: boolean; marketing: boolean }) {
    const state: ConsentState = { necessary: true, ...next, decidedAt: new Date().toISOString() };
    writeCookie(state);
    applyConsentMode(state);
    setUndecided(false);
  }

  if (!undecided || !scrolled) return null;

  /*
    py-2 at the smallest size, not less. The card shrinks on phones but these
    two are the only way out of it, and a control that is tiring to hit is a
    dark pattern whichever direction it pushes someone.
  */
  const button =
    "flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 sm:text-[13px]";

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
        On phones: against the bottom edge, plus the call bar's height only
        where that bar exists. 4.25rem matches the spacer MobileContactBar
        renders; the safe-area inset clears a home indicator either way.
        On md+ the bar is hidden entirely, so a plain margin is enough and
        `left` keeps the card off the WhatsApp float on the right.
      */
      className={`fixed inset-x-3 z-50 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm ${
        isHomePath(pathname)
          ? "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(4.25rem+env(safe-area-inset-bottom)+0.5rem)]"
      }`}
    >
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.16)] sm:p-3.5">
        <h2 id="consent-title" className="text-xs font-black text-slate-900 sm:text-[13px]">
          {labels.title}
        </h2>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-600 sm:mt-1 sm:text-xs">
          {labels.body}{" "}
          <Link
            href={labels.privacyHref}
            className="font-semibold text-brand-700 underline underline-offset-2"
          >
            {labels.policyLink}
          </Link>
        </p>

        <div className="mt-2 space-y-1 rounded-lg bg-slate-50 px-2 py-1.5 sm:mt-2.5 sm:space-y-1.5 sm:px-2.5 sm:py-2">
          <Row label={labels.necessary} hint={labels.alwaysOn} checked disabled />
          <Row label={labels.analytics} checked={analytics} onChange={setAnalytics} />
          <Row label={labels.marketing} checked={marketing} onChange={setMarketing} />
        </div>

        <div className="mt-2 flex gap-2 sm:mt-2.5">
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
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:mt-2 sm:text-[13px]"
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
      className={`flex items-center gap-2 text-[11px] sm:text-xs ${
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
      {hint && (
        <span className="ml-auto text-[10px] font-medium text-slate-400 sm:text-[11px]">
          {hint}
        </span>
      )}
    </label>
  );
}
