"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useGSAP(() => {
    gsap.from(containerRef.current?.children || [], {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-3 sm:mb-4">
              {t.faq.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium px-2">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {t.faq.items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 flex items-center justify-between text-left gap-3 sm:gap-4"
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
