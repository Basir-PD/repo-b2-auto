"use client";

import Script from "next/script";
import { GA_ID, GOOGLE_ADS_ID, analyticsEnabled } from "@/lib/analytics";

/**
 * Loads gtag.js once for both GA4 and Google Ads.
 * Renders nothing until at least one measurement ID is configured,
 * so local dev and preview builds stay clean.
 */
export default function Analytics() {
  if (!analyticsEnabled) return null;

  const primaryId = GA_ID || GOOGLE_ADS_ID;

  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
