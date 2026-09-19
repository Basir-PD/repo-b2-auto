import type { Lang } from "@/config/routes";
import { businessStats } from "@/content/stats";
import CountUp from "@/components/site/CountUp";

/** Shared by both figure shapes so only the type scale differs between them. */
const figureClass = "block font-black leading-none tracking-tight tabular-nums text-brand-700";

/**
 * The three figures. The counted ones animate once when they scroll into
 * view; the payout range is printed as-is, because CountUp restarts from
 * zero and a counted range reads "$300–$0" for its first frames.
 *
 * Shared by the homepage and every paid landing page so the two cannot
 * present the same claims in two different shapes — which is what happened
 * before: the homepage set them as three green blocks of sentence text while
 * the landing pages set them as numerals in a hairline band.
 *
 * It sits *below* the hero photograph on both, on request. The photograph is
 * the proof and the numbers are the caption; a caption above its picture
 * reads as a header for whatever came before it.
 */
export default function StatBand({ lang }: { lang: Lang }) {
  const { locale, stats } = businessStats(lang);

  return (
    <dl className="grid grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map((stat) => (
        <div key={stat.label} className="px-6 py-6 text-center sm:py-7">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            {/*
              One size down from the counted figures. "$300–$7,500" is twice
              the characters of "11 ans", and at the same 2.25rem it runs past
              the edge of a third of the band on a desktop width.
            */}
            {stat.display !== undefined ? (
              <span className={`${figureClass} text-[1.75rem] sm:text-3xl`}>{stat.display}</span>
            ) : (
              <CountUp
                value={stat.value}
                unit={stat.unit}
                locale={locale}
                className={`${figureClass} text-3xl sm:text-[2.25rem]`}
              />
            )}
            <span className="mt-2 block text-[13px] font-semibold leading-snug text-slate-600">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
