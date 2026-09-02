/**
 * ============================================================
 * AD ATTRIBUTION
 * ============================================================
 * Click IDs arrive on the landing URL and are gone the moment the
 * visitor navigates. They are captured on first paint and kept in
 * sessionStorage so they can ride along on the lead — which is what
 * makes an offline conversion upload possible months later, when the
 * deal actually closes.
 * ============================================================
 */

const KEY = "b2_attribution";

/** Click IDs and campaign params worth keeping. */
const TRACKED_PARAMS = [
  "gclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "msclkid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = Partial<Record<(typeof TRACKED_PARAMS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
};

/**
 * Read from the URL, merge over anything already stored, persist.
 *
 * First touch wins for a param already captured this session: someone who
 * clicks an ad, browses, then arrives again organically should still be
 * credited to the ad.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const stored = readAttribution();
  const url = new URL(window.location.href);
  const next: Attribution = { ...stored };

  for (const param of TRACKED_PARAMS) {
    const value = url.searchParams.get(param);
    if (value && !next[param]) next[param] = value.slice(0, 512);
  }

  if (!next.landing_page) next.landing_page = url.pathname;
  if (!next.referrer && document.referrer) next.referrer = document.referrer.slice(0, 512);

  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode, storage disabled — attribution is a nice-to-have, not a
    // reason to break the form.
  }
  return next;
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** True when this visit carries a paid click ID — what DNI keys off. */
export function isPaidVisit(attribution: Attribution = readAttribution()): boolean {
  return Boolean(
    attribution.gclid || attribution.wbraid || attribution.gbraid || attribution.fbclid
  );
}

/**
 * Carry the click IDs across an internal navigation.
 *
 * Only needed for links that leave the SPA; Next's client router keeps the
 * query string off by default, and losing gclid mid-session would break both
 * the offline upload and the DNI swap.
 */
export function withAttribution(href: string): string {
  const attribution = readAttribution();
  const entries = Object.entries(attribution).filter(
    ([key, value]) => value && key !== "landing_page" && key !== "referrer"
  );
  if (!entries.length) return href;

  const [path, existing] = href.split("?");
  const params = new URLSearchParams(existing);
  for (const [key, value] of entries) if (!params.has(key)) params.set(key, value as string);
  return `${path}?${params.toString()}`;
}
