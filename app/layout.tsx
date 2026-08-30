import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { siteConfig, fullAddress } from "@/lib/site";
import { HTML_LANG, LANGUAGE_COOKIE, resolveLanguage } from "@/lib/language";
import type { Language } from "@/lib/translations";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

/**
 * Which language to render for THIS request: the saved cookie first, then the
 * browser's Accept-Language, then English. (`?lang=` is a search param, which
 * layouts can't see — the provider applies it on the client.)
 */
async function getRequestLanguage(): Promise<Language> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLanguage({
    cookie: cookieStore.get(LANGUAGE_COOKIE)?.value,
    acceptLanguage: headerList.get("accept-language"),
  });
}

const COPY: Record<Language, { title: string; description: string }> = {
  fr: {
    title: `${siteConfig.name} — ${siteConfig.tagline.fr}`,
    description:
      "B2 Autos achète votre auto scrap, accidentée ou usagée comptant à Mascouche, Terrebonne, Laval et sur la Rive-Nord. Soumission gratuite en minutes, remorquage gratuit, paiement sur place. Appelez le +1 (514) 623-2787.",
  },
  en: {
    title: `${siteConfig.name} — ${siteConfig.tagline.en}`,
    description:
      "B2 Autos pays cash for scrap, damaged and used cars in Mascouche, Terrebonne, Laval and across Montreal's North Shore. Free quote in minutes, free towing, paid on the spot. Call +1 (514) 623-2787.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const { title, description } = COPY[language];

  return {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Automotive",
  keywords: [
    // FR — the money terms in Quebec
    "achat auto scrap Mascouche",
    "vendre son auto comptant",
    "recyclage automobile Mascouche",
    "cour à scrap Mascouche",
    "achat auto accidentée Terrebonne",
    "remorquage gratuit Rive-Nord",
    "vendre auto sans immatriculation Québec",
    "argent comptant pour auto Laval",
    "ferrailleur auto Québec",
    // EN
    "cash for cars Mascouche",
    "scrap car removal Terrebonne",
    "sell my car for cash Laval",
    "junk car buyer Quebec",
    "auto wreckers Mascouche",
    "free car towing North Shore Montreal",
  ],
  // Only the canonical goes through Metadata. Next's resolver strips the
  // query string from `alternates.languages`, which silently collapses the
  // en-CA alternate onto the fr-CA URL, so those <link>s are emitted by
  // hand in <head> below.
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: language === "fr" ? "fr_CA" : "en_CA",
    alternateLocale: [language === "fr" ? "en_CA" : "fr_CA"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: siteConfig.heroBackground,
        width: 1200,
        height: 630,
        alt: `${siteConfig.legalName} — ${fullAddress}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.heroBackground],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  other: {
    "geo.region": "CA-QC",
    "geo.placename": siteConfig.address.locality,
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
  // Paste the token from Google Search Console once the property is verified.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#206735",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();

  return (
    // Rendered in the visitor's language on the server, so the first paint is
    // already correct. LanguageContext keeps this in sync if they switch.
    <html
      lang={HTML_LANG[language]}
      className={`${outfit.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/*
          No font preconnect: next/font self-hosts Outfit at build time, so
          the page never touches fonts.gstatic.com. A preconnect to a host we
          never call just spends a DNS lookup and TLS handshake for nothing.
        */}

        {/*
          hreflang — see the note on `alternates` above.

          The bare URL now varies by Accept-Language, so it can't also be the
          French address: each language gets an explicit, stable `?lang=` URL
          that always serves that language, and the bare URL is x-default —
          the auto-detecting entry point. That's the pattern Google documents
          for language-negotiated pages.
        */}
        <link rel="alternate" hrefLang="fr-CA" href={`${siteConfig.url}/?lang=fr`} />
        <link rel="alternate" hrefLang="en-CA" href={`${siteConfig.url}/?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />
        <JsonLd locale={language} />
      </head>
      <body className={`${outfit.className} antialiased bg-white text-slate-900`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          {language === "fr" ? "Aller au contenu principal" : "Skip to main content"}
        </a>
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
