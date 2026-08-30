import { siteConfig } from "@/lib/site";
import { translations } from "@/lib/translations";

/**
 * ============================================================
 * STRUCTURED DATA (JSON-LD)
 * ============================================================
 * Server-rendered so crawlers - and AI answer engines like
 * ChatGPT, Perplexity and Google AI Overviews - get the facts
 * without executing JavaScript.
 *
 * Graph nodes:
 *   #organization  AutoWrecker (LocalBusiness) - the NAP record
 *   #website       WebSite - site-level identity
 *   #webpage       WebPage - this page, with speakable markup
 *   #faq           FAQPage - eligible for FAQ rich results
 *   + OfferCatalog of services
 * ============================================================
 */

const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;
const PAGE_ID = `${siteConfig.url}/#webpage`;

function openingHoursSpecification() {
  return siteConfig.openingHours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
    opens: slot.opens,
    closes: slot.closes,
  }));
}

export default function JsonLd({ locale = "fr" }: { locale?: "en" | "fr" }) {
  const t = translations[locale];
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  const organization = {
    "@type": ["AutoWrecker", "AutomotiveBusiness", "LocalBusiness"],
    "@id": ORG_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone.e164,
    email: siteConfig.email,
    description: t.hero.description,
    image: `${siteConfig.url}${siteConfig.heroBackground}`,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}${siteConfig.heroBackground}`,
      caption: siteConfig.legalName,
    },
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash",
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${siteConfig.geo.latitude},${siteConfig.geo.longitude}`,
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: { "@type": "AdministrativeArea", name: "Quebec, Canada" },
    })),
    openingHoursSpecification: openingHoursSpecification(),
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone.e164,
        contactType: "sales",
        areaServed: "CA",
        availableLanguage: ["French", "English"],
      },
    ],
    knowsLanguage: ["fr-CA", "en-CA"],
    makesOffer: t.services.items.map((item) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: { "@id": ORG_ID },
        areaServed: siteConfig.serviceAreas.join(", "),
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: t.services.items.map((item, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: item.title, description: item.description },
      })),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.tagline[locale],
    publisher: { "@id": ORG_ID },
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
  };

  const webpage = {
    "@type": "WebPage",
    "@id": PAGE_ID,
    url: siteConfig.url,
    name: `${siteConfig.name} - ${siteConfig.tagline[locale]}`,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@id": `${siteConfig.url}/#logo` },
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-summary"],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.url },
      ],
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const howTo = {
    "@type": "HowTo",
    "@id": `${siteConfig.url}/#howto`,
    name: t.howItWorks.title,
    description: t.howItWorks.subtitle,
    totalTime: "PT24H",
    step: t.howItWorks.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
      url: `${siteConfig.url}/#how-it-works`,
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, webpage, faq, howTo],
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is generated from trusted local config, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
