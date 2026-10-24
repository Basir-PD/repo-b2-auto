import { Star } from "lucide-react";
import type { Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";

/*
  Google rating badge for the homepage and landing-page heroes. Hardcoded from
  config/site.ts. No review cards (owner's call), no Google widget,
  no third-party script, no JSON-LD, so the page stays fast and schema-free.
*/

/** Google's four-colour "G", inline so it costs zero requests. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function FiveStars({ size }: { size: string }) {
  // purely decorative bro, the text next to it carries the rating for screen readers
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} fill-current`} strokeWidth={0} />
      ))}
    </span>
  );
}

/**
 * "G ★★★★★ 5,0 sur Google", linking to the reviews in a new tab. A little
 * smaller on phones, so it fits beside the SAAQ badge (see TrustBadges).
 *
 * No review count on purpose, owner's call. Don't add it back without asking.
 */
export default function GoogleRatingBadge({
  lang,
  className = "",
}: { lang: Lang; className?: string }) {
  const { ratingValue } = siteConfig.reviews;
  // no rating, no badge. a "0,0" badge would be a self-own
  if (!ratingValue) return null;

  const rating = new Intl.NumberFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(ratingValue);

  return (
    <a
      href={siteConfig.GBP_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:ring-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-[15px] ${className}`}
    >
      <GoogleG className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" />
      <FiveStars size="h-3 w-3 sm:h-4 sm:w-4" />
      <span>
        <span className="font-black tabular-nums text-slate-900">{rating}</span>{" "}
        {lang === "fr" ? "sur Google" : "on Google"}
        <span className="sr-only">
          {lang === "fr"
            ? " (sur 5, s'ouvre dans un nouvel onglet)"
            : " (out of 5, opens in a new tab)"}
        </span>
      </span>
    </a>
  );
}
