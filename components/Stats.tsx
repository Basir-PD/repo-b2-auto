"use client";

import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ThumbsUp, FileCheck, Calendar, Shield, CheckCircle2, Check } from "lucide-react";
import Image from "next/image";

/**
 * The condition ledger.
 *
 * This replaced a row of counters — 10,000 vehicles a year, 350 reviews,
 * 25 years. Nobody can check any of those, and a stranger reading them has
 * no reason to. What they actually want to know is narrower and answerable:
 * "will you take mine, in the state it's in?"
 *
 * So the claim becomes a list. Every line is a reason someone assumes their
 * car is worthless, and every line gets the same verdict. Six identical
 * answers argue the point harder than one big number ever did, and each one
 * is a promise we can be held to.
 */
function ConditionLedger() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Same contract as every other reveal on this page: the finished state
    // renders first, and the animation only runs where it can be seen and
    // is welcome. The list is never left blank.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    setRevealed(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setRevealed(true);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
        {t.stats.ledgerEyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-[1.75rem]">
        {t.stats.ledgerTitle}
      </h3>

      {/* Column headings borrow the yard's own intake sheet. */}
      <div className="mt-7 flex items-baseline justify-between gap-4 border-b-2 border-slate-300 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-[11px]">
        <span>{t.stats.ledgerCarColumn}</span>
        <span>{t.stats.ledgerAnswerColumn}</span>
      </div>

      <ul>
        {t.stats.ledgerConditions.map((condition, index) => (
          <li
            key={condition}
            style={{ transitionDelay: `${index * 70}ms` }}
            className={`flex items-center justify-between gap-4 border-b border-slate-200 py-3.5 transition-all duration-500 ease-out ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <span className="text-[15px] font-semibold text-slate-500 line-through decoration-slate-300 decoration-2 sm:text-base">
              {condition}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-black uppercase tracking-wide text-brand-600">
              <Check className="h-4 w-4" strokeWidth={3} />
              {t.stats.ledgerVerdict}
            </span>
          </li>
        ))}
      </ul>

      {/* Pinned to the bottom so the card still reads as a sheet when it stretches. */}
      <p className="mt-auto pt-6 text-sm leading-relaxed text-slate-600">{t.stats.ledgerFooter}</p>
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();

  const features = [
    {
      icon: ThumbsUp,
      title: t.stats.noRefusal,
      description: t.stats.noRefusalDesc,
    },
    {
      icon: FileCheck,
      title: t.stats.noTracas,
      description: t.stats.noTracasDesc,
    },
    {
      icon: Calendar,
      title: t.stats.flexible,
      description: t.stats.flexibleDesc,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
        {/* Main heading */}
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.stats.title} <span className="text-brand-600">{t.stats.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.stats.subtitle}
          </p>
        </div>

        {/* The ledger carries the argument; the yard photo shows where it ends up. */}
        <div className="mb-10 grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-7">
            <ConditionLedger />
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[18rem] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src="/scrapyar.jpg"
                alt={t.stats.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />

              {/* Keeps the caption legible over whatever the photo is doing. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/85 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600">
                  <Shield className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
                <p className="text-sm font-black uppercase leading-tight tracking-wide text-white">
                  {t.stats.guaranteed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                <feature.icon className="h-6 w-6 text-brand-600 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission / About Section */}
        <div id="about" className="mx-auto mt-12 max-w-4xl scroll-mt-28 sm:mt-16 md:mt-20">
          <div className="mb-5 text-center sm:mb-8 md:mb-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.about.title} <span className="text-brand-600">{t.about.titleHighlight}</span>
            </h2>
            <div className="mx-auto mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6">
            {t.about.list.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 sm:text-base"
              >
                <div className="flex-shrink-0 rounded-full bg-brand-100 p-1.5 sm:p-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-600 sm:h-6 sm:w-6" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
