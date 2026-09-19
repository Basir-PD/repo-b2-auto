/**
 * ============================================================
 * LAW 25 CONSENT
 * ============================================================
 * Quebec's Law 25 requires opt-IN for anything non-essential,
 * refusing to be as easy as accepting, and a granular choice.
 * A "by continuing you accept" bar does not comply.
 *
 * The stored decision drives Google Consent Mode v2, which is
 * what actually gates the tags: GTM loads either way, but every
 * storage type starts DENIED and only flips on an explicit yes.
 * ============================================================
 */

export const CONSENT_COOKIE = "b2_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 6 months, then ask again.

export type ConsentState = {
  /** Always true — the site cannot work without these, so they aren't consented to. */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the decision, so we can prove when it was given. */
  decidedAt: string;
};

export function serializeConsent(state: ConsentState): string {
  return `${state.analytics ? 1 : 0}${state.marketing ? 1 : 0}|${state.decidedAt}`;
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  const [flags, decidedAt] = raw.split("|");
  if (!flags || flags.length < 2) return null;
  return {
    necessary: true,
    analytics: flags[0] === "1",
    marketing: flags[1] === "1",
    decidedAt: decidedAt || "",
  };
}

/** Consent Mode v2 signal names, mapped from our two categories. */
export function toConsentMode(state: ConsentState) {
  return {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  } as const;
}
