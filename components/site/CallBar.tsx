"use client";

import { Phone } from "lucide-react";
import { usePhone } from "@/lib/usePhone";
import { trackCall } from "@/lib/tracking";
import { fbqTrack } from "@/components/site/MetaPixel";

/**
 * The call bar pinned to the bottom of every page, at every width.
 *
 * One action, set the way kennyupull.com sets theirs: a translucent dark
 * strip across the bottom of the screen with a single white button centred
 * in it. The strip lets the page show through, so it reads as part of the
 * browser chrome rather than a slab of colour, and the white button is the
 * only bright thing in it, which is the point.
 *
 * It replaced a phones-only call / WhatsApp pair that stayed hidden on the
 * homepage and until the first 150px of scroll. The phone is the main button
 * on every page now, so it is here on every page, from the first paint.
 * WhatsApp is still in the hero and the closing section of each page, and in
 * the round float on desktop.
 *
 * The number is not on the button, but the button is still a tel: link built
 * from usePhone, carrying data-phone and no NO_SWAP class, so the call
 * tracking swap and the click_to_call event work exactly as on PhoneLink.
 * The event keeps the "mobile_bar" source so reports stay continuous.
 *
 * The spacer is not optional. Without it the bar covers the end of every
 * page; reserving the height in layout rather than overlaying keeps CLS at
 * zero. Keep it in step with the bar: 16px + 50px button + 16px = 82px =
 * 5.125rem, plus the safe area so the button clears an iPhone's home
 * indicator. CookieConsent and WhatsAppFloat sit above the same height.
 */
export default function CallBar({ label }: { label: string }) {
  const phone = usePhone();

  return (
    <>
      <div aria-hidden="true" className="h-[calc(5.125rem+env(safe-area-inset-bottom))]" />
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center bg-[rgba(56,54,52,0.6)] px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <a
          href={phone.href}
          onClick={() => {
            trackCall("mobile_bar");
            fbqTrack("Contact", { content_name: "mobile_bar" });
          }}
          data-phone={phone.e164}
          className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[10px] bg-white px-[26px] py-2 text-center text-[15px] font-bold text-[#383634] shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#383634]"
        >
          <Phone
            className="h-4 w-4 shrink-0"
            strokeWidth={2.5}
            fill="currentColor"
            aria-hidden="true"
          />
          {label}
        </a>
      </div>
    </>
  );
}
