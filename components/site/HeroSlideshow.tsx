"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = {
  src: string;
  /** Empty for a picture that only decorates; describe it when it carries a claim. */
  alt: string;
  /** A short line set above the picture, inside the slide. */
  caption?: string;
};

/** How long each slide stays before the next slides in. */
const HOLD_MS = 4500;
/** Full rounds before it stops on the first slide for good. */
const ROUNDS = 2;

/**
 * The hero's pictures, sliding one to the next.
 *
 * It stops after two rounds, back on the first slide: it is there to show
 * what we take on arrival, and a picture that keeps moving beside the call
 * button competes with it. It also holds still while someone points at it
 * or tabs into it, and the dots under it move it by hand. With "reduce
 * motion" it does not move by itself at all.
 *
 * The box has a fixed 2:1 shape and every picture is fitted inside it, so
 * changing slides can never move the page. The first slide loads eagerly,
 * since on a phone it is the largest thing on the first screen.
 */
export default function HeroSlideshow({
  slides,
  label,
  slideLabel,
  sizes,
  className = "",
}: {
  slides: Slide[];
  /** Names the whole slideshow for a screen reader. */
  label: string;
  /** "{n} of {total}" in the page's language; the numbers are filled in here. */
  slideLabel: string;
  sizes: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [finished, setFinished] = useState(false);
  const total = slides.length;
  const nameOf = (n: number) =>
    slideLabel.replace("{n}", String(n)).replace("{total}", String(total));

  useEffect(() => {
    if (finished || held || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let moves = 0;
    const timer = setInterval(() => {
      moves += 1;
      setIndex((current) => (current + 1) % total);
      if (moves >= total * ROUNDS) {
        clearInterval(timer);
        setFinished(true);
      }
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, [finished, held, total]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={className}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, n) => (
            <div
              key={slide.src}
              aria-hidden={n !== index}
              inert={n !== index || undefined}
              className="flex h-full w-full shrink-0 flex-col items-center justify-center"
            >
              {slide.caption && (
                <p className="mb-1.5 text-center text-sm font-black text-brand-800 sm:text-base">
                  {slide.caption}
                </p>
              )}
              <div className="relative w-full flex-1">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  loading="eager"
                  sizes={sizes}
                  quality={72}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-1 flex justify-center">
          {slides.map((slide, n) => (
            /* A 24px tap target around a small dot: the dot stays small, the finger has room. */
            <button
              key={slide.src}
              type="button"
              aria-label={nameOf(n + 1)}
              aria-current={n === index}
              onClick={() => {
                setIndex(n);
                setFinished(true);
              }}
              className="group flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  n === index ? "w-5 bg-brand-600" : "w-1.5 bg-slate-300 group-hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
