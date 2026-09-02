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
