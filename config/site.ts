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
  /** Canonical origin. No trailing slash. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://b2autos.com",

  name: "B2 Autos",
  legalName: "B2 Autos",
  shortName: "B2 Autos",

  phone: {
    /** E.164 — required by schema.org and tel: links. */
    e164: "+15146232787",
    display: "+1 (514) 623-2787",
    href: "tel:+15146232787",
  },

  /**
   * Call-tracking (DNI) number. NOT SET UP YET.
   *
   * When a call-tracking provider is signed up, put the pool number here in
   * the same shape as `phone` above. `usePhoneNumber()` swaps it in for
   * visitors carrying a gclid/fbclid and falls back to `phone` while this is
   * null — so leaving it null is a supported state, not a broken one.
   */
  trackingPhone: null as null | { e164: string; display: string; href: string },

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
