"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Star, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GoogleReviews() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRow1Ref = useRef<HTMLDivElement>(null);
  const sliderRow2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
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

  const ReviewCard = ({ review }: { review: { name: string; date: string; text: string } }) => (
    <div className="relative w-[280px] flex-shrink-0 rounded-xl border border-slate-200 bg-white p-5 sm:w-[340px] md:w-[360px]">
      {/* Stars */}
      <div className="flex gap-0.5 mb-3 sm:mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 leading-relaxed line-clamp-3 sm:line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-2 sm:gap-3 mt-auto">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
    <section ref={containerRef} className="bg-slate-50 py-16 sm:py-20 lg:py-24">

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative mb-8 sm:mb-10 md:mb-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.googleReviews.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.googleReviews.subtitle}
          </p>
        </div>
      </div>

      {/* Reviews Carousel - Two Rows */}
      <div className="relative w-full overflow-hidden space-y-3 sm:space-y-4">
        {/* Gradient Masks for fade effect */}
        <div className="absolute top-0 left-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="absolute top-0 right-0 h-full w-8 sm:w-16 md:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        {/* Row 1 */}
        <div ref={sliderRow1Ref} className="flex gap-3 sm:gap-4 md:gap-6 w-max">
          {allReviews.map((review, index) => (
            <ReviewCard key={`row1-${index}`} review={review} />
          ))}
        </div>

        {/* Row 2 */}
        <div ref={sliderRow2Ref} className="flex gap-3 sm:gap-4 md:gap-6 w-max">
          {allReviews.map((review, index) => (
            <ReviewCard key={`row2-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
