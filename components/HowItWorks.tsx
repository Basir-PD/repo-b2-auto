"use client";


import { useLanguage } from "@/context/LanguageContext";
import { Phone, Truck, DollarSign, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const { t } = useLanguage();


  const steps = [
    { icon: Phone },
    { icon: Truck },
    { icon: DollarSign },
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20 lg:py-24">


      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10 md:mb-14">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-6 max-w-7xl mx-auto relative">
          {t.howItWorks.steps.map((step, index) => {
            const StepIcon = steps[index].icon;
            return (
              <div key={index} className="group relative sm:last:col-span-2 md:last:col-span-1 sm:last:max-w-md sm:last:mx-auto md:last:max-w-none">
                {/* Card */}
                <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 flex flex-col">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-sm sm:text-base font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon Container */}
                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-brand-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-100 transition-colors duration-300">
                      <StepIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-brand-600" strokeWidth={1.5} />
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
                  <div className="flex items-center gap-2 text-brand-600 font-bold group-hover:gap-4 transition-all cursor-pointer">
                    <span className="uppercase text-xs sm:text-sm tracking-wider">{step.cta}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors duration-300">
                <item.icon className="w-5 h-5 sm:w-5 sm:h-5 text-brand-600" strokeWidth={1.5} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
