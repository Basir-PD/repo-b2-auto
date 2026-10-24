import { ShieldCheck } from "lucide-react";
import GoogleRatingBadge from "@/components/site/GoogleRatingBadge";
import type { Lang } from "@/config/routes";
import { getCopy } from "@/content/copy";

/**
 * The SAAQ badge: authority, beside the Google rating's social proof.
 *
 * Styled exactly like the Google badge beside it (white pill, slate ring and
 * text, same sizes), so the two read as a pair; the green shield is its only
 * colour, as the "G" and stars are the Google one's. Not a link: on a
 * landing page every exit costs a paid click, and a badge only has to be
 * believed. No SAAQ logo either; that is a government mark. On a phone it
 * says "Reconnu SAAQ" so it fits beside the Google badge on one line; the
 * full "Recycleur reconnu SAAQ" from `sm` up.
 */
function SaaqBadge({ lang }: { lang: Lang }) {
  const { short, full } = getCopy(lang).common.saaqBadge;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]">
      <ShieldCheck
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-brand-600 sm:h-[18px] sm:w-[18px]"
        strokeWidth={2.5}
      />
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{full}</span>
    </span>
  );
}

/** The Google rating and the SAAQ badge, side by side, wherever the rating appears. */
export default function TrustBadges({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}>
      <GoogleRatingBadge lang={lang} />
      <SaaqBadge lang={lang} />
    </div>
  );
}
