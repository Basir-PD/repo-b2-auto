"use client";

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
 * The spacer is not optional. Without it the bar covers the last ~64px of
 * every page, and reserving the height in layout rather than overlaying is
 * what keeps CLS at zero.
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

  // "/fr/" and "/en/" — the homepage in either language.
  const isHome = /^\/(fr|en)\/?$/.test(pathname);
  if (isHome) return null;

  const waHref = `${siteConfig.whatsapp.href}?text=${encodeURIComponent(prefill)}`;

  return (
    <>
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-black/10 pb-[env(safe-area-inset-bottom)] md:hidden">
        <a
          href={phone.href}
          onClick={() => {
            trackCall("mobile_bar");
            fbqTrack("Contact", { content_name: "mobile_bar" });
          }}
          data-phone={phone.e164}
          className="flex h-16 items-center justify-center gap-2 bg-brand-600 text-base font-black text-white active:bg-brand-700"
        >
          <Phone className="h-5 w-5 shrink-0" strokeWidth={2.5} fill="currentColor" />
          {callLabel}
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("mobile_bar")}
          className="flex h-16 items-center justify-center gap-2 bg-[#25D366] text-base font-black text-slate-900 active:bg-[#1FBE5A]"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          {whatsappLabel}
        </a>
      </div>
    </>
  );
}
