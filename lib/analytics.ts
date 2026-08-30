/**
 * ============================================================
 * CONVERSION TRACKING
 * ============================================================
 * Wraps gtag() so components never touch window directly and
 * nothing breaks when the tags aren't configured yet.
 *
 * Required env vars (add to .env.local / Vercel):
 *   NEXT_PUBLIC_GA_ID                  G-XXXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_ID          AW-XXXXXXXXX
 *   NEXT_PUBLIC_ADS_CALL_LABEL         AW-XXXXXXXXX/xxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_ADS_QUOTE_LABEL        AW-XXXXXXXXX/xxxxxxxxxxxxxxxx
 * ============================================================
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const ADS_CALL_LABEL = process.env.NEXT_PUBLIC_ADS_CALL_LABEL || "";
export const ADS_QUOTE_LABEL = process.env.NEXT_PUBLIC_ADS_QUOTE_LABEL || "";

export const analyticsEnabled = Boolean(GA_ID || GOOGLE_ADS_ID);

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: GtagArgs) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Fire a GA4 event. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  gtag("event", name, params);
}

/** Fire a Google Ads conversion, if a label is configured. */
function trackAdsConversion(label: string, params: Record<string, unknown> = {}) {
  if (!label) return;
  gtag("event", "conversion", { send_to: label, ...params });
}

/**
 * Someone tapped a phone number. This is the primary conversion
 * for a call-driven business - import it into Google Ads as a
 * "Website click-to-call" conversion action.
 */
export function trackCall(source: string) {
  trackEvent("click_to_call", { source, phone_number: "+15146232787" });
  trackAdsConversion(ADS_CALL_LABEL, { event_category: "call", event_label: source });
}

/** A quote form was submitted successfully. */
export function trackQuoteSubmit(source = "quote_form") {
  trackEvent("generate_lead", { source, currency: "CAD", value: 1 });
  trackAdsConversion(ADS_QUOTE_LABEL, { event_category: "lead", event_label: source });
}

/** Someone opened the quote form - useful as a micro-conversion. */
export function trackQuoteStart(source = "header") {
  trackEvent("begin_quote", { source });
}

/**
 * Someone opened a WhatsApp chat. Treated as a lead, not a call:
 * it lands in the same inbox a form submission would.
 */
export function trackWhatsApp(source: string) {
  trackEvent("whatsapp_click", { source });
  trackAdsConversion(ADS_QUOTE_LABEL, { event_category: "lead", event_label: `whatsapp_${source}` });
}
