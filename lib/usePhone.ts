"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { isPaidVisit } from "@/lib/attribution";

export type PhoneNumber = { e164: string; display: string; href: string };

/**
 * Dynamic number insertion.
 *
 * Visitors carrying a gclid/fbclid see the call-tracking number so the call
 * can be attributed back to the click; everyone else sees the real one.
 *
 * `trackingPhone` is null today, so this returns the real number for
 * everybody — and it does so on the FIRST render, server and client alike,
 * which means no layout shift and no flash of a swapped number. When a
 * tracking pool is bought, filling in `trackingPhone` in config/site.ts is
 * the only change needed.
 */
export function usePhone(): PhoneNumber {
  const [phone, setPhone] = useState<PhoneNumber>(siteConfig.phone);

  useEffect(() => {
    const tracking = siteConfig.trackingPhone;
    if (!tracking) return;
    if (!isPaidVisit()) return;
    setPhone(tracking);
  }, []);

  return phone;
}
