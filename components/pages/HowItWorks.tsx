import Image from "next/image";

import type { Lang } from "@/config/routes";
import { getCopy } from "@/content/copy";

/*
  All three were normalised to one 1200x694 canvas with the subject scaled to
  a common width, so the three headings sit on the same line no matter how
  tall each subject is. The surrounding white is the image's own background
  and is invisible against the card.
*/
const STEP_IMAGES = [
  "/photos/etape-1-estimation.webp",
  "/photos/etape-2-remorquage.webp",
  "/photos/etape-3-comptant.webp",
] as const;

/**
 * "Tell us about the vehicle → we schedule the pickup → you are paid cash."
 *
 * Lifted out of the homepage so the paid landing pages can render the same
 * three steps rather than a paraphrase of them. It is the section that
 * answers the only question a first-time seller actually has — *what happens
 * to me if I call?* — and a landing page that omits it is asking a stranger
 * to start a process it has not described.
 *
 * `heading` exists because the two contexts want different levels. The
 * homepage is an H2 under the page's H1; on a landing page this is the only
 * section, so it stays an H2 there too, but the size is dialled down: it is
 * support for the offer above it, not a competing headline.
 */
export default function HowItWorks({
  lang,
  compact = false,
}: {
  lang: Lang;
  /** Landing-page mode: tighter padding, smaller heading, no page chrome. */
  compact?: boolean;
}) {
  const t = getCopy(lang).home.howItWorks;

  return (
    <section className={compact ? "bg-white pb-14 sm:pb-16" : "bg-white py-16 sm:py-20 lg:py-24"}>
      <div
        className={
          compact ? "container mx-auto px-4 sm:px-6" : "container mx-auto px-4 sm:px-6 lg:px-8"
        }
      >
        <h2
          className={
            compact
              ? "max-w-3xl text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
              : "max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
          }
        >
          {t.title}
        </h2>

        {/* Numbered because this genuinely is a sequence — the order is the content. */}
        <ol
          className={
            compact ? "mt-8 grid gap-5 md:grid-cols-3" : "mt-10 grid gap-6 md:grid-cols-3 lg:gap-8"
          }
        >
          {t.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 p-6 sm:p-7">
              {/*
                No `priority`: this section is well below the fold on both
                page types and must not compete with the hero for the LCP.
              */}
              <Image
                src={STEP_IMAGES[index]}
                alt={step.alt}
                width={1200}
                height={694}
                sizes="(min-width: 1280px) 330px, (min-width: 768px) 26vw, 88vw"
                className="h-auto w-full"
              />
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-black text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
