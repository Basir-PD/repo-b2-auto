"use client";

import { Phone } from "lucide-react";
import { usePhone } from "@/lib/usePhone";
import { trackCall } from "@/lib/tracking";

/**
 * Every tappable phone number on the site. Centralised so the DNI swap and
 * the click_to_call event can never be forgotten on one of them.
 *
 * There is deliberately no `aria-label`. This link always renders visible
 * text — the number itself when nothing else is given — and an aria-label
 * that does not contain that text hands voice-control users a name they
 * cannot say: "Appeler +1 (514) 623-2787" on screen, "Appeler Autos B2" to
 * the assistive layer, and no way to match the two. The visible text is
 * already the better accessible name.
 */
export default function PhoneLink({
  source,
  label,
  className = "",
  labelClassName,
  showIcon = false,
  children,
}: {
  /** Where on the page this was tapped — becomes the event's `source`. */
  source: string;
  /** Overrides the number as the visible text. */
  label?: string;
  className?: string;
  /**
   * Applied to the text itself, so a caller can hide the number at narrow
   * widths and keep the icon. Use `sr-only`, never `hidden`: `display: none`
   * drops the text out of the accessibility tree and leaves the link with no
   * name at all.
   */
  labelClassName?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}) {
  const phone = usePhone();

  return (
    <a
      href={phone.href}
      onClick={() => trackCall(source)}
      className={className}
      data-phone={phone.e164}
    >
      {showIcon && (
        <Phone className="h-5 w-5 shrink-0" strokeWidth={2.5} fill="currentColor" aria-hidden="true" />
      )}
      <span className={labelClassName}>{children ?? label ?? phone.display}</span>
    </a>
  );
}
