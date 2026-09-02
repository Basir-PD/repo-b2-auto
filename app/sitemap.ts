import type { MetadataRoute } from "next";
import { LANGS, ROUTES, pathFor, cityPathFor, type PageKey } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { CITIES } from "@/content/cities";
import { POSTS } from "@/content/blog";

const abs = (path: string) => `${siteConfig.url}${path}`;

/**
 * Both languages, with the hreflang cluster expressed as `alternates` on each
 * entry. Two things are deliberately absent:
 *
 *   - the thank-you pages, which are reachable only after a submit
 *   - everything under /lp/, which is noindex ad traffic
 *
 * Listing either would contradict the robots directives on the pages
 * themselves, and Google treats that contradiction as a quality signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    for (const key of Object.keys(ROUTES) as PageKey[]) {
      if (key === "thanks") continue;

      const languages: Record<string, string> = {};
      for (const other of LANGS) languages[other === "fr" ? "fr-CA" : "en-CA"] = abs(pathFor(key, other));

      entries.push({
        url: abs(pathFor(key, lang)),
        lastModified,
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : key === "quote" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }

    for (const city of CITIES) {
      const slug = city.slug[lang];
      if (!slug) continue;

      // Only the languages this city actually has — a false alternate breaks
      // the whole cluster, not just the missing side.
      const languages: Record<string, string> = {};
      if (city.slug.fr) languages["fr-CA"] = abs(cityPathFor(city.slug.fr, "fr"));
      if (city.slug.en) languages["en-CA"] = abs(cityPathFor(city.slug.en, "en"));

      entries.push({
        url: abs(cityPathFor(slug, lang)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  for (const post of POSTS) {
    entries.push({
      url: abs(`/${post.lang}/${ROUTES.blog[post.lang]}/${post.slug}/`),
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
