/**
 * ============================================================
 * SITE CONFIGURATION - Single Source of Truth
 * ============================================================
 * Every NAP (Name / Address / Phone) value used in metadata,
 * JSON-LD structured data, the sitemap and the UI comes from
 * here. Google cross-checks these against your Google Business
 * Profile, so they must match it CHARACTER FOR CHARACTER.
 * ============================================================
 */

export const siteConfig = {
  /** Canonical origin. No trailing slash. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://b2autos.com",

  name: "B2 Autos",
  legalName: "B2 Autos Recycling",
  shortName: "B2 Autos",

  /** Used as the <title> suffix and OG site name. */
  tagline: {
    en: "Cash for Cars & Auto Recycling in Mascouche, QC",
    fr: "Achat d'autos comptant et recyclage automobile à Mascouche, QC",
  },

  phone: {
    /** E.164 - required by schema.org and tel: links. */
    e164: "+15146232787",
    display: "+1 (514) 623-2787",
    href: "tel:+15146232787",
  },

  email: "info@b2autos.com",

  /** wa.me deep link - opens the WhatsApp chat with this number. */
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
   * TODO(verify): approximate coordinates for Mascouche, QC.
   * Replace with the exact lat/lng from your Google Business
   * Profile listing (right-click the pin in Google Maps).
   */
  geo: {
    latitude: 45.7472,
    longitude: -73.6003,
  },

  /** Towns we actively tow from - drives local SEO + Ads geo-targeting. */
  serviceAreas: [
    "Mascouche",
    "Terrebonne",
    "Laval",
    "Repentigny",
    "Blainville",
    "Bois-des-Filion",
    "Lachenaie",
    "Saint-Eustache",
    "Rosemère",
    "Montréal",
  ],

  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "20:00" },
    { days: ["Saturday"], opens: "09:00", closes: "17:00" },
  ],

  /**
   * Full-bleed hero background — also the Open Graph and schema.org image.
   * Swap the file here and the hero, share cards and JSON-LD all follow.
   */
  heroBackground: "/hero-tow-truck.jpg",

  priceRange: "$$",
  foundingYear: 2000,

  social: {
    facebook: "",
    instagram: "",
    x: "",
  },

  /** Where new-lead notification emails are delivered. */
  leadInbox: process.env.QUOTE_INBOX || "admin@b2autos.com",
} as const;

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.locality}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.legalName}, ${fullAddress}`
)}`;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  fullAddress
)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
