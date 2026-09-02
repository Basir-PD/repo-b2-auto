"use client";

import { trackEmail } from "@/lib/tracking";
import { siteConfig } from "@/config/site";

export default function MailLink({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  return (
    <a
      href={`mailto:${siteConfig.email}`}
      onClick={() => trackEmail(source)}
      className={className}
    >
      {siteConfig.email}
    </a>
  );
}
