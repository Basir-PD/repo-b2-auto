"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { name: "Home", icon: "🏠" },
    { name: "How", icon: "⚙️" },
    { name: "Stats", icon: "📊" },
    { name: "Reviews", icon: "⭐" },
    { name: "FAQ", icon: "❓" },
    { name: "Contact", icon: "📍" },
  ];

  useEffect(() => {
    // Track scroll progress
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setProgress(self.progress * 100);
        const sectionIndex = Math.min(
          Math.floor(self.progress * sections.length),
          sections.length - 1
        );
        setActiveSection(sectionIndex);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2">
      {/* Progress Bar Track */}
      <div className="relative h-48 w-1 bg-slate-200 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-600 via-brand-500 to-accent-400 rounded-full transition-all duration-300 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Section Dots */}
      <div className="flex flex-col gap-3 mt-4">
        {sections.map((section, index) => (
          <button
            key={section.name}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
              index <= activeSection
                ? "bg-brand-500 scale-125"
                : "bg-slate-300 hover:bg-brand-300"
            }`}
            onClick={() => {
              const targetScroll = (index / (sections.length - 1)) * (document.body.scrollHeight - window.innerHeight);
              window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }}
            aria-label={`Go to ${section.name} section`}
          >
            {/* Tooltip */}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {section.icon} {section.name}
            </span>

            {/* Active Indicator Ring */}
            {index === activeSection && (
              <span className="absolute inset-0 rounded-full border-2 border-brand-400 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* Percentage */}
      <div className="mt-4 text-xs font-bold text-slate-500">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
