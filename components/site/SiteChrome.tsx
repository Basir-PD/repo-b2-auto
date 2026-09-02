"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the shared chrome on paid landing pages.
 *
 * /lp/ pages are single-goal by design: logo, phone, form, trust signals, and
 * no way out. A layout cannot see which page is rendering inside it, so the
 * decision is made here from the pathname — `usePathname` resolves during
 * server rendering too, so the header and footer are absent from the served
 * HTML, not just hidden after hydration.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.includes("/lp/")) return null;
  return <>{children}</>;
}
