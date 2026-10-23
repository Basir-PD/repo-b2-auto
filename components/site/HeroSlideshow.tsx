"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";

export type Slide = {
  src: string;
  /** Empty for a picture that only decorates; describe it when it carries a claim. */
  alt: string;
  /** A short line set above the picture, inside the slide. */
  caption?: string;
  /**
   * "contain" (the default) fits a cut-out picture inside the box whole;
   * "cover" fills the box edge to edge, for a photo with its own background,
   * trimming a little off the sides rather than leaving empty bands.
   */
  fit?: "contain" | "cover";
};

/** How long each slide stays before the next slides in. */
const HOLD_MS = 3500;
/** Full rounds before it stops on the first slide for good: two for a short set, one for a long one. */
const roundsFor = (total: number) => (total >= 4 ? 1 : 2);
/** How far a finger has to travel before the gesture counts as a swipe or a scroll. */
const DECIDE_PX = 8;
/** Share of the width a swipe has to cover to change slide on release. */
const SWIPE_SHARE = 0.18;

/**
 * The hero's pictures, sliding one to the next.
 *
 * It stops after two rounds (one, with four slides or more), back on the
 * first slide: it is there to show
 * what we take on arrival, and a picture that keeps moving beside the call
 * button competes with it. It also holds still while someone points at it
 * or tabs into it, and the dots under it move it by hand. With "reduce
 * motion" it does not move by itself at all.
 *
 * A finger can drag it: the pictures follow the finger, and on release it
 * moves on a slide if the drag went far enough, otherwise it springs back.
 * A mostly vertical drag is left to the page (touch-action: pan-y), so the
 * slideshow never gets in the way of scrolling. Past the first or last
 * slide the drag only gives a little, so it is clear there is nothing there.
 * Once someone swipes or taps a dot, it stops moving on its own.
 *
 * The box has a fixed 2:1 shape and every picture is fitted inside it, so
 * changing slides can never move the page. The first slide loads eagerly,
 * since on a phone it is the largest thing on the first screen. Each later
 * picture is only put on the page once the slide before it is showing, so it
 * has loaded by its turn without every photo being fetched on arrival.
 */
export default function HeroSlideshow({
  slides,
  label,
  slideLabel,
  sizes,
  aspect = "aspect-[2/1]",
  onlyFrom,
  className = "",
}: {
  slides: Slide[];
  /** Names the whole slideshow for a screen reader. */
  label: string;
  /** "{n} of {total}" in the page's language; the numbers are filled in here. */
  slideLabel: string;
  sizes: string;
  /** The box's shape, as a Tailwind class; it never changes, so slides never move the page. */
  aspect?: string;
  /**
   * Only come alive from this viewport width up (px). Below it the slideshow
   * loads no pictures and does not move, so a copy kept for wide screens
   * (and hidden by its parent on a phone) costs a phone nothing.
   */
  onlyFrom?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [finished, setFinished] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  // The furthest slide shown so far; pictures up to one past it are on the page.
  const [reach, setReach] = useState(0);
  const [awake, setAwake] = useState(onlyFrom === undefined);
  const gesture = useRef<{ x: number; y: number; axis: "x" | "y" | null } | null>(null);
  const total = slides.length;
  const nameOf = (n: number) =>
    slideLabel.replace("{n}", String(n)).replace("{total}", String(total));

  useEffect(() => {
    if (onlyFrom === undefined) return;
    const wide = window.matchMedia(`(min-width: ${onlyFrom}px)`);
    const update = () => setAwake(wide.matches);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, [onlyFrom]);

  useEffect(() => {
    if (!awake || finished || held || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let moves = 0;
    const timer = setInterval(() => {
      moves += 1;
      setIndex((current) => (current + 1) % total);
      if (moves >= total * roundsFor(total)) {
        clearInterval(timer);
        setFinished(true);
      }
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, [awake, finished, held, total]);

  useEffect(() => setReach((r) => Math.max(r, index)), [index]);

  const go = (n: number) => {
    setIndex(Math.max(0, Math.min(total - 1, n)));
    setFinished(true);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (total < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
    gesture.current = { x: event.clientX, y: event.clientY, axis: null };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (start.axis === null) {
      if (Math.abs(dx) < DECIDE_PX && Math.abs(dy) < DECIDE_PX) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (start.axis === "y") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      setHeld(true);
    }
    if (start.axis !== "x") return;
    // Nothing before the first slide or after the last: the drag only gives a little.
    const atEdge = (index === 0 && dx > 0) || (index === total - 1 && dx < 0);
    setDragX(atEdge ? dx / 3 : dx);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.axis !== "x") return;
    const width = event.currentTarget.clientWidth || 1;
    const dx = event.clientX - start.x;
    if (dx < -width * SWIPE_SHARE) go(index + 1);
    else if (dx > width * SWIPE_SHARE) go(index - 1);
    else setFinished(true);
    setDragX(0);
    setDragging(false);
    if (event.pointerType !== "mouse") setHeld(false);
  };

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
      <div
        className={`relative ${aspect} w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          className={`flex h-full ${
            dragging
              ? ""
              : "transition-transform duration-[550ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
          }`}
          style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
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
              <div
                className={`relative w-full flex-1 ${slide.fit === "cover" ? "overflow-hidden rounded-xl" : ""}`}
              >
                {awake && n <= reach + 1 && (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    loading="eager"
                    draggable={false}
                    sizes={sizes}
                    quality={72}
                    className={slide.fit === "cover" ? "object-cover" : "object-contain"}
                  />
                )}
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
              onClick={() => go(n)}
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
