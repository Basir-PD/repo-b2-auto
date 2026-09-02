"use client";

import { Phone } from "lucide-react";
import { usePhone } from "@/lib/usePhone";
import { trackCall } from "@/lib/tracking";

/**
 * Every tappable phone number on the site. Centralised so the DNI swap and
 * the click_to_call event can never be forgotten on one of them.
 */
export default function PhoneLink({
  source,
  label,
  ariaLabel,
  className = "",
  showIcon = false,
  children,
}: {
  /** Where on the page this was tapped — becomes the event's `source`. */
  source: string;
  /** Overrides the number as the visible text. */
  label?: string;
  ariaLabel?: string;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}) {
  const phone = usePhone();

  return (
    <a
      href={phone.href}
      onClick={() => trackCall(source)}
      aria-label={ariaLabel}
      className={className}
      data-phone={phone.e164}
    >
      {showIcon && <Phone className="h-5 w-5 shrink-0" strokeWidth={2.5} fill="currentColor" />}
      {children ?? label ?? phone.display}
    </a>
  );
}
