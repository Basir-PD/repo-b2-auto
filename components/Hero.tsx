"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(textRef.current?.children || [], {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      delay: 0.2,
    })
    .from(imageRef.current, {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    }, "-=0.8");

    // Floating animation for the image
    gsap.to(imageRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500/20 rounded-full blur-[80px] sm:blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div ref={textRef} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              {t.hero.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              {t.hero.title} <br />
              <span className="text-gradient relative inline-block">
                {t.hero.titleHighlight}
                <svg className="absolute w-full h-2 sm:h-3 -bottom-1 left-0 text-indigo-400/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl lg:max-w-2xl font-medium leading-relaxed px-2 sm:px-0">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="#contact"
                className="w-full sm:w-auto min-w-[200px] px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base sm:text-lg uppercase tracking-wide transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <span className="flex items-center gap-2">
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a
                href="tel:+15146232787"
                className="w-full sm:w-auto min-w-[200px] px-6 sm:px-7 md:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 font-bold text-base sm:text-lg transition-all flex items-center justify-center shadow-sm hover:shadow-md group"
              >
                <span>{t.hero.call}</span>
              </a>
            </div>

            <div className="pt-2 sm:pt-4 md:pt-6 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 text-xs sm:text-sm md:text-base font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <span>{t.hero.benefits.price}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <span>{t.hero.benefits.towing}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <span>{t.hero.benefits.paid}</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div ref={imageRef} className="relative h-[280px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[600px] w-full max-w-md sm:max-w-none mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-slate-200 bg-white">
             <Image
              src="/hero-image.png"
              alt="B2 Auto Recycling Tow Truck"
              fill
              className="object-cover object-center"
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
