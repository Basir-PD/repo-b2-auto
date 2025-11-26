"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ThumbsUp, FileCheck, Calendar, Shield } from "lucide-react";
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
      <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-600 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wide">
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
    <section ref={containerRef} className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
            {t.stats?.title || "POURQUOI ALPHA"} <span className="text-green-600">{t.stats?.titleHighlight || "RECYCLAGE ?"}</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto">
            {t.stats?.subtitle || "Vendre une vieille voiture scrap n'a jamais été aussi simple — on s'occupe de tout pour vous faciliter la vie."}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Left side - Stats */}
          <div className="space-y-12">
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
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl font-black mb-1">25+</div>
                <div className="text-sm font-bold uppercase tracking-wider">
                  {t.stats?.yearsExperience || "ANNÉES D'EXPÉRIENCES"}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Car image */}
          <div ref={imageRef} className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 relative group">
              <Image 
                src="/scrapyar.jpg"
                alt={t.stats?.imageAlt || "ACHAT GARANTI, PEU IMPORTE L'ÉTAT DE L'AUTO !"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Animated overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Floating guarantee badge */}
            <div className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-xl shadow-xl border-2 border-green-500 transform hover:rotate-3 transition-transform duration-300">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-900 uppercase text-center">
                {t.stats?.guaranteed || "ACHAT GARANTI"}
              </p>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
