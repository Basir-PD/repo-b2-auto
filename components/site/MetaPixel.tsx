"use client";

import Script from "next/script";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Meta Pixel.
 *
 * This used to wait for marketing consent from the cookie banner. The banner
 * was removed on request, so the gate had nothing left to read and the pixel
 * would simply never have loaded. It now loads wherever the ID is set, and
 * the disclosure lives in the privacy policy instead.
 *
 * Note what that means: the pixel writes `_fbp` on init, which is precisely
 * the non-essential storage Quebec's Law 25 expects opt-in for. See README.
 *
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set, so local and
 * preview builds stay clean.
 */
export default function MetaPixel() {
  if (!META_PIXEL_ID) return null;

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
