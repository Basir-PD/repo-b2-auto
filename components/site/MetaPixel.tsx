"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Meta Pixel.
 *
 * Loaded only after the visitor grants MARKETING consent, and never before —
 * the pixel writes `_fbp` the moment it initialises, which under Law 25 is
 * exactly the kind of non-essential storage that requires opt-in first. That
 * is why this is not simply dropped into the layout the way GTM is: GTM has
 * Consent Mode to hold it back, the pixel has nothing equivalent.
 *
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set, so local and
 * preview builds stay clean.
 */
export default function MetaPixel() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    function read() {
      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
        ?.split("=")[1];
      const state = parseConsent(raw ? decodeURIComponent(raw) : null);
      setGranted(Boolean(state?.marketing));
    }
    read();
    // The banner writes the cookie and pushes this; no reload needed.
    const onConsent = () => read();
    window.addEventListener("b2-consent-updated", onConsent);
    return () => window.removeEventListener("b2-consent-updated", onConsent);
  }, []);

  if (!META_PIXEL_ID || !granted) return null;

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
