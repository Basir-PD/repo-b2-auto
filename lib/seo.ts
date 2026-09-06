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
