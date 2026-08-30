"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Language } from "@/lib/translations";
import {
  DEFAULT_LANGUAGE,
  HTML_LANG,
  LANGUAGE_COOKIE,
  LANGUAGE_COOKIE_MAX_AGE,
  isLanguage,
} from "@/lib/language";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["fr"];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * A cookie, not localStorage, so the SERVER can read the preference on the next
 * request and render that language immediately. Lax keeps it attached to normal
 * top-level navigations (including ad clicks) but not cross-site subrequests.
 */
function writeLanguageCookie(lang: Language) {
  document.cookie = `${LANGUAGE_COOKIE}=${lang};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`;
}

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode;
  /**
   * Resolved on the server from `?lang=`, the saved cookie, then the browser's
   * Accept-Language header. Seeding state with it means the first paint is
   * already in the right language — no flash of the wrong one after hydration.
   */
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Layouts can't read search params, so `?lang=` is applied here. It only
  // differs from what the server picked when the link disagrees with the
  // visitor's browser — and writing the cookie means that costs one render
  // rather than repeating on every visit.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (!isLanguage(fromUrl)) return;
    if (fromUrl !== language) setLanguage(fromUrl);
    writeLanguageCookie(fromUrl);
    // Runs once on mount; `language` is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang> honest — screen readers and search engines both read it.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
  }, [language]);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    writeLanguageCookie(lang);

    // Reflect the choice in the URL without a navigation, so the page can be
    // shared and bookmarked in the language being viewed.
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
