import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";

import { LANGS, HTML_LANG, isLang, pathFor, type Lang } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getCopy } from "@/content/copy";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import CookieConsent from "@/components/site/CookieConsent";
import AttributionBoot from "@/components/site/AttributionBoot";
import SiteChrome from "@/components/site/SiteChrome";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/site/GoogleTagManager";
import { JsonLd, localBusinessSchema } from "@/components/site/JsonLd";

/** Self-hosted at build time — no request to fonts.gstatic.com, and swap on. */
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#206735",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLang(raw)) return {};
  const t = getCopy(raw);

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.home.metaTitle, template: `%s | ${siteConfig.name}` },
    description: t.home.metaDescription,
    applicationName: siteConfig.name,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Automotive",
    formatDetection: { telephone: true, address: true, email: true },
    // No `verification` unless the Search Console token is actually set.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
    other: {
      "geo.region": "CA-QC",
      "geo.placename": siteConfig.address.locality,
    },
  };
}

/**
 * Root layout for the public site.
 *
 * There is deliberately no `app/layout.tsx`: <html lang> has to be correct in
 * the served HTML for both languages, and only a layout that can see the
 * `[lang]` segment can do that. The dashboard has its own root layout.
 */
export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const t = getCopy(lang);

  const nav = [
    { href: pathFor("scrapBuying", lang), label: t.nav.scrapBuying },
    { href: pathFor("towing", lang), label: t.nav.towing },
    { href: pathFor("damaged", lang), label: t.nav.damaged },
    { href: pathFor("about", lang), label: t.nav.about },
    { href: pathFor("faq", lang), label: t.nav.faq },
    { href: pathFor("contact", lang), label: t.nav.contact },
  ];

  return (
    <html lang={HTML_LANG[lang]} className={`${outfit.variable} scroll-smooth`}>
      <head>
        <GoogleTagManager />
        <JsonLd id="ld-business" data={localBusinessSchema(lang)} />
      </head>
      <body className={`${outfit.className} antialiased bg-white text-slate-900`}>
        <GoogleTagManagerNoScript />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          {t.common.skipToContent}
        </a>

        <SiteChrome>
          <SiteHeader
            lang={lang}
            labels={{
              nav,
              quote: t.nav.quote,
              hours: t.common.hoursLong,
              switchTo: t.meta.switchTo,
              switchAria: t.meta.switchAria,
              menuOpen: lang === "fr" ? "Ouvrir le menu" : "Open menu",
              menuClose: lang === "fr" ? "Fermer le menu" : "Close menu",
            }}
          />
        </SiteChrome>

        <main id="main">{children}</main>

        <SiteChrome>
          <SiteFooter lang={lang} />
          <WhatsAppFloat ariaLabel={t.common.whatsappAria} />
        </SiteChrome>
        <CookieConsent
          labels={{
            ...t.consent,
            privacyHref: pathFor("privacy", lang),
          }}
        />
        <AttributionBoot />
      </body>
    </html>
  );
}
