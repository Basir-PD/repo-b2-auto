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
 * The business itself.
 *
 * AutoWrecker is the specific schema.org type for a scrap yard and is a
 * subtype of LocalBusiness, so declaring both is redundant — the array form
 * below keeps the generic type explicit for consumers that don't know the
 * narrow one.
 *
 * Three things are conditionally omitted rather than faked:
 *   - `geo`, until real coordinates are pulled off the GBP listing
 *   - `sameAs`, because there are no social profiles
 *   - `aggregateRating`, until the 5 real reviews are on the page
 */
export function localBusinessSchema(lang: Lang) {
  const t = getCopy(lang);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["AutoWrecker", "LocalBusiness"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
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
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    about: { "@id": `${siteConfig.url}/#business` },
  };
}
