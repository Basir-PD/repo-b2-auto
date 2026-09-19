import type { Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * A counted figure animates up when the band scrolls into view; a static one
 * is printed as-is.
 *
 * The payout range has to be static. CountUp restarts from zero, so counting
 * a range renders "$300–$0" for the first frames — a price that reads as
 * broken on the one figure the page is trying to be trusted on.
 */
export type Stat =
  | { display: string; value?: never; unit?: never; label: string }
  | { display?: never; value: number; unit: string; label: string };

/**
 * The three numbers under the hero, derived from `siteConfig.facts` so they
 * can never drift from the rest of the site's version of the same claims.
 *
 * The first slot used to be the vehicle count. On 2026-09-19 the owner
 * replaced it with the payout range, so the band now leads with what a
 * seller gets rather than how many cars we take in — which is the thing
 * someone comparing scrap buyers is actually shopping for. The vehicle
 * figure is not gone from the site; it still carries the about page, the
 * meta description and a photo caption from the same single source.
 *
 * That reverses a rule this file used to state, and the reversal is
 * deliberate: an earlier note here said a price range must never become a
 * stat, because "$300 to $3,000" had been stripped from the whole site on
 * 2026-09-10. The owner asked for it back at a higher ceiling. See the
 * comment on `payoutRange` in config/site.ts for why every rendering of it
 * has to stay a range.
 *
 * The second slot used to be years in business. That went on the same day
 * and for a harder reason: it could not be tied to this business rather than
 * the yard it shares an address with. "0 $" replaces it because it is the
 * one number here nobody has to take on trust — towing, the SAAQ paperwork
 * and the quote are free, which the rest of the site already promises in
 * words. Read across, the band is now what you get, what you pay, and when.
 *
 * The review count is NOT a stat here and must never become one. The profile
 * has one review; "350+ reviews" shipped on an earlier build of this site and
 * was removed as unsourceable, and it does not come back by the side door.
 */
export function businessStats(lang: Lang): { locale: string; stats: Stat[] } {
  const { payoutRange } = siteConfig.facts;
  const { min, max } = payoutRange;

  /*
    `value` and `unit` are separate on the counted stat because the band
    counts up when it scrolls into view, and a counter needs a number, not
    "7 j/7".

    The third label says what being open seven days actually buys the seller
    — evenings, weekends, holidays — rather than restating the opening hours,
    which are already in the header, the footer and the schema.
  */
  return lang === "fr"
    ? {
        locale: "fr-CA",
        stats: [
          {
            // fr-CA puts the sign after the figure, with a space: "7 500 $".
            display: `${min}–${max.toLocaleString("fr-CA")} $`,
            // The qualifier is part of the claim, not decoration around it.
            label: "payé comptant, selon le véhicule",
          },
          {
            display: "0 $",
            label: "remorquage, paperasse et estimation",
          },
          { value: 7, unit: " j/7", label: "Horaire flexible, fins de semaine et jours fériés" },
        ],
      }
    : {
        locale: "en-CA",
        stats: [
          {
            display: `$${min}–$${max.toLocaleString("en-CA")}`,
            label: "paid in cash, depending on the vehicle",
          },
          {
            display: "$0",
            label: "towing, paperwork and the quote",
          },
          { value: 7, unit: " days", label: "Flexible hours, weekends and holidays" },
        ],
      };
}
