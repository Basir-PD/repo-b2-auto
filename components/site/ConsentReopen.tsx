"use client";

import { CONSENT_COOKIE } from "@/lib/consent";

/**
 * "Change my cookie choice" — the withdrawal half of consent.
 *
 * Law 25 requires withdrawing consent to be as easy as giving it, and the
 * privacy policy already promises you can do it "en tout temps". Without this
 * there was no mechanism behind that sentence: the decision is stored for 180
 * days and the banner only shows when no cookie exists, so a visitor who
 * accepted once had no way back short of clearing site data by hand.
 *
 * Clearing the cookie and reloading is deliberately the whole implementation.
 * The alternative — lifting the banner's open state into a context so this can
 * toggle it — spreads a two-line job across three files, and a reload is what
 * re-asserts the denied Consent Mode defaults anyway, which is exactly the
 * state someone withdrawing consent should land in.
 */
export default function ConsentReopen({ label }: { label: string }) {
  function reopen() {
    document.cookie = `${CONSENT_COOKIE}=;path=/;max-age=0;samesite=lax`;
    window.location.reload();
  }

  return (
    <button type="button" onClick={reopen} className="underline hover:text-white">
      {label}
    </button>
  );
}
