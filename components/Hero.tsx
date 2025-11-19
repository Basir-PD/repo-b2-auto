"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 font-bold text-sm uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {t.hero.badge}
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              {t.hero.title} <br />
              <span className="text-gradient relative inline-block">
                {t.hero.titleHighlight}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              {t.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-black text-lg uppercase tracking-wide transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:-translate-y-1 flex items-center justify-center gap-2 -skew-x-6 group"
              >
                <span className="skew-x-6 flex items-center gap-2">
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a 
                href="tel:+15146232787"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-green-500 text-slate-700 hover:text-green-600 font-bold text-lg transition-all flex items-center justify-center shadow-sm hover:shadow-md -skew-x-6 group"
              >
                <span className="skew-x-6">{t.hero.call}</span>
              </a>
            </div>

            <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.benefits.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.benefits.towing}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.benefits.paid}</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-200 bg-white">
             <Image
              src="/hero-image.png"
              alt="B2 Auto Recycling Tow Truck"
              fill
              className="object-cover"
              priority
             />
             {/* Overlay gradient for better text contrast if needed, or just style */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
