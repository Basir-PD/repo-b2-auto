"use client";


import { useLanguage } from "@/context/LanguageContext";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Truck, DollarSign, ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;

    // Animate cards
    gsap.from(cards, {
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.25,
      ease: "power3.out",
    });

    // Animate timeline line
    if (timelineRef.current) {
      gsap.from(timelineRef.current, {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, { scope: containerRef });

  const steps = [
    { icon: Phone },
    { icon: Truck },
    { icon: DollarSign },
  ];

  return (
    <section ref={containerRef} className="py-10 sm:py-14 md:py-20 lg:py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-amber-400/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-violet-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-r from-indigo-300/5 to-emerald-300/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-3 sm:mb-4 md:mb-6 tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed px-2">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Timeline Connector with Animated Truck & Ground - Hidden on mobile */}
        <div className="hidden lg:block relative mb-16 h-32">
          {/* Timeline Line */}

          
          {/* Animated Ground/Road Pattern */}
          <div className="absolute top-1/2 left-0 right-0 h-24 -translate-y-1/2 overflow-hidden pointer-events-none z-0">
            {/* Road surface with animated dashes */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-200/40 to-slate-300/40 rounded-lg">
              {/* Animated road dashes */}
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 overflow-hidden">
                <div className="animate-road-dash flex gap-8 absolute">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-12 h-1 bg-white/60 rounded-full flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Tow Truck with Damaged Car SVG */}
          <div className="absolute top-10/12 left-5/12 -translate-y-1/2 w-full h-32 pointer-events-none z-20">
            <div className="relative w-full h-full overflow-visible">
              {/* Container that moves along the timeline */}
              <div className="absolute animate-truck-drive" style={{ animationDuration: '12s' }}>
                {/* Truck Body */}
                <div className="absolute left-0 top-[65%] -translate-y-1/2 animate-truck-bounce">
                  <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className="drop-shadow-xl">
                    {/* Truck Cabin */}
                    <path d="M10 30H40V50H10V30Z" fill="#10b981" />
                    <path d="M40 30H55L60 50H40V30Z" fill="#059669" />
                    <path d="M42 32H52L55 40H42V32Z" fill="#d1fae5" opacity="0.6" /> {/* Window */}
                    
                    {/* Truck Bed */}
                    <path d="M0 40H40V50H0V40Z" fill="#374151" />
                    <path d="M-10 42L40 42" stroke="#4b5563" strokeWidth="2" /> {/* Bed detail */}

                    {/* Wheels */}
                    <circle cx="20" cy="50" r="7" fill="#1f2937" />
                    <circle cx="20" cy="50" r="3" fill="#9ca3af" />
                    <circle cx="50" cy="50" r="7" fill="#1f2937" />
                    <circle cx="50" cy="50" r="3" fill="#9ca3af" />
                    
                    {/* Lights */}
                    <path d="M60 42H62V46H60V42Z" fill="#fbbf24" /> {/* Headlight */}
                    
                    {/* Damaged Car on Bed */}
                    <g transform="translate(-5, 22) rotate(-5)">
                      <path d="M5 10H35V20H5V10Z" fill="#ef4444" /> {/* Car Body */}
                      <path d="M10 10L15 2H30L35 10H10Z" fill="#dc2626" /> {/* Car Top */}
                      <path d="M12 4H18V8H12V4Z" fill="#fee2e2" opacity="0.6" /> {/* Broken Window */}
                      <path d="M22 4H28V8H22V4Z" fill="#fee2e2" opacity="0.4" /> {/* Broken Window */}
                      <circle cx="12" cy="20" r="4" fill="#1f2937" />
                      <circle cx="28" cy="20" r="4" fill="#1f2937" />
                      {/* Smoke/Damage effect */}
                      <path d="M20 0C22 -5 25 -2 28 -6" stroke="#9ca3af" strokeWidth="2" opacity="0.5" />
                    </g>
                  </svg>
                </div>
                
                {/* Speed lines */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 animate-speed-lines">
                  <div className="w-8 h-0.5 bg-indigo-300 rounded-full" />
                  <div className="w-5 h-0.5 bg-indigo-300 rounded-full ml-2" />
                  <div className="w-10 h-0.5 bg-indigo-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes truck-drive {
            0% {
              left: -150px;
            }
            100% {
              left: calc(100% + 150px);
            }
          }
          
          @keyframes truck-bounce {
            0%, 100% {
              transform: translateY(-50%) translateY(0px);
            }
            50% {
              transform: translateY(-50%) translateY(-2px);
            }
          }
          
          @keyframes road-dash {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-80px);
            }
          }

          @keyframes speed-lines {
            0%, 100% { opacity: 0; transform: translateX(0); }
            50% { opacity: 1; transform: translateX(-5px); }
          }
          
          .animate-car-drive {
            animation: car-drive 10s linear infinite;
          }
          
          .animate-car-bounce {
            animation: car-bounce 0.5s ease-in-out infinite;
          }
          
          .animate-road-dash {
            animation: road-dash 1s linear infinite;
          }

          .animate-speed-lines {
            animation: speed-lines 1s ease-in-out infinite;
          }
        `}</style>

        {/* Steps Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-6 max-w-7xl mx-auto relative">
          {t.howItWorks.steps.map((step, index) => {
            const StepIcon = steps[index].icon;
            return (
              <div key={index} className="group relative sm:last:col-span-2 md:last:col-span-1 sm:last:max-w-md sm:last:mx-auto md:last:max-w-none">
                {/* Card */}
                <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 flex flex-col">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-sm sm:text-base font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon Container */}
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                      <StepIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-indigo-600" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-4 sm:mb-5 md:mb-6 flex-grow">
                    {step.description}
                  </p>

                  {/* CTA Link */}
                  <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all cursor-pointer">
                    <span className="uppercase text-xs sm:text-sm tracking-wider">{step.cta}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>

                {/* Connecting Arrow - Desktop only */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-12 -right-8 z-10">
                    <ArrowRight className="w-16 h-16 text-amber-400 animate-pulse" strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Stats/Icons Row */}
        <div className="mt-6 sm:mt-10 md:mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {[
            { icon: Phone, label: t.howItWorks.bottomIcons.call },
            { icon: Truck, label: t.howItWorks.bottomIcons.pickup },
            { icon: DollarSign, label: t.howItWorks.bottomIcons.cash },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                <item.icon className="w-5 h-5 sm:w-5 sm:h-5 text-indigo-600" strokeWidth={1.5} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
