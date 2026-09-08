import { Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getCopy } from "@/content/copy";
import type { Lang } from "@/config/routes";

/**
 * "Leave us a review" — the public Google Business Profile review link.
 *
 * Renders NOTHING while `siteConfig.GBP_REVIEW_LINK` is an empty string. A
 * button that opens a broken or guessed review URL is worse than no button:
 * it spends the one moment a happy customer was willing to act.
 *
 * Deliberately NOT placed on the thank-you page. That page is reached after a
 * quote REQUEST, not after a completed sale — nobody has been paid yet, and
 * asking someone to review a business they have not transacted with produces
 * either nothing or a review Google filters.
 *
 * The real harvesting happens off-site, at the moment the driver hands over
 * the cash. See OFF_SITE_TODO.md §2. This component is for the past customer
 * who comes back to the site to find the link.
 */
export default function ReviewLink({
  lang,
  className,
}: {
  lang: Lang;
  className?: string;
}) {
  if (!siteConfig.GBP_REVIEW_LINK) return null;

  const t = getCopy(lang);

  return (
    <a
      href={siteConfig.GBP_REVIEW_LINK}
      // Opens in a new tab so the visitor does not lose the page they were on.
      target="_blank"
      rel="noreferrer noopener"
      className={className}
    >
      <Star className="h-4 w-4 shrink-0" aria-hidden="true" />
      {t.common.reviewCta}
    </a>
  );
}
