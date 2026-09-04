"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor, otherLang } from "@/config/routes";
import { twinPath } from "@/lib/twinPath";
import { siteConfig } from "@/config/site";
import PhoneLink from "@/components/site/PhoneLink";
import { pushEvent } from "@/lib/tracking";

export type HeaderLabels = {
  nav: { href: string; label: string }[];
  quote: string;
  hours: string;
  switchTo: string;
  switchAria: string;
  menuOpen: string;
  menuClose: string;
};

/**
 * The phone number is a tappable link at every breakpoint — never folded into
 * the hamburger. On a page whose job is generating calls, hiding the number
 * behind a tap is the most expensive thing the header can do.
 */
export default function SiteHeader({ lang, labels }: { lang: Lang; labels: HeaderLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Computed from the current path rather than passed down, so the switcher
  // always points at the equivalent page — the layout cannot know which page
  // is rendering inside it.
  const switchHref = twinPath(pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href={pathFor("home", lang)} className="flex shrink-0 items-center">
          {/*
            eager, not priority: it is above the fold so it must not wait for
            an intersection, but a preload would put it in competition with
            the hero image, which is the LCP element. width/height are the
            artwork's real pixels, so the row cannot shift as it decodes.
          */}
          <Image
            src="/logo-autob2.png"
            alt={siteConfig.name}
            width={289}
            height={109}
            loading="eager"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex xl:gap-7" aria-label="Primary">
          {labels.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.06em] text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {switchHref && (
            <Link
              href={switchHref}
              hrefLang={otherLang(lang)}
              lang={otherLang(lang)}
              title={labels.switchAria}
              className="rounded-md px-2 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {labels.switchTo}
            </Link>
          )}

          {/* Always visible, every breakpoint. */}
          {/*
            Below sm the number is visually hidden so the menu button still
            fits, but it stays in the accessibility tree — `sr-only`, not
            `hidden`, or the link would have no accessible name at all.
          */}
          <PhoneLink
            source="header"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-black uppercase tabular-nums tracking-[0.02em] text-white transition-colors hover:bg-brand-700 call-pulse sm:px-4 sm:text-base"
            labelClassName="sr-only sm:not-sr-only"
            showIcon
          />

          <Link
            href={pathFor("quote", lang)}
            onClick={() => pushEvent("quote_calculator_used", { source: "header" })}
            className="hidden rounded-lg border-2 border-brand-600 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.06em] text-brand-700 transition-colors hover:bg-brand-50 xl:inline-flex"
          >
            {labels.quote}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? labels.menuClose : labels.menuOpen}
            className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 xl:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-3 sm:px-6" aria-label="Mobile">
            {labels.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-slate-100 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={pathFor("quote", lang)}
              className="mt-4 rounded-lg bg-brand-600 px-5 py-3.5 text-center text-sm font-bold uppercase tracking-[0.06em] text-white"
            >
              {labels.quote}
            </Link>
            <p className="py-3 text-center text-xs font-medium text-slate-500">{labels.hours}</p>
          </nav>
        </div>
      )}
    </header>
  );
}
