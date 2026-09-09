import type { Lang } from "@/config/routes";

/**
 * Every municipality and borough the tow truck actually goes to.
 *
 * This is a wider list than `content/cities.ts`, and the difference is
 * deliberate. `cities.ts` holds the places that have their own page — a page
 * costs 400+ words of genuinely local prose, so it is only worth building
 * where there is search volume to win. This file is the coverage claim: it
 * feeds the homepage service-area block, the LocalBusiness and Service
 * `areaServed` schema, and it is what a crawler or an LLM reads to answer
 * "do they come to Beaconsfield?".
 *
 * A name here with no page still earns its place. `areaServed` is a
 * machine-readable statement of territory, and Google reads it when deciding
 * which local queries the business is eligible for. Understating the territory
 * is the same mistake as understating the hours.
 *
 * Grouped by region because the region names are themselves search terms —
 * "cour à scrap Rive-Nord", "West Island scrap car" — and because a flat blob
 * of 33 chips is unreadable. The order inside each group runs roughly outward
 * from the yard at 340 Chemin Pincourt.
 *
 * Display names are identical in both languages: these are Quebec place names
 * and they are not translated. Only the region labels differ.
 */
export type ServedRegion = {
  key: string;
  label: { fr: string; en: string };
  cities: string[];
};

export const SERVICE_AREA: ServedRegion[] = [
  {
    key: "lanaudiere",
    label: { fr: "Rive-Nord et Lanaudière", en: "North Shore & Lanaudière" },
    cities: [
      "Mascouche",
      "Terrebonne",
      "Lachenaie",
      "La Plaine",
      "Repentigny",
      "Le Gardeur",
      "Charlemagne",
      "L'Assomption",
      "Saint-Lin-Laurentides",
    ],
  },
  {
    key: "laurentides",
    label: { fr: "Basses-Laurentides", en: "Lower Laurentians" },
    cities: [
      "Bois-des-Filion",
      "Rosemère",
      "Sainte-Thérèse",
      "Blainville",
      "Boisbriand",
      "Sainte-Sophie",
      "Saint-Jérôme",
      "Mirabel",
      "Saint-Eustache",
      "Pointe-Calumet",
    ],
  },
  {
    key: "laval",
    label: { fr: "Laval", en: "Laval" },
    cities: ["Laval"],
  },
  {
    key: "montreal-est",
    label: { fr: "Est de Montréal", en: "East End of Montreal" },
    cities: [
      "Montréal-Nord",
      "Anjou",
      "Rivière-des-Prairies",
      "Pointe-aux-Trembles",
      "Montréal-Est",
    ],
  },
  {
    key: "montreal-ouest",
    label: { fr: "Ouest de Montréal et West Island", en: "West Island & west end" },
    cities: [
      "Westmount",
      "Côte-Saint-Luc",
      "Dorval",
      "Dollard-des-Ormeaux",
      "Kirkland",
      "Beaconsfield",
    ],
  },
  {
    key: "rive-sud",
    label: { fr: "Rive-Sud", en: "South Shore" },
    cities: ["Varennes", "Boucherville"],
  },
];

/** Every served place, flattened — what `areaServed` is built from. */
export const SERVED_CITIES: string[] = SERVICE_AREA.flatMap((region) => region.cities);

export function regionLabel(region: ServedRegion, lang: Lang): string {
  return region.label[lang];
}
