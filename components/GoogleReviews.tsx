"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GoogleReviews() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate Header
    gsap.from(headerRef.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Infinite Marquee Animation
    if (sliderRef.current) {
      const totalWidth = sliderRef.current.scrollWidth;
      const viewWidth = sliderRef.current.offsetWidth;
      
      // Clone items for seamless loop if needed (handled in render)
      
      gsap.to(sliderRef.current, {
        x: "-50%", // Move half the width (since we doubled the content)
        duration: 30, // Adjust speed here
        ease: "none",
        repeat: -1,
      });
    }
  }, { scope: containerRef });

  // Duplicate reviews for seamless loop
  const allReviews = [...t.googleReviews.reviews, ...t.googleReviews.reviews, ...t.googleReviews.reviews, ...t.googleReviews.reviews];

  return (
    <section ref={containerRef} className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative mb-6 sm:mb-8 md:mb-12">
        {/* Header */}
        <div ref={headerRef} className="text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-indigo-700" />
            <span>Google Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 sm:mb-4 md:mb-6 tracking-tight">
            {t.googleReviews.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {t.googleReviews.subtitle}
          </p>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div className="relative w-full overflow-hidden py-4 sm:py-6 md:py-10">
        {/* Gradient Masks for fade effect */}
        <div className="absolute top-0 left-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div ref={sliderRef} className="flex gap-4 sm:gap-6 md:gap-8 w-max px-2 sm:px-4">
          {allReviews.map((review, index) => (
            <div key={index} className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] flex-shrink-0 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-slate-100 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6 md:top-8 md:right-8 text-indigo-100 group-hover:text-indigo-50 transition-colors duration-300">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-current" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 sm:gap-1 mb-4 sm:mb-5 md:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6 md:mb-8 leading-relaxed relative z-10 line-clamp-4">
                "{review.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h4 className="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[150px] text-sm sm:text-base">{review.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 fill-blue-50 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
                    <span>Local Guide</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Google Logo/Badge (Optional visual cue) */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor">
                  <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
