"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site";
import { trackCall } from "@/lib/analytics";
import PhoneBadge from "@/components/PhoneBadge";
import HeroQuoteForm from "@/components/HeroQuoteForm";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="bg-white pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="flex items-start gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">
              <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              {t.hero.badge}
            </p>

            <h1 className="mt-5 text-[2.4rem] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-[2.9rem] lg:text-[3.1rem]">
              {t.hero.title} <span className="text-brand-600">{t.hero.titleHighlight}</span>
            </h1>

            <p className="speakable-summary mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.hero.description}
            </p>

            {/*
              Calling is still the primary action — the number sits above the
              form, and on mobile the form falls directly beneath it because
              the trust strip has been moved below the grid.
            */}
            <a
              href={siteConfig.phone.href}
              onClick={() => trackCall("hero")}
              aria-label={t.header.callAria}
              className="group mt-8 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 shadow-sm transition-all hover:border-brand-500 hover:bg-brand-50 hover:shadow-md"
            >
              <PhoneBadge className="h-12 w-12 shrink-0" />
              <span className="flex flex-col leading-none">
                <span className="whitespace-nowrap text-2xl font-black tabular-nums tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 sm:text-3xl">
                  {siteConfig.phone.display}
                </span>
                <span className="mt-1.5 whitespace-nowrap text-xs font-medium text-slate-500">
                  {t.hero.phoneNote}
                </span>
              </span>
            </a>
          </div>

          {/* The short form takes the place the photo used to hold. */}
          <div className="lg:pt-2">
            <HeroQuoteForm />
          </div>
        </div>

        {/*
          Full width, below both columns — so when the grid stacks on mobile
          this lands after the form instead of between it and the phone.
        */}
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-slate-100 pt-7 sm:mt-12">
          {[t.hero.benefits.price, t.hero.benefits.towing, t.hero.benefits.paid].map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Check className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
              {benefit}
            </li>
          ))}
          <li className="w-full text-xs text-slate-500 sm:w-auto sm:border-l sm:border-slate-200 sm:pl-6">
            {t.hero.trustLine}
          </li>
        </ul>
      </div>
    </section>
  );
}
