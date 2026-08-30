"use client";

import { Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site";
import { trackCall, trackWhatsApp } from "@/lib/analytics";

/** WhatsApp's glyph — lucide has no brand icons. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.56-.35Z" />
      <path d="M12.04 2C6.6 2 2.17 6.43 2.16 11.87c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.9 9.9 0 0 0 4.7 1.2h.01c5.44 0 9.87-4.43 9.88-9.87A9.82 9.82 0 0 0 19 4.94 9.82 9.82 0 0 0 12.04 2Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.82-3.03-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.21-8.2a8.16 8.16 0 0 1 8.2 8.2c0 4.53-3.68 8.21-8.2 8.21Z" />
    </svg>
  );
}

/**
 * Sticky action bar pinned to the bottom of the screen — phones only.
 *
 * Most Google Ads traffic for a business like this lands on a phone, and the
 * single biggest lever on lead volume is a tap target that never scrolls away.
 * Two ways to reach us, side by side: WhatsApp for people who'd rather send a
 * photo of the car, and tap-to-call for people who want an answer now. On
 * desktop it stays hidden — the header already carries the number and the CTA.
 */
export default function MobileCallBar() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex border-t border-slate-200 shadow-[0_-2px_16px_rgba(15,23,42,0.10)]">
        <a
          href={siteConfig.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp("mobile_bar")}
          aria-label={t.header.whatsappAria}
          className="flex flex-1 items-center justify-center gap-2 bg-[#25d366] py-4 text-sm font-bold text-white transition-colors hover:bg-[#1eb455] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t.header.whatsapp}
        </a>

        <a
          href={siteConfig.phone.href}
          onClick={() => trackCall("mobile_bar")}
          aria-label={t.header.callAria}
          className="flex flex-1 items-center justify-center gap-2 bg-brand-600 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
        >
          <Phone className="h-5 w-5" strokeWidth={2.5} />
          {t.header.callNow}
        </a>
      </div>
    </div>
  );
}
