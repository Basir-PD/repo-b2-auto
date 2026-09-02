"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor } from "@/config/routes";
import PhoneLink from "@/components/site/PhoneLink";
import { pushEvent } from "@/lib/tracking";

/**
 * Sticky call bar, under 768px, on every page.
 *
 * The spacer below it is not optional: without it the bar covers the last
 * ~64px of every page, and reserving the height in layout rather than
 * overlaying is what keeps CLS at zero.
 */
export default function MobileCallBar({
  lang,
  callLabel,
  quoteLabel,
}: {
  lang: Lang;
  callLabel: string;
  quoteLabel: string;
}) {
  return (
    <>
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-brand-800 pb-[env(safe-area-inset-bottom)] md:hidden">
        <PhoneLink
          source="mobile_bar"
          className="flex h-16 items-center justify-center gap-2 bg-brand-600 text-base font-black text-white active:bg-brand-700"
        >
          <Phone className="h-5 w-5" strokeWidth={2.5} fill="currentColor" />
          {callLabel}
        </PhoneLink>
        <Link
          href={pathFor("quote", lang)}
          onClick={() => pushEvent("quote_calculator_used", { source: "mobile_bar" })}
          className="flex h-16 items-center justify-center gap-2 bg-slate-900 text-base font-black text-white active:bg-slate-800"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
          {quoteLabel}
        </Link>
      </div>
    </>
  );
}
