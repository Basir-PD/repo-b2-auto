import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { DEFAULT_LANG, LANG_HEADER, LANGS, type Lang } from "@/config/routes";

const convexMiddleware = convexAuthNextjsMiddleware();

/**
 * Paths that are never language-prefixed.
 *
 * `/whatsapp` is a route handler, not a page, and it exists in exactly one
 * copy — there is nothing to translate about a redirect. Without it here the
 * middleware rewrote every WhatsApp click to `/fr/whatsapp`, which no route
 * serves, and the button led to a 404.
 */
const PASSTHROUGH = [
  "/api",
  "/_next",
  "/admin",
  "/whatsapp",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
];

/**
 * Best supported language from Accept-Language, honouring the q-weights.
 * Returns null when the header names nothing we serve, so the caller decides
 * the fallback rather than this guessing.
 */
function fromAcceptLanguage(header: string | null): Lang | null {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((c) => c.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of ranked) {
    if ((LANGS as readonly string[]).includes(candidate.base)) return candidate.base as Lang;
  }
  return null;
}

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;

  // The dashboard is the only thing that needs a session refreshed. Keeping
  // Convex off the marketing routes keeps their TTFB — and the Ads Quality
  // Score that depends on it — out of the auth path entirely.
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/auth")) {
    return convexMiddleware(request, event);
  }

  if (PASSTHROUGH.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  /*
    Already language-prefixed. The language is passed on to the app in a
    request header, for one caller: the not-found boundary. Next does not give
    not-found.tsx the route params, so without this it cannot know which
    language it is rendering and has to print both at once — which it did, and
    which read as a page nobody had finished.
  */
  const prefixed = LANGS.find(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );
  if (prefixed) {
    const headers = new Headers(request.headers);
    headers.set(LANG_HEADER, prefixed);
    return NextResponse.next({ request: { headers } });
  }

  const lang = fromAcceptLanguage(request.headers.get("accept-language")) ?? DEFAULT_LANG;

  // `/` negotiates. 302 rather than 301: the target depends on the visitor's
  // headers, and a permanently-cached redirect would pin every later visitor
  // to whichever language the first one happened to want.
  const target = pathname === "/" ? `/${lang}/` : `/${lang}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = target;
  url.search = search;
  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: [
    // Everything except static files and image optimisation.
    "/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
