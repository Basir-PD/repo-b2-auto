"use client";

import { siteConfig } from "@/config/site";
import { NO_SWAP, trackWhatsApp } from "@/lib/tracking";
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
 *
 * Next to a call button it is the second choice: `outline` (light sections)
 * and `outline-dark` (dark sections) keep the glyph green but leave the solid
 * fill to the phone, which is the main button on every page.
 */
const VARIANTS = {
  solid:
    "bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 hover:bg-[#1FBE5A] focus-visible:ring-slate-900",
  outline:
    "border-2 border-slate-300 bg-white text-slate-900 hover:border-[#25D366] focus-visible:ring-brand-600",
  "outline-dark":
    "border-2 border-white/25 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-slate-950",
} as const;

export default function WhatsAppLink({
  source,
  label,
  prefill,
  variant = "solid",
  className = "",
}: {
  source: string;
  label: string;
  prefill?: string;
  variant?: "solid" | "outline" | "outline-dark";
  className?: string;
}) {
  /*
    Points at our own /whatsapp redirect, never at wa.me — the number must not
    appear in the DOM or the call-tracking script rewrites it. See
    app/whatsapp/route.ts.
  */
  const href = prefill
    ? `${siteConfig.whatsapp.clickPath}?text=${encodeURIComponent(prefill)}`
    : siteConfig.whatsapp.clickPath;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      className={`${NO_SWAP} flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 whitespace-nowrap text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppIcon className={`h-5 w-5 shrink-0 ${variant === "solid" ? "" : "text-[#25D366]"}`} />
      {label}
    </a>
  );
}
