"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy, Sparkles, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { t } = useLanguage();
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const totalItems = t.faq.items.length;

  const handleFlip = (index: number) => {
    setFlippedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const newProgress = (flippedIndices.size / totalItems) * 100;
    setProgress(newProgress);

    if (newProgress === 100) {
      // Celebration animation
      gsap.to(progressRef.current, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut"
      });
    }
  }, [flippedIndices, totalItems]);

  useGSAP(() => {
    // Initial card deal animation
    gsap.from(cardsRef.current?.children || [], {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      },
      y: 100,
      opacity: 0,
      rotationX: -45,
      stagger: 0.1,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, { scope: containerRef });

  return (
    <section id="faq" ref={containerRef} className="py-24 relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Sci-fi Background Grid */}
      <div className="absolute inset-0 bg-slate-950 -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Gamification Bar */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              {t.faq.title}
            </span>
          </h2>
          
          {/* Knowledge Sync Bar */}
          <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full p-2 shadow-2xl shadow-green-900/20 relative overflow-hidden group">
            <div className="flex items-center justify-between px-4 mb-2 text-xs font-bold uppercase tracking-widest text-green-400">
              <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Knowledge Sync</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            
            {progress === 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-600/90 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-300">
                <span className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  Sync Complete!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3D Card Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {t.faq.items.map((faq, index) => {
            const isFlipped = flippedIndices.has(index);
            return (
              <div 
                key={index}
                className="group h-[300px] w-full [perspective:1000px] cursor-pointer"
                onClick={() => handleFlip(index)}
              >
                <div className={`relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
                  
                  {/* Front Face */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-black/50 [backface-visibility:hidden] group-hover:border-green-500/50 group-hover:shadow-green-500/20 transition-all">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700 group-hover:border-green-500/50">
                      <Sparkles className="w-8 h-8 text-slate-400 group-hover:text-green-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-green-400 transition-colors">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Click to Reveal</p>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-green-900/90 to-slate-900/90 backdrop-blur-xl border border-green-500/30 p-8 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl shadow-green-900/30">
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-lg font-medium text-green-50 leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      Data Synced
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
