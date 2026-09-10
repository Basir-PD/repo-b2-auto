"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePhone } from "@/lib/usePhone";
import { trackCall, trackWhatsApp } from "@/lib/tracking";
import { fbqTrack } from "@/components/site/MetaPixel";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";

/**
 * Sticky call / WhatsApp bar, phones only.
 *
 * Someone arriving from an ad on a city or service page has no way to make
 * contact without scrolling — the homepage puts both buttons in the hero,
 * but the inner pages do not. This gives every one of them a one-tap route
 * to a call or a chat, which is the whole job of the paid traffic.
 *
 * Deliberately NOT on the homepage: the hero already carries both buttons
 * above the fold, and a second copy fixed to the bottom of the same viewport
 * is noise rather than help.
 *
 * Built as a raised bar rather than two full-bleed colour slabs, so it reads
 * as a native bottom tab bar: a white surface with a hairline and an upward
 * shadow, two rounded actions inset inside it, and the safe-area inset paid
 * by the container so neither button sits under an iPhone's home indicator.
 *
 * WhatsApp is #075E54 — their dark teal — and not the #25D366 brand green.
 * The label is white by request, and white on #25D366 is a 1.98:1 contrast
 * ratio, which is unreadable in daylight and less than half the AA floor.
 * #075E54 is 7.67:1, is WhatsApp's own colour, and stays distinct from the
 * brand green next to it.
 *
 * It stays out of the way until the page has been scrolled 150px. On first
 * paint the visitor is already looking at a phone number in the header and a
 * call button in the hero; a third copy of the same two actions pinned over
 * the bottom of that same screen is a duplicate, and on a short viewport it
 * eats a fifth of what they can see. Past 150px the hero is gone and the bar
 * becomes the only route to a call, which is when it earns the space.
 *
 * The spacer is not optional. Without it the bar covers the last ~68px of
 * every page, and reserving the height in layout rather than overlaying is
 * what keeps CLS at zero. Keep it in step with the bar's real height:
 * 10px top padding + 48px button + 10px bottom padding = 68px = 4.25rem.
 */
export default function MobileContactBar({
  callLabel,
  whatsappLabel,
  prefill,
}: {
  callLabel: string;
  whatsappLabel: string;
  /** Seeds the chat, so the first message is already written. */
  prefill: string;
}) {
  const pathname = usePathname();
  const phone = usePhone();
  const [shown, setShown] = useState(false);

  /*
   * `passive` because this listener never calls preventDefault, and saying so
   * lets the browser scroll without waiting to find out. The state only
   * flips on a crossing, so a scroll is a comparison and not a re-render.
   */
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 150);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/fr/" and "/en/" — the homepage in either language.
  const isHome = /^\/(fr|en)\/?$/.test(pathname);
  if (isHome) return null;

  const waHref = `${siteConfig.whatsapp.href}?text=${encodeURIComponent(prefill)}`;

  const action =
    "flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-black text-white transition-colors";

  return (
    <>
      <div aria-hidden="true" className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />
      {/*
        Translated out rather than unmounted, so the bar slides rather than
        appearing, and `invisible` rather than `hidden` so the transition can
        still run. aria-hidden and inert keep it off the tab order and out of
        a screen reader while it is parked off-screen — a keyboard user
        should not be able to focus a call button that nobody can see.
      */}
      <div
        aria-hidden={!shown}
        inert={!shown || undefined}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(15,23,42,0.10)] backdrop-blur-sm transition-transform duration-200 ease-out motion-reduce:transition-none md:hidden ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={phone.href}
            onClick={() => {
              trackCall("mobile_bar");
              fbqTrack("Contact", { content_name: "mobile_bar" });
            }}
            data-phone={phone.e164}
            className={`${action} bg-brand-600 active:bg-brand-700`}
          >
            <Phone className="h-[18px] w-[18px] shrink-0" strokeWidth={2.5} fill="currentColor" />
            {callLabel}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("mobile_bar")}
            className={`${action} bg-[#075E54] active:bg-[#054C44]`}
          >
            <WhatsAppIcon className="h-[18px] w-[18px] shrink-0" />
            {whatsappLabel}
          </a>
        </div>
      </div>
    </>
  );
}
