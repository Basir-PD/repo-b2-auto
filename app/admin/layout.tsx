import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Admin",
  // The dashboard must never turn up in search results.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The Convex providers are mounted here rather than in the root layout
 * so the public marketing pages ship no Convex client at all — the
 * landing page's bundle size feeds Core Web Vitals and Ads Quality Score.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
