import Script from "next/script";
import { GTM_ID } from "@/lib/tracking";

/**
 * GTM plus the Consent Mode v2 default.
 *
 * Order matters and is the whole point: the default-denied call is a plain
 * inline script that runs BEFORE the container loads, so no tag can fire on
 * a storage type the visitor has not agreed to. The banner later pushes an
 * update. Getting this backwards is the single most common Law 25 failure.
 */
export default function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      {/*
        A plain inline script, not next/script. The consent default has to
        execute before the container does, and only a raw tag in <head>
        guarantees that ordering — next/script's beforeInteractive still
        defers past it in the App Router.
      */}
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);`,
        }}
      />
      <Script id="gtm" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </>
  );
}

/** The <noscript> half, which has to sit immediately inside <body>. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
