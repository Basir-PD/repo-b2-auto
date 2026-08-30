import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

/**
 * Keeps the Convex auth session cookie fresh on every request.
 *
 * Note this does NOT gate /admin — the sign-in form lives at /admin
 * itself, so redirecting unauthenticated visitors away would hide the
 * very page they need. Authorisation is enforced where it actually
 * matters: every admin query and mutation in convex/quotes.ts calls
 * requireAdmin(), so the data is protected even if someone loads the
 * page directly or calls the backend themselves.
 */
export default convexAuthNextjsMiddleware();

export const config = {
  // Scoped to the admin area plus /api/auth, which the Convex Auth
  // middleware itself serves (sign-in, sign-out, token refresh). The
  // marketing pages have no session to refresh, and running auth
  // middleware on them would add latency to exactly the pages whose
  // speed feeds Core Web Vitals and Ads Quality Score.
  matcher: ["/admin", "/admin/:path*", "/api/auth", "/api/auth/:path*"],
};
