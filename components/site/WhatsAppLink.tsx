"use client";

import { siteConfig } from "@/config/site";
import { trackWhatsApp } from "@/lib/tracking";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";

/**
 * Inline WhatsApp call to action.
 *
 * WhatsApp green plus the glyph, so nobody has to guess where the tap goes —
 * the colour is doing the same job as the label.
 *
 * White on #25D366 is 2.1:1 and does not meet WCAG AA for text. It is set
 * that way on request, because it is what WhatsApp itself uses and what
 * people recognise. If the contrast check needs to pass, the fix is to
 * darken the background rather than to re-darken the text — the pairing is
 * the recognisable part.
 *
 * `prefill` seeds the chat so the first message is already written — for
 * someone standing next to a dead car, that is one less thing to compose.
 */
export default function WhatsAppLink({
  source,
  label,
  prefill,
  className = "",
}: {
  source: string;
  label: string;
  prefill?: string;
  className?: string;
}) {
  const href = prefill
    ? `${siteConfig.whatsapp.href}?text=${encodeURIComponent(prefill)}`
    : siteConfig.whatsapp.href;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      className={`flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-4 whitespace-nowrap text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#1FBE5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      {label}
    </a>
  );
}
