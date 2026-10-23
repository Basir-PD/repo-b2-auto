"use client";

import { useEffect, useState } from "react";

/** Per character. Quick enough to finish before the eye moves on to the call button. */
const STEP_MS = 45;
/** A beat after first paint, so the typing is seen rather than missed. */
const START_MS = 350;
/** How long the cursor keeps blinking once the line is written, before it goes. */
const CURSOR_MS = 1600;

/**
 * Types its text out once, letter by letter, with a blinking cursor.
 *
 * Once, not on a loop: it is there to draw the eye to the promise on arrival,
 * and something that keeps moving next to the call button competes with it.
 *
 * - The full text is in the HTML for screen readers and crawlers (sr-only);
 *   the typing itself is aria-hidden, so it is never read out letter by letter.
 * - An invisible copy holds the line's width and height from the first paint,
 *   so the typing cannot move the layout.
 * - With "reduce motion" on, the text is simply there.
 */
export default function TypedText({ text }: { text: string }) {
  const [shown, setShown] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      setCursor(false);
      return;
    }
    let count = 0;
    let typing: ReturnType<typeof setInterval> | undefined;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const start = setTimeout(() => {
      typing = setInterval(() => {
        count += 1;
        setShown(count);
        if (count >= text.length) {
          clearInterval(typing);
          hide = setTimeout(() => setCursor(false), CURSOR_MS);
        }
      }, STEP_MS);
    }, START_MS);
    return () => {
      clearTimeout(start);
      clearInterval(typing);
      clearTimeout(hide);
    };
  }, [text]);

  return (
    <span className="relative inline-grid">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
        {text.slice(0, shown)}
        {cursor && (
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-[caret-blink_1s_steps(1)_infinite] bg-current" />
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
