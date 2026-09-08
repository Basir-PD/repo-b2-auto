import type { Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { REVIEWS, hasReviews } from "@/content/reviews";
import type { FaqItem } from "@/content/faq";
import { CITIES } from "@/content/cities";
import { getCopy } from "@/content/copy";

function abs(path: string) {
  return `${siteConfig.url}${path}`;
}

/** One <script> per graph. Rendered inline so it is in the served HTML. */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Server-rendered from our own data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * The business itself. `@id` is `#business`; every other node references it
 * rather than restating the NAP.
 *
 * `geo` now carries the real coordinates off the Business Profile pin (see
 * config/site.ts) — it stays behind a null check so the block disappears
 * rather than emitting a half-filled GeoCoordinates if it is ever cleared.
 *
 * Two things are still conditionally omitted rather than faked:
 *   - `sameAs`, because there are no social profiles
 *   - `aggregateRating`, until the real reviews are visible on the page.
 *     Rating markup with nothing behind it is a manual-action risk, so the
 *     markup follows the data and not the other way round.
 */
export function localBusinessSchema(lang: Lang) {
  const t = getCopy(lang);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    /*
      AutoWrecker is the narrow type and the one that matches the Google
      Business Profile category ("Auto wrecker"). LocalBusiness and
      Organization are both ancestors of it, so they are strictly redundant —
      they are declared anyway because plenty of consumers, including the
      answer engines this site wants to be cited by, look for the generic type
      and do not walk the schema.org hierarchy to find it.
    */
    "@type": ["AutoWrecker", "LocalBusiness", "Organization"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    /*
      Two names are in use: the Business Profile lists "Recyclage Autos B2",
      while the trading name customers say — and every page title and heading
      on this site — is "Autos B2".

      legalName and alternateName both carry the longer form so Google can see
      one entity rather than two businesses at one address. It is also the
      corroboration Google's name guideline asks for: the name must be the one
      used consistently on the storefront, the website and the stationery, and
      the footer now states it in readable text rather than only inside a logo
      image.

      Deliberately NOT in `name`: the titles are capped at 60 characters, and
      the longer brand costs 10 of them. Measured, it would strip the
      qualifier off 12 of 28 titles — every French city page would lose
      "rachat comptant". Identity goes here; the titles keep selling.
    */
    legalName: siteConfig.legalName,
    alternateName: siteConfig.legalName,
    description: t.home.metaDescription,
    url: abs(`/${lang}/`),
    telephone: siteConfig.phone.e164,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    foundingDate: String(siteConfig.foundingYear),
    currenciesAccepted: "CAD",
    paymentAccepted: lang === "fr" ? "Argent comptant" : "Cash",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: siteConfig.hours.days,
        opens: siteConfig.hours.opens,
        closes: siteConfig.hours.closes,
      },
    ],
    areaServed: [
      ...t.home.serviceArea.cities.map((city) => ({
        "@type": "City",
        name: city,
        addressRegion: "QC",
        addressCountry: "CA",
      })),
    ],
    image: abs("/hero-tow-truck.jpg"),
  };

  if (siteConfig.geo) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    };
  }

  // Rating markup only when the reviews it summarises are actually visible.
  if (hasReviews) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(siteConfig.reviews.ratingValue),
      reviewCount: String(siteConfig.reviews.reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
    data.review = REVIEWS.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(review.rating),
        bestRating: "5",
      },
      reviewBody: review.body[lang],
    }));
  }

  return data;
}

/**
 * The site itself, as a distinct entity from the business that runs it.
 *
 * `@id` matters more than the content here: WebPage.isPartOf and every future
 * node can point at `#website` instead of restating name and url inline, which
 * is what stops a crawler seeing several slightly different websites.
 *
 * No `potentialAction`/SearchAction: there is no site search. Declaring one
 * that resolves to nothing is a Rich Results error, not a bonus.
 */
export function websiteSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: abs(`/${lang}/`),
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
    publisher: { "@id": `${siteConfig.url}/#business` },
  };
}

export function serviceSchema({
  lang,
  name,
  description,
  path,
}: {
  lang: Lang;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: abs(path),
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: CITIES.map((city) => ({
      "@type": "City",
      name: city.name,
      addressRegion: "QC",
      addressCountry: "CA",
    })),
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: {
        "@type": "ContactPoint",
        telephone: siteConfig.phone.e164,
        contactType: lang === "fr" ? "service à la clientèle" : "customer service",
        availableLanguage: ["fr-CA", "en-CA"],
      },
      serviceUrl: abs(path),
    },
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export function webPageSchema({
  lang,
  name,
  description,
  path,
}: {
  lang: Lang;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: abs(path),
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#business` },
  };
}
