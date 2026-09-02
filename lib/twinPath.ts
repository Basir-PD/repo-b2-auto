import {
  LANGS,
  ROUTES,
  alternatesFor,
  cityPathFor,
  isLang,
  otherLang,
  pathFor,
  resolveSlug,
  type Lang,
} from "@/config/routes";
import { CITIES } from "@/content/cities";

/**
 * The same page in the other language, or null when it has no twin.
 *
 * Returning null matters: six of the nine city pages are French-only, and a
 * switcher that quietly dumps someone on the English homepage is worse than
 * no switcher at all — it loses their place and, if mirrored into hreflang,
 * breaks the whole cluster.
 */
export function twinPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  const [maybeLang, ...rest] = parts;
  if (!isLang(maybeLang)) return null;

  const lang: Lang = maybeLang;
  const target = otherLang(lang);

  // Homepage.
  if (rest.length === 0) return `/${target}/`;

  // Landing pages are single-language by design and carry no switcher.
  if (rest[0] === "lp") return null;

  const resolved = resolveSlug(lang, rest[0]);
  if (!resolved) return null;

  // Blog post: /<lang>/<blog>/<post>/
  if (rest.length === 2 && resolved.type === "page" && resolved.key === "blog") {
    // Articles are written in French only for now, so there is no twin to
    // point at. When one is translated, add it to the post's `slug` map.
    return null;
  }

  if (rest.length > 1) return null;

  const alternates = alternatesFor(resolved);
  return alternates[target] ?? null;
}

/** Absolute hreflang map for a page, for <link rel="alternate"> and metadata. */
export function hreflangFor(pathname: string): Partial<Record<Lang, string>> {
  const parts = pathname.split("/").filter(Boolean);
  const [maybeLang, ...rest] = parts;
  if (!isLang(maybeLang)) return {};

  if (rest.length === 0) {
    return Object.fromEntries(LANGS.map((l) => [l, `/${l}/`]));
  }

  const resolved = resolveSlug(maybeLang, rest[0]);
  if (!resolved || rest.length > 1) return { [maybeLang]: pathname };

  return alternatesFor(resolved);
}

/** Every static path that exists in a language — feeds the sitemap. */
export function allPathsFor(lang: Lang): string[] {
  const pages = (Object.keys(ROUTES) as (keyof typeof ROUTES)[])
    // The thank-you page must not be indexed; it is reachable only after a submit.
    .filter((key) => key !== "thanks")
    .map((key) => pathFor(key, lang));

  const cities = CITIES.filter((c) => c.slug[lang]).map((c) => cityPathFor(c.slug[lang]!, lang));

  return [...pages, ...cities];
}
