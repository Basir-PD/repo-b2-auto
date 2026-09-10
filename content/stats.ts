import type { Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * The three numbers under the hero, derived from `siteConfig.facts` so they
 * can never drift from the homepage's version of the same claims.
 *
 * The vehicle figure was 2 000 until the owner corrected it to 10 000 on
 * 2026-09-09. It lives in `siteConfig.facts` and is read from there by the
 * homepage stat row, the about page, a photo caption and this band, so the
 * four cannot drift apart — which they had, silently, before this.
 *
 * The review count is NOT a stat here and must never become one. The profile
 * has one review; "350+ reviews" shipped on an earlier build of this site and
 * was removed as unsourceable, and it does not come back by the side door.
 *
 * The price range is deliberately not one of these. It was removed from the
 * hero on request, and reintroducing it as a stat would be the same claim
 * wearing a different hat.
 */
export function businessStats(lang: Lang) {
  const { vehiclesPerYear, yearsInBusiness } = siteConfig.facts;

  /*
    `value` and `unit` are separate because the band counts up when it scrolls
    into view, and a counter needs a number, not "10 ans". The unit is printed
    straight after the formatted figure.

    The third label says what being open seven days actually buys the seller
    — evenings, weekends, holidays — rather than restating the opening hours,
    which are already in the header, the footer and the schema.
  */
  return lang === "fr"
    ? {
        locale: "fr-CA",
        stats: [
          { value: vehiclesPerYear, unit: "", label: "véhicules achetés par année" },
          { value: yearsInBusiness, unit: " ans", label: "d'expérience" },
          { value: 7, unit: " j/7", label: "Horaire flexible, fins de semaine et jours fériés" },
        ],
      }
    : {
        locale: "en-CA",
        stats: [
          { value: vehiclesPerYear, unit: "", label: "vehicles bought per year" },
          { value: yearsInBusiness, unit: " years", label: "of experience" },
          { value: 7, unit: " days", label: "Flexible hours, weekends and holidays" },
        ],
      };
}
