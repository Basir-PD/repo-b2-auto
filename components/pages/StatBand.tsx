import type { Lang } from "@/config/routes";
import { businessStats } from "@/content/stats";
import CountUp from "@/components/site/CountUp";

/**
 * The three figures, counted up once when they scroll into view.
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
            <CountUp
              value={stat.value}
              unit={stat.unit}
              locale={locale}
              className="block text-3xl font-black leading-none tracking-tight tabular-nums text-brand-700 sm:text-[2.25rem]"
            />
            <span className="mt-2 block text-[13px] font-semibold leading-snug text-slate-600">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
