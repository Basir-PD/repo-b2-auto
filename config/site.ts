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
   * The canonical host is www.autosb2.com.
   *
   * ⚠️ THIS MUST MATCH THE VERCEL DOMAIN SETTING. Vercel is configured to
   * redirect the apex to www at the domain level, before the app is ever
   * reached. An earlier version of this file set the apex as canonical and
   * added a www→apex redirect in next.config.ts; the two fought each other
   * and every request became an infinite 308/301 loop. The whole site was
   * unreachable until it was reverted.
   *
   * To move to the apex later, the Vercel setting has to be flipped FIRST
   * (Project → Settings → Domains → make autosb2.com primary, www redirect
   * to it), and only then this value and the redirects in next.config.ts.
   *
   * The mailbox now matches this domain — admin@autosb2.com — but it is
   * still a separate decision from the canonical host. Changing one does not
   * imply changing the other.
   *
   * The default is the domain the site is live on. Override per environment
   * with NEXT_PUBLIC_SITE_URL if that ever changes.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.autosb2.com",

  /**
   * `name` is the trading name — what customers say, what the signage reads,
   * and what belongs in every title, heading and JSON-LD `name`.
   *
   * `legalName` is the registered entity and is deliberately different. It is
   * NOT interchangeable with `name`: putting "Recyclage Autos B2" in a page
   * title or an H1 would be optimising for a string nobody searches.
   */
  name: "Autos B2",
  legalName: "Recyclage Autos B2",
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
    process.env.NEXT_PUBLIC_TRACKING_PHONE_E164 && process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY
      ? {
          e164: process.env.NEXT_PUBLIC_TRACKING_PHONE_E164,
          display: process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY,
          href: `tel:${process.env.NEXT_PUBLIC_TRACKING_PHONE_E164}`,
        }
      : null,

  email: "admin@autosb2.com",

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
   * Read off the Google Business Profile pin itself, not geocoded from the
   * address string — so the JSON-LD `geo` and the GBP agree exactly.
   *
   * Source: https://maps.app.goo.gl/5Z54QqJqVdyTcXzG9 → the place coordinates
   * in the resolved Maps URL (`!3d45.7421284!4d-73.6730281`). The listing is
   * "Recyclage Autos B2", category Auto wrecker, 340 Chem. Pincourt.
   * Plus code P8RG+VQ Mascouche. Google CID 8774241978892122836
   * (ftid 0x4cc8dd4c7d410c7b:0x79c45e97852f7ad4).
   *
   * Do not "tidy" these to fewer decimal places — the precision is what makes
   * the pin land on the yard rather than on the street.
   */
  geo: { latitude: 45.7421284, longitude: -73.6730281 } as null | {
    latitude: number;
    longitude: number;
  },

  /**
   * Open every day, 8:00 AM to 8:00 PM. One entry, seven days — the site and
   * the schema both read this, so the hours can never disagree between the
   * body copy and the structured data.
   */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "06:00",
    closes: "21:00",
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
  /*
    Google reviews. The profile currently has NONE.

    This said 5 reviews at 5.0, which was never true — nothing on the site
    ever showed it, because the heading and the AggregateRating markup are
    both gated on content/reviews.ts actually holding reviews, and it is
    empty. But a wrong number sitting in config is a wrong number waiting to
    be rendered, so it reads zero until there is something to count.

    Update BOTH when reviews arrive: the count here and the texts in
    content/reviews.ts. The section and the schema turn on together.
  */
  reviews: {
    ratingValue: 0,
    reviewCount: 0,
  },

  /**
   * Public "leave a review" link from the Google Business Profile.
   *
   * The short g.page form, taken from the profile's own "Ask for reviews"
   * panel. It opens the star-rating dialog directly — verified: it resolves
   * to search.google.com/local/writereview with the place ID
   * ChIJewxBfUzdyEwR1HovhZdexHk. Google asks for a sign-in first, which is
   * expected; a review cannot be left anonymously.
   *
   * Not a link to the profile page. Those land on a search result, leaving
   * the customer to find the card, scroll to reviews and click through —
   * three steps of friction on the one action that matters most here.
   *
   * components/site/ReviewLink.tsx renders nothing while this is empty.
   */
  GBP_REVIEW_LINK: "https://g.page/r/CdR6L4WXXsR5ECE/review",

  priceRange: "$$",

  /** 10 years in business as of 2026. */
  foundingYear: new Date().getFullYear() - 10,

  /**
   * No social accounts exist. This stays empty and `sameAs` is omitted from
   * the JSON-LD — an empty sameAs array is worse than no sameAs at all.
   */
  social: [] as string[],

  /** Where new-lead notification emails are delivered. */
  leadInbox: process.env.LEAD_INBOX || "admin@autosb2.com",

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

/**
 * Embeddable map of the yard.
 *
 * The zoom is a parameter because the two uses want different things: the
 * contact page wants enough context to plan a drive, the homepage wants to
 * show that 340 Chemin Pincourt is a real place with a real lot behind it.
 */
export function mapsEmbedUrl(zoom = 14) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

/** Route from the yard to a given city — used on every city page. */
export function routeEmbedUrl(city: string) {
  return `https://maps.google.com/maps?saddr=${encodeURIComponent(
    fullAddress
  )}&daddr=${encodeURIComponent(`${city}, QC`)}&t=&z=11&ie=UTF8&iwloc=&output=embed`;
}

/**
 * The opening hours, written out.
 *
 * They were hardcoded in twenty places across five content files — every one
 * a separate chance to say something the schema contradicts. Changing them
 * meant finding all twenty; missing one meant a page disagreeing with the
 * Business Profile, which is exactly the NAP mismatch that costs local
 * ranking.
 *
 * `12` renders 8h/8am rather than 08h/08:00am, which is how these are
 * actually written in both languages.
 */
function hour(value: string, lang: "fr" | "en") {
  const [h, m] = value.split(":").map(Number);
  if (lang === "fr") return m === 0 ? `${h} h` : `${h} h ${m}`;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

/** "8 h à 20 h" / "8am to 8pm" — the range alone. */
export function hoursRange(lang: "fr" | "en") {
  const from = hour(siteConfig.hours.opens, lang);
  const to = hour(siteConfig.hours.closes, lang);
  return lang === "fr" ? `de ${from} à ${to}` : `${from} to ${to}`;
}

/** "Ouvert 7 jours, 8 h à 20 h" — the short badge form. */
export function hoursShort(lang: "fr" | "en") {
  const days = siteConfig.hours.days.length;
  const from = hour(siteConfig.hours.opens, lang);
  const to = hour(siteConfig.hours.closes, lang);
  return lang === "fr"
    ? `Ouvert ${days} jours, ${from} à ${to}`
    : `Open ${days} days, ${from}\u2013${to}`;
}

/** "Ouvert 7 jours sur 7, de 8 h à 20 h" — the full sentence form. */
export function hoursLong(lang: "fr" | "en") {
  const days = siteConfig.hours.days.length;
  return lang === "fr"
    ? `Ouvert ${days} jours sur ${days}, ${hoursRange("fr")}`
    : `Open ${days} days a week, ${hoursRange("en")}`;
}
