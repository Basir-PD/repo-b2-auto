"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 relative z-10 overflow-hidden shadow-2xl border-4 border-white -skew-x-3">
              {/* Placeholder for About Image */}
              <div className="absolute inset-0 flex items-center justify-center text-green-200 font-black text-4xl uppercase opacity-20 -rotate-12">
                B2 Auto
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-900">
              {t.about.title} <span className="text-green-600">{t.about.titleHighlight}</span>
            </h2>
            
            <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                {t.about.p1}
              </p>
              <p>
                {t.about.p2}
              </p>
            </div>

            <ul className="space-y-4">
              {t.about.list.map((item, index) => (
                <li key={index} className="flex items-center gap-3 font-bold text-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
