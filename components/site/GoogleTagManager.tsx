import { GTM_ID } from "@/lib/tracking";

/**
 * GTM plus the Consent Mode v2 default.
 *
 * Everything non-essential defaults to DENIED. CookieConsent is what grants
 * it, by pushing `gtag('consent','update',…)` when the visitor chooses.
 *
 * These were 'granted' between 2026-09-05 and 2026-09-19, while the site had
 * no banner — deliberately, because with nothing able to grant them, denied
 * would have blocked GA4, Google Ads and Meta permanently and silently, since
 * a blocked tag looks identical to a working one from outside. The banner is
 * back, so these travel back with it. The two changes must always move
 * together, in either direction.
 *
 * `functionality_storage` and `security_storage` stay granted: they are what
 * make the site work at all, and Law 25 does not ask consent for those.
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

        `wait_for_update` is back with the banner: it holds tags briefly so a
        visitor who accepts immediately is still measured, instead of the tag
        firing denied a few milliseconds before their yes arrives.
      */}
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','url_passthrough',true);`,
        }}
      />
      {/*
        Google's own snippet, verbatim, as a raw tag so it lands in <head> —
        which is what their install instructions ask for. next/script's
        afterInteractive injects into <body> instead, and the container then
        starts several hundred milliseconds later, which costs events from
        anyone who taps a phone number and leaves quickly.

        It does not block: the snippet's only job is to append an async
        script tag. It stays AFTER the consent default above, so no tag can
        fire before consent state is declared.
      */}
      {/* eslint-disable-next-line @next/next/next-script-for-ga -- see above:
          next/script places this in <body>, which is the thing being fixed. */}
      <script
        id="gtm"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
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
