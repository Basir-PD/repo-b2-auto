import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the stack.
  poweredByHeader: false,

  /**
   * One canonical URL shape. Ads send traffic to the trailing-slash form, and
   * without this every ad click would pay for a redirect hop before the page
   * even starts loading.
   */
  trailingSlash: true,

  images: {
    // Modern formats cut hero weight substantially — Core Web Vitals feed
    // both organic ranking and the Google Ads Quality Score.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  /**
   * One host, one set of URLs: https://www.autosb2.com.
   *
   * ⚠️ READ THIS BEFORE ADDING A HOST REDIRECT HERE.
   *
   * Vercel redirects the apex autosb2.com to www at the DOMAIN level, before
   * a request ever reaches this app. A previous version of this block added
   * a www→apex redirect to move the canonical host to the apex. The two
   * redirects pointed at each other and every single request became an
   * infinite loop:
   *
   *     autosb2.com/fr/      → 308 → www.autosb2.com/fr/   (Vercel)
   *     www.autosb2.com/fr/  → 301 → autosb2.com/fr/       (this file)
   *
   * The entire site was unreachable. Never add a redirect here for a
   * hostname Vercel is already redirecting; check the Domains settings first.
   *
   * To actually move to the apex: flip Vercel (Project → Settings → Domains
   * → make autosb2.com primary and www redirect to it), THEN change
   * siteConfig.url and add the rule back here. In that order, never together.
   *
   * b2autos.com is being retired — the owner has moved everything, including
   * the mailbox, to autosb2.com. These rules are kept rather than deleted:
   * they are inert while the domain is unattached, they cost nothing, and
   * they catch anything that still links to the old host. Remove them once
   * the domain has lapsed and no longer resolves.
   *
   * It is safe to redirect from here because Vercel is not
   * redirecting it — its DNS already resolves to Vercel (216.198.79.1) but
   * it 404s, because the domain is not attached to the project. These rules
   * stay inert until someone attaches it in the dashboard.
   */
  async redirects() {
    /*
      `statusCode: 301` rather than `permanent: true`, which emits 308.

      `:path+` with the trailing slash written into the destination:
      `trailingSlash: true` means the canonical form ends in a slash, but
      `:path*` does not capture it, so the destination lost it and the app
      then redirected a SECOND time to add it back. Files are matched first
      and keep no trailing slash — /sitemap.xml must not become
      /sitemap.xml/, which 404s.
    */
    const toCanonical = (host: string) => [
      {
        source: "/:file(.*\\.[a-zA-Z0-9]+)",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.autosb2.com/:file",
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.autosb2.com/",
        statusCode: 301,
      },
      {
        source: "/:path+",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.autosb2.com/:path+/",
        statusCode: 301,
      },
    ];

    // NOT www.autosb2.com — that is the canonical host and redirecting it
    // here is exactly what caused the outage described above.
    return [...toCanonical("b2autos.com"), ...toCanonical("www.b2autos.com")];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
