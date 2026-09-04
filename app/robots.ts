import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/admin",
    // Ad landing pages are noindex; blocking them here as well keeps them out
    // of discovery entirely.
    "/fr/lp/",
    "/en/lp/",
    // Thank-you pages should only ever be reached after a submit.
    "/fr/merci/",
    "/en/thank-you/",
  ];

  return {
    rules: [
      /*
        AdsBot FIRST, and explicitly allowed everywhere.

        The /lp/ pages are disallowed below so they never compete with the
        organic pages they mirror — but those are exactly the URLs the ads
        point at, and Google Ads needs to crawl a landing page to check it
        against policy and to score it. AdsBot documents that it ignores the
        wildcard `*` group, so this would probably have worked anyway; a
        blocked ad destination is too expensive to leave resting on
        "probably".
      */
      { userAgent: "AdsBot-Google", allow: "/" },
      { userAgent: "AdsBot-Google-Mobile", allow: "/" },
      { userAgent: "AdsBot-Google-Mobile-Apps", allow: "/" },
      // Meta's crawler, for the Facebook/Instagram ad destinations.
      { userAgent: "facebookexternalhit", allow: "/" },

      { userAgent: "*", allow: "/", disallow },
      // The AI answer engines worth being cited by for "cour à scrap" queries.
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
