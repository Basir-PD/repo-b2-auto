"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Meta Pixel, gated on marketing consent.
 *
 * The pixel writes `_fbp` the moment it initialises, which is exactly the
 * non-essential storage Quebec's Law 25 expects opt-in for — so unlike the
 * Google tags it cannot simply be declared to Consent Mode and left to load.
 * Meta has no equivalent signal. The only way to honour a refusal is not to
 * load the script at all, which is what this does.
 *
 * It mounts on two triggers: a marketing yes already stored in the cookie
 * (a returning visitor), or the `b2-consent-updated` event CookieConsent
 * fires the moment someone accepts (a first-time one, without a reload).
 *
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set, so local and
 * preview builds stay clean.
 */
export default function MetaPixel() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
        ?.split("=")[1];
      const state = parseConsent(raw ? decodeURIComponent(raw) : null);
      if (state?.marketing) setAllowed(true);
    };
    read();
    window.addEventListener("b2-consent-updated", read);
    return () => window.removeEventListener("b2-consent-updated", read);
  }, []);

  if (!META_PIXEL_ID || !allowed) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
          t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

/** Fire a standard Meta event. No-op when the pixel has not loaded. */
export function fbqTrack(event: "Lead" | "Contact", params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  fbq?.("track", event, params);
}
