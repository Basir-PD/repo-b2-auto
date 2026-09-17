import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

/**
 * ============================================================
 * GET /whatsapp  —  redirect to the WhatsApp chat
 * ============================================================
 * The WhatsApp buttons link here instead of straight to wa.me,
 * for one reason: THE PHONE NUMBER MUST NOT BE IN THE PAGE.
 *
 * WhatConverts (tag 11 in GTM-5V37JFTD, loaded from a rotating
 * anti-adblock hostname) rewrites every phone number it finds
 * into a rented tracking line so the call can be attributed.
 * That is correct on a tel: link. On a wa.me link it is fatal:
 * the tracking numbers are ordinary phone lines with no
 * WhatsApp account, so the button opened WhatsApp and was told
 * "+1 438 228 5406 isn't on WhatsApp". A different number each
 * visit, because the pool rotates.
 *
 * The documented opt-out — a `no-swap` class on the element —
 * was tried first and did not hold; the swapper reaches into
 * the href regardless. So the href now contains no digits at
 * all. There is nothing on the page left to rewrite, which is a
 * defence that does not depend on a third party honouring a
 * class name, or on anyone remembering this when the vendor
 * changes.
 *
 * Still a real link: right-click, middle-click and open-in-new-
 * tab all behave, which they would not if this were an onClick
 * handler calling window.open.
 * ============================================================
 */

/** Long enough for any prefill the site sends, short enough to not be a vector. */
const MAX_TEXT = 1000;

export function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text");

  const target = new URL(`https://wa.me/${siteConfig.whatsapp.number}`);
  if (text) target.searchParams.set("text", text.slice(0, MAX_TEXT));

  /*
    307, not 308: the destination is a fixed target but the prefill varies per
    button, and a permanent redirect would be cached by the browser against
    /whatsapp itself and serve one button's prefill to every other button.
  */
  return NextResponse.redirect(target, 307);
}
