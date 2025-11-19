"use client";

import { DollarSign, Truck, Clock, ShieldCheck, Leaf, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const icons = [DollarSign, Truck, Clock, ThumbsUp, Leaf, ShieldCheck];

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">
            {t.services.title}
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 -skew-x-6">
                  <Icon className="w-7 h-7 text-green-600 skew-x-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-green-700 transition-colors">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
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
