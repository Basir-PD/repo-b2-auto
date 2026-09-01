"use client";

import Image from "next/image";
import { Check, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site";
import { trackCall } from "@/lib/analytics";
import HeroQuoteForm from "@/components/HeroQuoteForm";

/**
 * The hero is a photograph, not a colour block: our own flatbed with a load
 * on the deck is the fastest proof that we really do the towing ourselves.
 * Copy sits on the dark side of the scrim; the short form keeps its place on
 * the right so the page still opens on a conversion path.
 */
export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-24 lg:pt-36">
      {/*
        One photo, two jobs. A phone screen is far taller than the frame, so
        cropping it to full height would leave a sliver of sheet metal nobody
        can read — there it becomes a band across the top instead. From lg up
        the layout is wide enough to carry the whole frame as the backdrop.
      */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[19rem] sm:h-[24rem] lg:bottom-0 lg:h-auto">
        {/* LCP element, so it loads eagerly. */}
        <Image
          src={siteConfig.heroBackground}
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />

        {/*
          Scrims, one per axis. Stacked layouts read top-to-bottom, so the dark
          has to close off the bottom of the band; side-by-side layouts only
          need the left protected, which leaves the truck lit on the right.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/65 via-55% to-slate-950 lg:hidden"
        />
        {/*
          The scrim loosens as the viewport widens. A 1024px column crops the
          frame down to the cab, so the copy needs most of the width covered;
          past 1280 there is room for the whole truck and the same cover would
          just black it out.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-slate-950 from-30% via-slate-950/88 via-64% to-slate-950/15 lg:block xl:from-18% xl:via-slate-950/70 xl:via-55% xl:to-slate-950/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-slate-950 to-transparent lg:block"
        />
      </div>

      <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 lg:max-w-xl">
            {/* Eyebrow */}
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm sm:text-[13px]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-400" />
              {t.hero.badge}
            </p>

            <h1 className="mt-6 text-[2.5rem] font-black leading-[1.05] tracking-tight text-white sm:text-[3.2rem] lg:text-[3.6rem]">
              {t.hero.title} <span className="text-brand-400">{t.hero.titleHighlight}</span>
            </h1>

            <p className="speakable-summary mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t.hero.description}
            </p>

            {/*
              Calling is the primary action, so the number is a filled button
              rather than a bare line of text — plain type beside an icon reads
              as a heading, not as something you can tap.
            */}
            <div className="mt-8">
              <a
                href={siteConfig.phone.href}
                onClick={() => trackCall("hero")}
                aria-label={t.header.callAria}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-6 py-4 shadow-lg shadow-brand-950/40 transition-all hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 sm:w-auto sm:px-7"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  {/* The ring keeps pulsing behind the icon to say "we're open now". */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/25 motion-safe:animate-phone-ring"
                  />
                  <Phone className="relative h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
                </span>
                <span className="whitespace-nowrap text-2xl font-black tabular-nums tracking-tight text-white sm:text-[1.75rem]">
                  {siteConfig.phone.display}
                </span>
              </a>
              <p className="mt-2.5 text-xs font-medium text-slate-400 sm:text-sm">{t.hero.phoneNote}</p>
            </div>

            {/* Benefits as chips — they hold their contrast over the photo. */}
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {[t.hero.benefits.price, t.hero.benefits.towing, t.hero.benefits.paid].map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 rounded-full bg-white/10 py-2 pl-3 pr-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm"
                >
                  <Check className="h-4 w-4 shrink-0 text-brand-400" strokeWidth={3} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* The short form keeps the right column, now lifted off the photo. */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md sm:max-w-xl lg:ml-auto lg:mr-0 lg:max-w-md">
              <HeroQuoteForm />
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs font-medium text-slate-400 sm:mt-12">
          {t.hero.trustLine}
        </p>
      </div>
    </section>
  );
}
