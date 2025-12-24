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
  const sliderRow1Ref = useRef<HTMLDivElement>(null);
  const sliderRow2Ref = useRef<HTMLDivElement>(null);

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

    // Row 1 - Scroll left to right
    if (sliderRow1Ref.current) {
      gsap.to(sliderRow1Ref.current, {
        x: "-50%",
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }

    // Row 2 - Scroll right to left (opposite direction)
    if (sliderRow2Ref.current) {
      gsap.fromTo(sliderRow2Ref.current,
        { x: "-50%" },
        {
          x: "0%",
          duration: 30,
          ease: "none",
          repeat: -1,
        }
      );
    }
  }, { scope: containerRef });

  // Duplicate reviews for seamless loop
  const allReviews = [...t.googleReviews.reviews, ...t.googleReviews.reviews, ...t.googleReviews.reviews, ...t.googleReviews.reviews];

  const ReviewCard = ({ review, index }: { review: { name: string; date: string; text: string }; index: number }) => (
    <div className="w-[260px] sm:w-[300px] md:w-[350px] lg:w-[380px] flex-shrink-0 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-200 relative group hover:shadow-lg transition-all duration-300">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3 sm:mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 leading-relaxed line-clamp-3 sm:line-clamp-4">
        "{review.text}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-2 sm:gap-3 mt-auto">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {review.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="font-bold text-slate-900 truncate text-xs sm:text-sm">{review.name}</h4>
            <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-50 flex-shrink-0" />
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500">{review.date}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative mb-8 sm:mb-10 md:mb-12">
        {/* Header */}
        <div ref={headerRef} className="text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-indigo-700" />
            <span>Google Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 md:mb-6 tracking-tight">
            {t.googleReviews.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {t.googleReviews.subtitle}
          </p>
        </div>
      </div>

      {/* Reviews Carousel - Two Rows */}
      <div className="relative w-full overflow-hidden space-y-3 sm:space-y-4">
        {/* Gradient Masks for fade effect */}
        <div className="absolute top-0 left-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Row 1 */}
        <div ref={sliderRow1Ref} className="flex gap-3 sm:gap-4 md:gap-6 w-max">
          {allReviews.map((review, index) => (
            <ReviewCard key={`row1-${index}`} review={review} index={index} />
          ))}
        </div>

        {/* Row 2 */}
        <div ref={sliderRow2Ref} className="flex gap-3 sm:gap-4 md:gap-6 w-max">
          {allReviews.map((review, index) => (
            <ReviewCard key={`row2-${index}`} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
