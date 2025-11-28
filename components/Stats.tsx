"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ThumbsUp, FileCheck, Calendar, Shield, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  duration?: number;
}

function AnimatedNumber({ end, suffix, label, duration = 2 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const numberRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useGSAP(() => {
    if (!numberRef.current) return;

    ScrollTrigger.create({
      trigger: numberRef.current,
      start: "top 80%",
      onEnter: () => {
        if (!hasAnimated) {
          setHasAnimated(true);
          gsap.to({ val: 0 }, {
            val: end,
            duration: duration,
            ease: "power2.out",
            onUpdate: function() {
              setCount(Math.floor(this.targets()[0].val));
            }
          });
        }
      }
    });
  }, { scope: numberRef });

  return (
    <div ref={numberRef} className="text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-indigo-600 mb-1 sm:mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs sm:text-sm md:text-base font-bold text-slate-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the experience badge
    gsap.from(badgeRef.current, {
      scrollTrigger: {
        trigger: badgeRef.current,
        start: "top 80%",
      },
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });

    // Animate the car image
    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 80%",
      },
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });

    // Animate feature icons
    gsap.from(featuresRef.current?.children || [], {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

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
    <section ref={containerRef} className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter text-slate-900 mb-3 sm:mb-4">
            {t.stats?.title || "POURQUOI ALPHA"} <span className="text-indigo-600">{t.stats?.titleHighlight || "RECYCLAGE ?"}</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto px-2">
            {t.stats?.subtitle || "Vendre une vieille voiture scrap n'a jamais été aussi simple — on s'occupe de tout pour vous faciliter la vie."}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-20">
          {/* Left side - Stats */}
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            <AnimatedNumber
              end={10000}
              suffix="+"
              label={t.stats?.vehiclesPurchased || "VÉHICULES ACHETÉS PAR ANNÉE"}
              duration={2.5}
            />
            <AnimatedNumber
              end={350}
              suffix="+"
              label={t.stats?.positiveReviews || "AVIS POSITIFS DE NOS CLIENTS"}
              duration={2}
            />

            {/* Experience badge */}
            <div ref={badgeRef} className="flex justify-center">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">25+</div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  {t.stats?.yearsExperience || "ANNÉES D'EXPÉRIENCES"}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Car image */}
          <div ref={imageRef} className="relative mt-4 md:mt-0">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 relative group">
              <Image
                src="/scrapyar.jpg"
                alt={t.stats?.imageAlt || "ACHAT GARANTI, PEU IMPORTE L'ÉTAT DE L'AUTO !"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Animated overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating guarantee badge */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 bg-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border-2 border-indigo-500 transform hover:rotate-3 transition-transform duration-300">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-indigo-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs font-black text-slate-900 uppercase text-center">
                {t.stats?.guaranteed || "ACHAT GARANTI"}
              </p>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:-translate-y-2 sm:last:col-span-2 md:last:col-span-1 sm:last:max-w-md sm:last:mx-auto md:last:max-w-none"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 mb-2 sm:mb-3 uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission / About Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 max-w-4xl mx-auto">
           <div className="text-center mb-8 sm:mb-10 md:mb-12">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4 sm:mb-5 md:mb-6">
                {t.about.title} <span className="text-indigo-600">{t.about.titleHighlight}</span>
             </h2>
             <div className="space-y-4 sm:space-y-5 md:space-y-6 text-base sm:text-lg text-slate-600 font-medium leading-relaxed px-2">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
             </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {t.about.list.map((item, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 font-bold text-sm sm:text-base text-slate-800 bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
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
