import type { Language } from "@/lib/translations";

/** What a visitor gets when nothing tells us otherwise. */
export const DEFAULT_LANGUAGE: Language = "en";

export const SUPPORTED_LANGUAGES: readonly Language[] = ["en", "fr"] as const;

/** Cookie the visitor's explicit choice is stored in. Readable on the server,
 *  which is what lets us render the right language on the FIRST paint rather
 *  than swapping it after hydration. */
export const LANGUAGE_COOKIE = "language";

/** One year — a returning visitor shouldn't have to pick again. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const HTML_LANG: Record<Language, string> = { fr: "fr-CA", en: "en-CA" };

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "fr";
}

/**
 * Pick the best supported language out of an `Accept-Language` header.
 *
 * Browsers send a weighted list, e.g. `fr-CA,fr;q=0.9,en-US;q=0.8`. We honour
 * the weights rather than just reading the first entry, and match on the base
 * subtag so `fr-FR`, `fr-CA` and `fr` all resolve to French.
 *
 * Returns null when the header names nothing we support, so the caller decides
 * the fallback instead of this function guessing.
 */
export function parseAcceptLanguage(header: string | null | undefined): Language | null {
  if (!header) return null;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      // q defaults to 1 when absent, per RFC 9110.
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        // A malformed q= shouldn't outrank a well-formed one.
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    // q=0 explicitly means "not acceptable".
    .filter((c) => c.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of candidates) {
    if (isLanguage(candidate.base)) return candidate.base;
  }
  return null;
}

/**
 * Resolve the language to render, in priority order:
 *
 *   1. `?lang=` in the URL      — an explicit link wins, so a shared or
 *                                 ad-targeted URL always shows what was meant.
 *   2. the saved cookie         — the visitor already picked once.
 *   3. the browser's languages  — Accept-Language.
 *   4. DEFAULT_LANGUAGE         — English.
 *
 * Every input is untrusted, so anything unrecognised is skipped rather than
 * trusted through.
 */
export function resolveLanguage({
  urlParam,
  cookie,
  acceptLanguage,
}: {
  urlParam?: string | null;
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Language {
  if (isLanguage(urlParam)) return urlParam;
  if (isLanguage(cookie)) return cookie;
  return parseAcceptLanguage(acceptLanguage) ?? DEFAULT_LANGUAGE;
}
