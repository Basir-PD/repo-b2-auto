"use client";

import { DollarSign, Truck, Clock, ShieldCheck, Leaf, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(titleRef.current?.children || [], {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(gridRef.current?.children || [], {
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const icons = [DollarSign, Truck, Clock, ThumbsUp, Leaf, ShieldCheck];

  return (
    <section id="services" ref={containerRef} className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-slate-50 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-3 sm:mb-4 text-slate-900">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium px-2">
            {t.services.subtitle}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600 group-hover:text-green-700 transition-colors" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-slate-900 group-hover:text-green-700 transition-colors">{service.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium group-hover:text-slate-700 transition-colors">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
