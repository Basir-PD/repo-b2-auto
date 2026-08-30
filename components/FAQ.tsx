"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  return (
    <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-16">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {t.faq.items.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 flex items-center justify-between text-left gap-3 sm:gap-4"
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
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

          {/* CTA Box */}
          <div className="mt-10 rounded-xl bg-brand-600 p-7 text-center sm:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
              {t.faq?.ctaTitle || "Ready to sell your vehicle?"}
            </h3>
            <p className="text-brand-100 text-sm sm:text-base mb-4 sm:mb-5">
              {t.faq?.ctaSubtitle || "Get your free quote in minutes. We buy all vehicles, any condition."}
            </p>
            <a
              href="tel:+15146232787"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-base font-bold text-brand-600 transition-colors hover:bg-brand-50"
            >
              {t.faq?.ctaButton || "Call Now: +1 (514) 623-2787"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
