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
    <section id="services" ref={containerRef} className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">
            {t.services.title}
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            {t.services.subtitle}
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
