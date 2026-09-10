"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up the first time it is scrolled into view.
 *
 * Three things this deliberately does NOT do:
 *
 *   - Start at zero on the server. The final value is what renders in the
 *     HTML, so the number is correct before hydration, correct with
 *     JavaScript off, and correct to anything reading the page that is not
 *     a browser. The animation is decoration applied afterwards, never the
 *     source of the number.
 *   - Run twice. It fires once, then disconnects the observer. A figure that
 *     re-rolls every time it scrolls past reads as a broken widget.
 *   - Ignore `prefers-reduced-motion`. Someone who has asked the OS to stop
 *     things moving gets the final number immediately.
 *
 * Eased out rather than linear: a constant-rate counter looks mechanical,
 * and the slow settle onto the last few units is the part that reads as
 * "counting".
 */
export default function CountUp({
  value,
  locale,
  unit = "",
  durationMs = 1400,
  className,
}: {
  value: number;
  /** "fr-CA" spaces its thousands, "en-CA" commas them. */
  locale: string;
  /** Rendered immediately after the number — " ans", " j/7", " years". */
  unit?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [armed, setArmed] = useState(false);

  /*
   * Arming happens in an effect so the first client render still matches the
   * server's HTML — setting `shown` to 0 during render would be a hydration
   * mismatch, and React would replace the DOM node rather than adopt it.
   */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          setArmed(true);
        }
      },
      // A little inset, so it starts as the band clears the fold rather
      // than the instant its top edge appears.
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutExpo — fast off the line, long settle onto the final value.
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setShown(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    setShown(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString(locale)}
      {unit}
    </span>
  );
}
