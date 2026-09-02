/**
 * ============================================================
 * DATALAYER EVENTS
 * ============================================================
 * Everything goes through GTM. Components never touch window
 * directly, and nothing breaks when the container ID is unset —
 * pushes queue harmlessly into an array GTM reads when it loads.
 *
 * Set NEXT_PUBLIC_GTM_ID to a GTM-XXXXXXX container.
 * ============================================================
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/** Every event this site fires. Kept as a union so a typo is a build error. */
export type TrackedEvent =
  | "form_start"
  | "generate_lead"
  | "click_to_call"
  | "whatsapp_click"
  | "email_click"
  | "scroll_75"
  | "quote_calculator_used";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushEvent(event: TrackedEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export const trackCall = (source: string) => pushEvent("click_to_call", { source });
export const trackWhatsApp = (source: string) => pushEvent("whatsapp_click", { source });
export const trackEmail = (source: string) => pushEvent("email_click", { source });
