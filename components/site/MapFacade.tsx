import { ExternalLink, MapPin } from "lucide-react";

import { siteConfig, directionsUrl } from "@/config/site";

/**
 * Stands in for the embedded Google Map of the yard.
 *
 * The embed cost about 455 KB and 390 ms of main-thread time (init_embed.js,
 * places.js, common.js and the rest), and PageSpeed loaded it on the
 * homepage and /fr/lp/cour-scrap/ even though it sits below the fold. This
 * card is plain server HTML: no script, no request to maps.googleapis.com or
 * maps.gstatic.com, and nothing for a visitor who never taps it.
 *
 * Tapping it opens directions to the yard in Google Maps, in a new tab so the
 * page and its form are still there afterwards. It keeps the old iframe's
 * box (pass the same height classes) so swapping one for the other cannot
 * move the layout.
 */
export default function MapFacade({
  label,
  className = "h-[300px] sm:h-[380px] lg:h-[440px]",
}: {
  /** What the tap does, in the page's language: t.home.yard.mapOpen. */
  label: string;
  className?: string;
}) {
  const { street, locality, region, postalCode } = siteConfig.address;

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#e8eef0] text-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${className}`}
    >
      {/*
        A street grid drawn in CSS, so the card reads as a map at a glance
        without an image to download. Decorative only.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-70 [background-image:linear-gradient(#fff_2px,transparent_2px),linear-gradient(90deg,#fff_2px,transparent_2px),linear-gradient(#fff_6px,transparent_6px),linear-gradient(90deg,#fff_6px,transparent_6px)] [background-position:0_0,0_0,0_38%,62%_0] [background-size:44px_44px,44px_44px,100%_100%,100%_100%] [background-repeat:repeat,repeat,no-repeat,no-repeat]"
      />
      <span
        aria-hidden="true"
        className="absolute top-[18%] left-[12%] h-16 w-24 rounded-xl bg-brand-100/80"
      />
      <span
        aria-hidden="true"
        className="absolute right-[10%] bottom-[16%] h-20 w-32 rounded-xl bg-brand-100/80"
      />

      <span className="relative flex flex-col items-center px-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 shadow-lg shadow-brand-900/25 transition-transform group-hover:-translate-y-0.5">
          <MapPin className="h-7 w-7 text-white" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="mt-4 rounded-xl bg-white/95 px-5 py-3 shadow-md">
          <span className="block text-lg font-black leading-tight text-slate-900">{street}</span>
          <span className="block text-sm font-semibold text-slate-600">
            {locality}, {region} {postalCode}
          </span>
        </span>
        <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-brand-700">
          {label}
          <ExternalLink className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
