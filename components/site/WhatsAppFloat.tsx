"use client";

import { siteConfig } from "@/config/site";
import { trackWhatsApp } from "@/lib/tracking";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";

/**
 * Sellers describing a wrecked car reach for the camera before the keyboard,
 * so WhatsApp is a real lead channel here, not a decoration. It sits above
 * the mobile call bar rather than competing with it.
 */
export default function WhatsAppFloat({ ariaLabel }: { ariaLabel: string }) {
  return (
    <a
      href={siteConfig.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp("float")}
      aria-label={ariaLabel}
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
    </a>
  );
}
