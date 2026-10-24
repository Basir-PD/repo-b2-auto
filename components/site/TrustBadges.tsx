import { ShieldCheck } from "lucide-react";
import GoogleRatingBadge from "@/components/site/GoogleRatingBadge";
import type { Lang } from "@/config/routes";
import { getCopy } from "@/content/copy";

/**
 * The SAAQ badge: authority, beside the Google rating's social proof.
 *
 * Gold, so it reads as a seal rather than another button. Not a link: on a
 * landing page every exit costs a paid click, and a badge only has to be
 * believed. No SAAQ logo either; that is a government mark. On a phone it
 * says "Reconnu SAAQ" so it fits beside the Google badge on one line; the
 * full "Recycleur reconnu SAAQ" from `sm` up.
 */
function SaaqBadge({ lang }: { lang: Lang }) {
  const { short, full } = getCopy(lang).common.saaqBadge;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-b from-amber-50 to-amber-100 px-2.5 py-2 text-[12px] font-bold text-amber-900 shadow-sm ring-1 ring-amber-300 sm:gap-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]">
      <span
        aria-hidden="true"
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 sm:h-[18px] sm:w-[18px]"
      >
        <ShieldCheck className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={2.75} />
      </span>
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
