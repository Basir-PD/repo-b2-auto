"use client";

import { DollarSign, Truck, Clock, ShieldCheck, Leaf, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();


  const icons = [DollarSign, Truck, Clock, ThumbsUp, Leaf, ShieldCheck];

  return (
    <section id="services" className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.services.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
