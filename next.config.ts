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
   * One host, one set of URLs.
   *
   * The site is canonically https://autosb2.com (apex, no www) — that is what
   * siteConfig.url stamps into every canonical, hreflang, og:url, JSON-LD url
   * and sitemap entry. Three other hostnames can reach this content, and each
   * one that answers 200 is a duplicate of the entire site:
   *
   *   www.autosb2.com   — the www form of the real domain
   *   b2autos.com       — the legacy/alternate domain
   *   www.b2autos.com   — its www form
   *
   * All three 301 to the apex, preserving the path and the query string, so a
   * link to any of them keeps its destination and passes its equity on.
   *
   * ⚠️ CODE ALONE IS NOT ENOUGH. A redirect can only fire if the request
   * actually reaches this app, and it only reaches this app if the hostname
   * resolves here. For each of b2autos.com and www.b2autos.com you must ALSO:
   *
   *   1. Add the domain to this project in Vercel
   *      (Project → Settings → Domains → Add).
   *   2. Point its DNS at Vercel — apex via an A record to 76.76.21.21,
   *      www via a CNAME to cname.vercel-dns.com (Vercel shows the exact
   *      values when you add the domain).
   *   3. Wait for the TLS certificate to issue, or the redirect fails at the
   *      handshake, before any HTTP status is ever sent.
   *
   * Until b2autos.com is added and pointed at the project, the b2autos.com
   * rules below are inert — they are not wrong, they are simply never reached.
   *
   * Vercel can also do the www→apex redirect itself at the domain level. If
   * you configure it there, the www.autosb2.com rule here becomes redundant
   * rather than conflicting; both produce the same 301 to the same target.
   */
  async redirects() {
    /*
      Two rules per host, and both details matter:

      `statusCode: 301` rather than `permanent: true`. Next's `permanent` flag
      emits 308, not 301. Google treats the two the same, but plenty of older
      tooling, analytics and link checkers do not, and there is no upside to
      the less-understood status here.

      `:path+` rather than `:path*`, with the trailing slash written into the
      destination. `trailingSlash: true` above means the canonical form of
      every URL ends in a slash — but `:path*` does not capture that slash, so
      `destination: ".../:path*"` produced `https://autosb2.com/fr/about`,
      which the app then 308s a SECOND time to add the slash back. Two hops on
      every redirected link. `:path+` requires at least one segment, so the
      bare root falls through to the root rule below instead of producing a
      double slash.

      Files are the exception and must come FIRST. `trailingSlash` does not
      apply to a path with an extension: /sitemap.xml is a file, and the
      slash-appending rule turned it into /sitemap.xml/, which 404s. Anything
      ending in `.ext` — sitemap.xml, robots.txt, llms.txt, the icons, every
      image in /public — redirects verbatim.
    */
    const toApex = (host: string) => [
      {
        // Files: no trailing slash, ever.
        source: "/:file(.*\\.[a-zA-Z0-9]+)",
        has: [{ type: "host" as const, value: host }],
        destination: "https://autosb2.com/:file",
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "https://autosb2.com/",
        statusCode: 301,
      },
      {
        source: "/:path+",
        has: [{ type: "host" as const, value: host }],
        destination: "https://autosb2.com/:path+/",
        statusCode: 301,
      },
    ];

    return [...toApex("www.autosb2.com"), ...toApex("b2autos.com"), ...toApex("www.b2autos.com")];
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
