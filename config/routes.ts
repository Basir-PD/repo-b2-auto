import { CITIES } from "@/content/cities";

export type Lang = "fr" | "en";

export const LANGS = ["fr", "en"] as const;

/**
 * French is primary. The market — Mascouche, Terrebonne, Repentigny,
 * L'Assomption, Laval, the whole Rive-Nord — is overwhelmingly francophone.
 * English exists for the Montreal anglophone segment, and `/` negotiates.
 */
export const DEFAULT_LANG: Lang = "fr";

export const HTML_LANG: Record<Lang, string> = { fr: "fr-CA", en: "en-CA" };
export const OG_LOCALE: Record<Lang, string> = { fr: "fr_CA", en: "en_CA" };

export function isLang(value: unknown): value is Lang {
  return value === "fr" || value === "en";
}

/**
 * Every static page, keyed by a stable identifier that has nothing to do with
 * its URL. The slugs differ per language on purpose — `/en/rachat-auto-scrap/`
 * would rank for nothing — so the key is what the language switcher and the
 * hreflang tags pair on.
 *
 * A slug of "" is that language's index.
 */
export const ROUTES = {
  home: { fr: "", en: "" },

  // Services
  scrapBuying: { fr: "rachat-auto-scrap", en: "cash-for-junk-cars" },
  towing: { fr: "remorquage-gratuit", en: "free-towing" },
  damaged: { fr: "achat-auto-accidentee", en: "damaged-car-buyer" },
  trucks: { fr: "achat-camion-vus", en: "truck-suv-buyer" },

  // Conversion
  quote: { fr: "estimation", en: "quote" },
  thanks: { fr: "merci", en: "thank-you" },

  // Company
  about: { fr: "a-propos", en: "about" },
  faq: { fr: "faq", en: "faq" },
  blog: { fr: "blogue", en: "blog" },
  contact: { fr: "contact", en: "contact" },

  // Legal
  privacy: { fr: "politique-de-confidentialite", en: "privacy-policy" },
  terms: { fr: "conditions-utilisation", en: "terms" },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof ROUTES;

/**
 * Paid-traffic landing pages. Separate from ROUTES because they behave
 * differently everywhere it matters: noindex, no nav, no footer links, and
 * one goal per page. They live under /lp/ so robots.txt can block the lot
 * with a single rule.
 */
export const LANDING_PAGES = {
  sellMyCar: { lang: "fr", slug: "vendre-mon-auto" },
  towingLp: { lang: "fr", slug: "remorquage-gratuit" },
  facebookOffer: { lang: "fr", slug: "offre-facebook" },
  cashForJunkCars: { lang: "en", slug: "cash-for-junk-cars" },
} as const satisfies Record<string, { lang: Lang; slug: string }>;

export type LandingKey = keyof typeof LANDING_PAGES;

/**
 * Build a path. Trailing slashes throughout, matching `trailingSlash: true`
 * in next.config — one canonical shape means no redirect hop from an ad click.
 */
export function pathFor(key: PageKey, lang: Lang): string {
  const slug = ROUTES[key][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

export function cityPathFor(citySlug: string, lang: Lang): string {
  return `/${lang}/${citySlug}/`;
}

export function landingPathFor(key: LandingKey): string {
  const lp = LANDING_PAGES[key];
  return `/${lp.lang}/lp/${lp.slug}/`;
}

export function blogPostPath(postSlug: string, lang: Lang): string {
  return `/${lang}/${ROUTES.blog[lang]}/${postSlug}/`;
}

/** The other language. */
export function otherLang(lang: Lang): Lang {
  return lang === "fr" ? "en" : "fr";
}

/* ------------------------------------------------------------------ *
 * Slug resolution
 *
 * One catch-all route renders every top-level page, so it needs to turn an
 * arbitrary `[slug]` back into "which page is this, and what is its twin in
 * the other language" — the second half being what hreflang and the language
 * switcher both depend on.
 * ------------------------------------------------------------------ */

export type Resolved =
  | { type: "page"; key: PageKey }
  | { type: "city"; cityKey: string };

const PAGE_BY_SLUG: Record<Lang, Map<string, PageKey>> = {
  fr: new Map(),
  en: new Map(),
};
const CITY_BY_SLUG: Record<Lang, Map<string, string>> = {
  fr: new Map(),
  en: new Map(),
};

for (const lang of LANGS) {
  for (const key of Object.keys(ROUTES) as PageKey[]) {
    const slug = ROUTES[key][lang];
    if (slug) PAGE_BY_SLUG[lang].set(slug, key);
  }
  for (const city of CITIES) {
    const slug = city.slug[lang];
    if (slug) CITY_BY_SLUG[lang].set(slug, city.key);
  }
}

export function resolveSlug(lang: Lang, slug: string): Resolved | null {
  const key = PAGE_BY_SLUG[lang].get(slug);
  if (key) return { type: "page", key };

  const cityKey = CITY_BY_SLUG[lang].get(slug);
  if (cityKey) return { type: "city", cityKey };

  return null;
}

/**
 * Absolute URLs for the hreflang block, keyed by language.
 *
 * Only languages that actually have this page are listed. Three of the nine
 * city pages have an English twin; pointing the rest at the English homepage
 * would be a false alternate, and Google drops the whole cluster when the
 * return tags don't match.
 */
export function alternatesFor(resolved: Resolved | { type: "home" }): Partial<Record<Lang, string>> {
  const out: Partial<Record<Lang, string>> = {};

  for (const lang of LANGS) {
    if (resolved.type === "home") {
      out[lang] = `/${lang}/`;
      continue;
    }
    if (resolved.type === "page") {
      out[lang] = pathFor(resolved.key, lang);
      continue;
    }
    const city = CITIES.find((c) => c.key === resolved.cityKey);
    const slug = city?.slug[lang];
    if (slug) out[lang] = cityPathFor(slug, lang);
  }

  return out;
}
