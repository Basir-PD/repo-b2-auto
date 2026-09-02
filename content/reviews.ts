/**
 * Real Google reviews. EMPTY ON PURPOSE.
 *
 * There are 5 real reviews on the Google Business Profile, averaging 5.0.
 * Until their text is pasted in below, two things stay switched off:
 *
 *   1. The reviews section does not render at all.
 *   2. The AggregateRating JSON-LD is omitted from the homepage.
 *
 * Shipping a rating in structured data that a visitor cannot see on the page
 * is exactly what Google's reviews-snippet guidelines prohibit, and it is a
 * manual-action risk. So the markup follows the data, not the other way round.
 *
 * To turn both on: paste the 5 reviews here, verbatim, with the reviewer's
 * name as it appears publicly on Google. Never invent one, never edit the
 * wording, never add a sixth.
 */
export type Review = {
  author: string;
  /** 1–5, as left by the reviewer. */
  rating: number;
  /** ISO date, e.g. "2025-11-04". */
  date: string;
  body: { fr: string; en: string };
};

export const REVIEWS: Review[] = [];

export const hasReviews = REVIEWS.length > 0;
