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

/**
 * Opt one element out of call-tracking number swapping.
 *
 * WhatConverts rewrites phone numbers it finds on the page into a rented
 * tracking number so it can attribute the call. That is exactly what we want
 * on a `tel:` link and exactly what we must not have on a WhatsApp link: a
 * tracking number is an ordinary phone line with no WhatsApp account, so a
 * swapped wa.me link opens WhatsApp and is told the number "isn't on
 * WhatsApp". The button still looks perfect. It just goes nowhere, and the
 * only way anyone finds out is by clicking it themselves.
 *
 * WhatConverts reads this class off the element holding the number, so every
 * anchor whose href carries the WhatsApp number wears it. It is a string in
 * one place because there are three such anchors and a fourth will be added
 * by someone who has never read this comment.
 *
 * Deliberately NOT applied to `tel:` links or to PhoneLink — those SHOULD
 * swap, or the call tracking measures nothing.
 */
export const NO_SWAP = "no-swap";

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
