import { siteConfig } from "@/config/site";

/**
 * Search-result length limits.
 *
 * Google renders titles and descriptions to a pixel width, not a character
 * count, so these are conventions rather than hard rules — but they are the
 * conventions every audit tool checks, and going over means the tail is
 * replaced with an ellipsis. Whatever sits past the limit is invisible.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** " | Autos B2" — what every title costs before it says anything. */
const SUFFIX = ` | ${siteConfig.name}`;

/**
 * Compose a page title that fits.
 *
 * The brand goes on here and ONLY here. Page titles used to carry it
 * themselves while the Next metadata template appended it again, producing
 * "Questions fréquentes | Autos B2 | Autos B2" — 74 characters, of which the
 * last 11 were a duplicate.
 *
 * `extra` is a qualifier worth having but not worth truncating for: it is
 * dropped whole if the result would overflow, rather than being cut mid-word.
 */
export function pageTitle(main: string, extra?: string): string {
  const withExtra = extra ? `${main} — ${extra}${SUFFIX}` : `${main}${SUFFIX}`;
  if (withExtra.length <= TITLE_MAX) return withExtra;

  const withoutExtra = `${main}${SUFFIX}`;
  if (withoutExtra.length <= TITLE_MAX) return withoutExtra;

  // The name alone is already too long. Keep the brand — it is what makes the
  // result recognisable in a list — and trim the descriptive part.
  return `${main.slice(0, TITLE_MAX - SUFFIX.length - 1).trimEnd()}…${SUFFIX}`;
}

/**
 * Google renders roughly 155 characters of description and truncates the rest.
 * Under about 140 and the snippet looks thin next to competitors that filled
 * the space — on a city page that snippet IS the pitch, so the target is a
 * window rather than a ceiling.
 */
export const DESCRIPTION_MIN = 140;

/**
 * Pick the first candidate that fits the window.
 *
 * Same shape as pageTitle's handling of `extra`: write a full version and a
 * compact fallback, and let length decide. A city name like
 * Saint-Lin-Laurentides is 21 characters before the sentence around it starts,
 * which is the difference between fitting and overflowing — so the choice
 * cannot be made when the copy is written, only when the name is known.
 *
 * Falls back to the LAST candidate (the most compact) rather than the first,
 * so an overflow degrades to the shortest option instead of the longest.
 */
export function fitDescription(...candidates: string[]): string {
  return (
    candidates.find((c) => c.length >= DESCRIPTION_MIN && c.length <= DESCRIPTION_MAX) ??
    candidates[candidates.length - 1]
  );
}
