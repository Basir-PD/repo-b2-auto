import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "@/app/globals.css";

const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Admin",
  // The dashboard must never turn up in search results.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * A root layout of its own, so the marketing tree can own <html lang> per
 * language without the dashboard forcing a shared parent. The Convex
 * providers stay here too: the public pages ship no Convex client at all,
 * which is bundle weight that would otherwise land on the LCP of the exact
 * pages Ads Quality Score is measured on.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased bg-white text-slate-900`}>
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
