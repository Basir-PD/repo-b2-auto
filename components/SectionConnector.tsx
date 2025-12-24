"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionConnectorProps {
  variant?: "wave" | "diagonal" | "curve" | "zigzag";
  fromColor?: "white" | "slate-50" | "slate-950";
  toColor?: "white" | "slate-50" | "slate-950";
  flip?: boolean;
}

const colorMap: Record<string, string> = {
  white: "#ffffff",
  "slate-50": "#f8fafc",
  "slate-950": "#020617",
};

export default function SectionConnector({
  variant = "wave",
  fromColor = "slate-50",
  toColor = "white",
  flip = false,
}: SectionConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the path drawing
      const pathLength = pathRef.current!.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(pathRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
        strokeDashoffset: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const paths = {
    wave: "M0,50 Q25,0 50,50 T100,50",
    diagonal: "M0,100 L100,0",
    curve: "M0,100 Q50,0 100,100",
    zigzag: "M0,100 L25,0 L50,100 L75,0 L100,100",
  };

  const fromHex = colorMap[fromColor] || colorMap.white;
  const toHex = colorMap[toColor] || colorMap.white;

  return (
    <div
      ref={containerRef}
      className={`relative h-4 sm:h-8 md:h-16 w-full overflow-hidden ${
        flip ? "rotate-180" : ""
      }`}
      style={{
        background: `linear-gradient(to bottom, ${fromHex}, ${toHex})`,
      }}
    >
      {/* SVG Decorative Path */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`connectorGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={paths[variant]}
          fill="none"
          stroke={`url(#connectorGradient-${variant})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Floating Dots */}
      <div className="absolute inset-0 flex items-center justify-around px-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400/30 animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              transform: `translateY(${Math.sin(i) * 10}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
