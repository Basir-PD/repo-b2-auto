/**
 * ============================================================
 * SITE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ============================================================
 * Every business fact on this site comes from this file: NAP,
 * hours, price range, review counts, service areas. Nothing is
 * hardcoded in a component.
 *
 * Google cross-checks NAP against the Google Business Profile,
 * so the address, phone and name below must match the GBP
 * listing CHARACTER FOR CHARACTER.
 *
 * See README.md for what to change when a real value arrives.
 * ============================================================
 */

export const siteConfig = {
  /**
   * Canonical origin. No trailing slash.
   *
   * This is the single most consequential value in the file: it is stamped
   * into every canonical tag, hreflang, og:url, JSON-LD url and sitemap
   * entry. If it does not match the domain the site is actually served
   * from, Google is told the real version lives somewhere else — and if
   * that somewhere else 404s, nothing gets indexed at all.
   *
   * The default is the domain the site is live on. Override per environment
   * with NEXT_PUBLIC_SITE_URL if that ever changes.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.autosb2.com",

  name: "Autos B2",
  legalName: "Autos B2",
  shortName: "Autos B2",

  phone: {
    /** E.164 — required by schema.org and tel: links. */
    e164: "+15146232787",
    display: "+1 (514) 623-2787",
    href: "tel:+15146232787",
  },

  /**
   * Call-tracking (DNI) number, driven by env so switching it on is a deploy
   * variable rather than a code change:
   *
   *   NEXT_PUBLIC_TRACKING_PHONE_E164     +15145550123
   *   NEXT_PUBLIC_TRACKING_PHONE_DISPLAY  +1 (514) 555-0123
   *
   * `usePhone()` swaps this in for visitors arriving with a gclid, wbraid,
   * gbraid or fbclid, and falls back to the real number for everyone else.
   * Both vars must be set or the fallback stays in force — a half-configured
   * pool would show a number that does not match what is dialled.
   *
   * Set NEXT_PUBLIC_TRACKING_PHONE_DISPLAY to the pool number exactly as it
   * should read on screen; it is what a visitor sees and what they may write
   * down, so it cannot be a reformatted guess.
   */
  trackingPhone:
    process.env.NEXT_PUBLIC_TRACKING_PHONE_E164 &&
    process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY
      ? {
          e164: process.env.NEXT_PUBLIC_TRACKING_PHONE_E164,
          display: process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY,
          href: `tel:${process.env.NEXT_PUBLIC_TRACKING_PHONE_E164}`,
        }
      : null,

  email: "admin@b2autos.com",

  /** wa.me deep link — opens a WhatsApp chat with this number. */
  whatsapp: {
    number: "15146232787",
    href: "https://wa.me/15146232787",
  },

  address: {
    street: "340 Chemin Pincourt",
    locality: "Mascouche",
    region: "QC",
    regionName: "Quebec",
    postalCode: "J7L 2W3",
    country: "CA",
    countryName: "Canada",
  },

  /**
   * Yard coordinates.
   *
   * NOT VERIFIED — left null on purpose. The JSON-LD omits the `geo` block
   * entirely while this is null rather than shipping a guessed pin, which is
   * worse than no pin at all for local ranking. To fill it: open the Google
   * Business Profile listing in Maps, right-click the pin, copy the lat/lng.
   */
  geo: null as null | { latitude: number; longitude: number },

  /**
   * Open every day, 8:00 AM to 8:30 PM. One entry, seven days — the site and
   * the schema both read this, so the hours can never disagree between the
   * body copy and the structured data.
   */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "20:30",
  },

  /** Verified business figures. Do not add to these without a source. */
  facts: {
    yearsInBusiness: 10,
    vehiclesPerYear: 2000,
    cashMin: 300,
    cashMax: 3000,
  },

  /**
   * Google reviews. reviewCount is 5 — a real, small number.
   *
   * NEVER round this up, and never write "hundreds of customers" or any
   * volume language anywhere on the site. AggregateRating JSON-LD is emitted
   * only when `reviews` in content/reviews.ts actually holds these 5 reviews;
   * an empty array means no rating markup and no reviews section.
   */
  reviews: {
    ratingValue: 5,
    reviewCount: 5,
  },

  /**
   * Public "leave us a review" link from the Google Business Profile.
   * NOT AVAILABLE YET — every review-request button stays hidden while this
   * is an empty string.
   */
  GBP_REVIEW_LINK: "",

  priceRange: "$$",

  /** 10 years in business as of 2026. */
  foundingYear: new Date().getFullYear() - 10,

  /**
   * No social accounts exist. This stays empty and `sameAs` is omitted from
   * the JSON-LD — an empty sameAs array is worse than no sameAs at all.
   */
  social: [] as string[],

  /** Where new-lead notification emails are delivered. */
  leadInbox: process.env.LEAD_INBOX || "admin@b2autos.com",

  /**
   * Optional POST target for every lead, fired alongside the email so someone
   * can call back inside five minutes. Point it at a Zapier/Make hook that
   * fans out to Twilio SMS or WhatsApp. Unset is fine — the email still sends.
   */
  leadWebhook: process.env.LEAD_WEBHOOK_URL || "",
} as const;

export type SiteConfig = typeof siteConfig;

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name}, ${fullAddress}`
)}`;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  fullAddress
)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

/** Route from the yard to a given city — used on every city page. */
export function routeEmbedUrl(city: string) {
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(
    fullAddress
  )}&daddr=${encodeURIComponent(`${city}, QC`)}&t=&z=11&ie=UTF8&iwloc=&output=embed`;
}
