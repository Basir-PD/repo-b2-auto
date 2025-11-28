"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !carRef.current) return;

    const ctx = gsap.context(() => {
      // Main timeline for the car journey
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // Car transformation stages
      // Stage 1: Hero - Car appears pristine
      mainTl.fromTo(
        carRef.current,
        {
          opacity: 0,
          scale: 0.5,
          rotate: -15,
          filter: "hue-rotate(0deg) brightness(1)",
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "hue-rotate(0deg) brightness(1)",
          duration: 0.15,
        }
      );

      // Stage 2: Moving down - Car starts showing wear
      mainTl.to(carRef.current, {
        y: "20vh",
        rotate: 5,
        filter: "hue-rotate(20deg) brightness(0.9)",
        duration: 0.2,
      });

      // Stage 3: How it works section - Car bounces and shows damage
      mainTl.to(carRef.current, {
        y: "40vh",
        rotate: -8,
        scale: 0.9,
        filter: "hue-rotate(40deg) brightness(0.8) saturate(0.9)",
        duration: 0.2,
      });

      // Stage 4: Services - Car transforms, parts floating off
      mainTl.to(carRef.current, {
        y: "55vh",
        rotate: 15,
        scale: 0.75,
        filter: "hue-rotate(60deg) brightness(0.7) saturate(0.7)",
        duration: 0.2,
      });

      // Stage 5: Reviews/Contact - Car fully transformed to eco symbol
      mainTl.to(carRef.current, {
        y: "70vh",
        rotate: 0,
        scale: 0.6,
        filter: "hue-rotate(120deg) brightness(1.1) saturate(1.2)",
        duration: 0.25,
      });

      // Particle animation triggered on scroll
      const particles = particlesRef.current?.children;
      if (particles) {
        Array.from(particles).forEach((particle, i) => {
          gsap.to(particle, {
            scrollTrigger: {
              trigger: "body",
              start: `${10 + i * 8}% top`,
              end: `${30 + i * 8}% top`,
              scrub: 1,
            },
            y: gsap.utils.random(-100, 100),
            x: gsap.utils.random(-50, 50),
            opacity: gsap.utils.random(0.3, 0.8),
            scale: gsap.utils.random(0.5, 1.5),
            rotation: gsap.utils.random(-180, 180),
          });
        });
      }

      // Trail path animation
      if (trailRef.current) {
        const pathLength = trailRef.current.getTotalLength();
        gsap.set(trailRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(trailRef.current, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
          strokeDashoffset: 0,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/* SVG Trail Path */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          ref={trailRef}
          d="M 85 5 Q 90 15, 80 25 T 85 45 T 75 65 T 85 85 T 80 95"
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
      </svg>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-0"
            style={{
              left: `${75 + Math.random() * 20}%`,
              top: `${10 + i * 7}%`,
            }}
          >
            {i % 3 === 0 ? (
              // Gear/cog particle
              <svg
                className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fillRule="evenodd"
                  d="M10.5 1.5a1.5 1.5 0 00-1.5 1.5v.382c-.693.165-1.357.403-1.982.706l-.27-.27a1.5 1.5 0 00-2.122 0l-2.12 2.121a1.5 1.5 0 000 2.122l.27.27a8.014 8.014 0 00-.706 1.982H1.5a1.5 1.5 0 00-1.5 1.5v3a1.5 1.5 0 001.5 1.5h.382c.165.693.403 1.357.706 1.982l-.27.27a1.5 1.5 0 000 2.122l2.121 2.12a1.5 1.5 0 002.122 0l.27-.27c.625.303 1.289.541 1.982.706v.57a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-.382a8.013 8.013 0 001.982-.706l.27.27a1.5 1.5 0 002.122 0l2.12-2.121a1.5 1.5 0 000-2.122l-.27-.27c.303-.625.541-1.289.706-1.982h.57a1.5 1.5 0 001.5-1.5v-3a1.5 1.5 0 00-1.5-1.5h-.382a8.014 8.014 0 00-.706-1.982l.27-.27a1.5 1.5 0 000-2.122l-2.121-2.12a1.5 1.5 0 00-2.122 0l-.27.27a8.013 8.013 0 00-1.982-.706V3a1.5 1.5 0 00-1.5-1.5h-3zM12 18a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            ) : i % 3 === 1 ? (
              // Wrench particle
              <svg
                className="w-3 h-3 sm:w-5 sm:h-5 text-amber-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Bolt particle
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.763 9.51a2.25 2.25 0 013.828-1.351.75.75 0 001.06-1.06 3.75 3.75 0 00-6.38 2.252c-.033.307 0 .595.032.822l.154 1.077H8.25a.75.75 0 000 1.5h.421l.138.964a3.75 3.75 0 01-.358 2.065l-.22.44a.75.75 0 00.34 1.002l.262.131a.75.75 0 001.002-.34l.22-.44a5.25 5.25 0 00.501-2.891l-.138-.964h1.832l.138.964a3.75 3.75 0 01-.358 2.065l-.22.44a.75.75 0 00.34 1.002l.262.131a.75.75 0 001.002-.34l.22-.44a5.25 5.25 0 00.501-2.891l-.138-.964h.421a.75.75 0 000-1.5h-.628l-.154-1.077a3.758 3.758 0 00-.032-.822 3.75 3.75 0 00-6.38-2.252.75.75 0 001.06 1.06 2.25 2.25 0 012.768-.339l-.268 1.878H10.03a.75.75 0 000 1.5h1.268l-.138.964h-1.13a.75.75 0 000 1.5h.923l.069.482h-.421a.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Main Floating Car */}
      <div
        ref={carRef}
        className="absolute right-[8%] sm:right-[10%] top-[15%] opacity-0"
      >
        <div className="relative">
          {/* Car Shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 sm:w-24 sm:h-6 bg-black/20 rounded-full blur-md" />

          {/* Car SVG */}
          <svg
            className="w-20 h-12 sm:w-32 sm:h-20 md:w-40 md:h-24 drop-shadow-2xl"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Car Body */}
            <path
              d="M15 35 L20 20 Q25 15, 40 15 L80 15 Q95 15, 100 20 L105 35 L110 40 Q112 45, 110 48 L10 48 Q8 45, 10 40 Z"
              fill="url(#carBodyGradient)"
              stroke="#4338ca"
              strokeWidth="1"
            />

            {/* Windows */}
            <path
              d="M25 33 L28 22 Q30 19, 42 19 L55 19 L55 33 Z"
              fill="url(#windowGradient)"
              opacity="0.9"
            />
            <path
              d="M58 19 L78 19 Q88 19, 90 22 L93 33 L58 33 Z"
              fill="url(#windowGradient)"
              opacity="0.9"
            />

            {/* Roof Line */}
            <path
              d="M28 20 Q35 12, 60 12 Q85 12, 92 20"
              stroke="#4f46e5"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Headlights */}
            <ellipse cx="102" cy="38" rx="4" ry="3" fill="#fbbf24" />
            <ellipse cx="18" cy="38" rx="4" ry="3" fill="#ef4444" opacity="0.8" />

            {/* Wheels */}
            <circle cx="30" cy="48" r="10" fill="#1e293b" />
            <circle cx="30" cy="48" r="6" fill="#475569" />
            <circle cx="30" cy="48" r="2" fill="#94a3b8" />

            <circle cx="90" cy="48" r="10" fill="#1e293b" />
            <circle cx="90" cy="48" r="6" fill="#475569" />
            <circle cx="90" cy="48" r="2" fill="#94a3b8" />

            {/* Door Handle */}
            <rect x="50" y="30" width="8" height="2" rx="1" fill="#3730a3" />

            {/* Gradients */}
            <defs>
              <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c7d2fe" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Sparkle Effects */}
          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Recycling Symbol (appears at bottom) */}
      <div className="absolute bottom-[5%] right-[10%] opacity-0" id="recycleSymbol">
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 text-green-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L8 6h3v6l-5-3v3.5l5 3L6 22h12l-5-6.5 5-3V9l-5 3V6h3l-4-4z" />
        </svg>
      </div>
    </div>
  );
}
