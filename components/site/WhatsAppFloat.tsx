"use client";

import { siteConfig } from "@/config/site";
import { trackWhatsApp } from "@/lib/tracking";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";

/**
 * Sellers describing a wrecked car reach for the camera before the keyboard,
 * so WhatsApp is a real lead channel here, not a decoration.
 *
 * Desktop only. On a phone it overlapped the form and duplicated the hero's
 * WhatsApp button a few hundred pixels above it, so it earned nothing there.
 */
export default function WhatsAppFloat({ ariaLabel }: { ariaLabel: string }) {
  return (
    <a
      href={siteConfig.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp("float")}
      aria-label={ariaLabel}
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 md:flex items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
    </a>
  );
}
