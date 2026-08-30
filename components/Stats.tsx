"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ThumbsUp, FileCheck, Calendar, Shield, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
}

function StatFigure({ value, suffix, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-4xl font-black tracking-tight text-brand-600 sm:text-5xl">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-600 sm:text-sm">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();


  const features = [
    {
      icon: ThumbsUp,
      title: t.stats?.noRefusal || "AUCUN VÉHICULE REFUSÉ",
      description: t.stats?.noRefusalDesc || "Même ceux sans moteur, sans roues ou ayant été déclarés perte totale.",
    },
    {
      icon: FileCheck,
      title: t.stats?.noTracas || "AUCUN TRACAS",
      description: t.stats?.noTracasDesc || "On s'occupe de tout : transfert, déclaration à la SAAQ, etc.",
    },
    {
      icon: Calendar,
      title: t.stats?.flexible || "7 JOURS SUR 7",
      description: t.stats?.flexibleDesc || "Horaire flexible, y compris les fins de semaine et jours fériés.",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-4 sm:mb-8 md:mb-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.stats?.title || "POURQUOI ALPHA"} <span className="text-brand-600">{t.stats?.titleHighlight || "RECYCLAGE ?"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.stats?.subtitle || "Vendre une vieille voiture scrap n'a jamais été aussi simple — on s'occupe de tout pour vous faciliter la vie."}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-2 sm:mb-8 md:mb-14">
          {/* Left side - Stats */}
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            <StatFigure
              value={10000}
              suffix="+"
              label={t.stats?.vehiclesPurchased || "VÉHICULES ACHETÉS PAR ANNÉE"}
            />
            <StatFigure
              value={350}
              suffix="+"
              label={t.stats?.positiveReviews || "AVIS POSITIFS DE NOS CLIENTS"}
            />

            {/* Experience badge */}
            <div className="flex justify-center">
              <div className="bg-brand-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-sm">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">25+</div>
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-90">
                  {t.stats?.yearsExperience || "ANNÉES D'EXPÉRIENCES"}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Car image */}
          <div className="relative mt-4 md:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image
                src="/scrapyar.jpg"
                alt={t.stats?.imageAlt || "ACHAT GARANTI, PEU IMPORTE L'ÉTAT DE L'AUTO !"}
                fill
                className="object-cover"
              />
            </div>

            {/* Floating guarantee badge */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 bg-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl shadow-sm border-2 border-brand-500">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-brand-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase text-center">
                {t.stats?.guaranteed || "ACHAT GARANTI"}
              </p>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-600" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission / About Section */}
        <div id="about" className="mt-4 sm:mt-8 md:mt-12 max-w-4xl mx-auto scroll-mt-28">
           <div className="text-center mb-5 sm:mb-8 md:mb-10">
             <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {t.about.title} <span className="text-brand-600">{t.about.titleHighlight}</span>
             </h2>
             <div className="mx-auto mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
             </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {t.about.list.map((item, index) => (
                <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 sm:text-base">
                  <div className="bg-brand-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />
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
