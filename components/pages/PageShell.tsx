import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor } from "@/config/routes";
import { getCopy } from "@/content/copy";
import type { Section } from "@/content/services";
import PhoneLink from "@/components/site/PhoneLink";
import { CALL_CTA } from "@/lib/cta";
// parked with both hero whatsapp buttons below
// import WhatsAppLink from "@/components/site/WhatsAppLink";
import GoogleRatingBadge from "@/components/site/GoogleRatingBadge";
import QuoteForm from "@/components/site/QuoteForm";
import PlacedSlideshow from "@/components/site/PlacedSlideshow";

export function Breadcrumbs({
  lang,
  trail,
}: {
  lang: Lang;
  trail: { name: string; path: string }[];
}) {
  const t = getCopy(lang);
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500">
        <li>
          <Link href={pathFor("home", lang)} className="hover:text-slate-900 hover:underline">
            {t.common.breadcrumbHome}
          </Link>
        </li>
        {trail.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {index === trail.length - 1 ? (
              <span className="font-semibold text-slate-800" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link href={crumb.path} className="hover:text-slate-900 hover:underline">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * `cta` adds the hero's WhatsApp-then-phone pair and the truck beneath it.
 *
 * It is opt-in rather than automatic because PageHeader also sits on top of
 * the privacy policy and the terms, where a "message us on WhatsApp" button
 * is noise, and on the contact page, which already carries both buttons a
 * few hundred pixels further down. The pages that take it are the four
 * services, about, the FAQ and every city page — where a reader has arrived
 * with a question and the answer to most of them is a phone call.
 *
 * City pages earn it most: they are the ad and organic landing pages for
 * "vendre mon auto <ville>", and before this their first contact affordance
 * was the quote form, below four sections, an FAQ and a map iframe.
 */
export function PageHeader({
  lang,
  trail,
  h1,
  lede,
  cta = false,
}: {
  lang: Lang;
  trail: { name: string; path: string }[];
  h1: string;
  lede?: string;
  cta?: boolean;
}) {
  const t = getCopy(lang);

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-14">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs lang={lang} trail={trail} />
        <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
          {h1}
        </h1>
        {lede && <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{lede}</p>}

        {cta && (
          <>
            {/* Stacked and equal width, the same pair as the homepage hero. */}
            <div className="mt-7 flex max-w-md flex-col gap-3">
              <PhoneLink
                source="page_header"
                showIcon
                label={t.home.ctaSecondary}
                className={CALL_CTA}
              />
              {/* whatsapp parked in the heroes for now, owner's call. uncomment to bring it back bro
              <WhatsAppLink
                source="page_header"
                label={t.home.whatsappCta}
                prefill={t.home.whatsappPrefill}
                variant="outline"
              />
              */}
            </div>

            {/* 5 stars under the call button, same as the homepage. links to the GBP reviews */}
            <GoogleRatingBadge lang={lang} className="mt-4" />

            {/* A single column, so one slideshow at every width, where the tow truck was. */}
            <PlacedSlideshow lang={lang} place="always" className="mt-8" />
          </>
        )}
      </div>
    </section>
  );
}

/**
 * The city-page hero: headline and proof on the left, the quote form on the
 * right, the same pair of buttons and the same truck as everywhere else.
 *
 * It exists instead of `PageHeader cta` on cities because the shapes differ
 * more than a flag can carry — one is a single `max-w-4xl` column, this is a
 * 12-column split — and bending PageHeader into both would put the risk on
 * the eight pages that were fine.
 *
 * Two deliberate choices:
 *
 * THE LEDE IS NOT HERE. It moved into the body, directly above the distance
 * cards, and the trust strip took its place. It is still on the page because
 * it is the most locally specific writing a city page has — the route, the
 * arteries, the neighbourhoods — and `content/cities.ts` exists to stop these
 * pages reading as one template with the name swapped. Deleting it to make
 * room would have traded the thing that keeps the set out of a doorway
 * classification for six lines that are identical on all of them.
 *
 * `formSource` MUST differ from the form further down the page. QuoteForm
 * builds its field ids out of `source`, so two forms sharing one would emit
 * duplicate ids and every label in the second would point at the first form's
 * inputs — which a keyboard or screen-reader user hits immediately and a
 * mouse user never notices.
 */
export function CityHeader({
  lang,
  trail,
  h1,
  formSource,
}: {
  lang: Lang;
  trail: { name: string; path: string }[];
  h1: string;
  formSource: string;
}) {
  const t = getCopy(lang);

  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10 sm:py-14">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs lang={lang} trail={trail} />

        <div className="mt-5 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              {h1}
            </h1>

            {/*
              Two fixed columns rather than a wrap: six items of very
              different widths ragged badly when they were left to flow, and
              the point of a strip like this is that the checkmarks line up.
            */}
            <ul className="mt-6 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {t.home.trustStrip.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <Check className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>

            <PlacedSlideshow lang={lang} place="phone" className="mt-7" />

            <div className="mt-6 flex max-w-md flex-col gap-3">
              <PhoneLink
                source="city_header"
                showIcon
                label={t.home.ctaSecondary}
                className={CALL_CTA}
              />
              {/* whatsapp parked in the heroes for now, owner's call. uncomment to bring it back bro
              <WhatsAppLink
                source="city_header"
                label={t.home.whatsappCta}
                prefill={t.home.whatsappPrefill}
                variant="outline"
              />
              */}
            </div>

            {/* 5 stars under the call button, same as the homepage. links to the GBP reviews */}
            <GoogleRatingBadge lang={lang} className="mt-4" />
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md lg:ml-auto lg:mr-0">
              {/* The form after the page content keeps #quote-form. */}
              <QuoteForm lang={lang} source={formSource} compact anchor={false} />
            </div>
          </div>
        </div>

        {/* Laptop and desktop: the slideshow at full width, where the big tow truck was. */}
        <PlacedSlideshow lang={lang} place="wide" className="mt-10" />
      </div>
    </section>
  );
}

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {sections.map((section) => (
        <section key={section.h2} className="mt-10 first:mt-0">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {section.h2}
          </h2>
          {section.body?.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-base leading-relaxed text-slate-700">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {section.list.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-4 text-[15px] font-medium text-slate-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

/** Repeated after every major page. The page's whole job is the next contact. */
export function CtaBand({ lang }: { lang: Lang }) {
  const t = getCopy(lang);
  return (
    <section className="bg-slate-950 py-14 sm:py-16">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl">
          {t.home.finalCta.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-300">{t.home.finalCta.sub}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {/* The call leads here too; the quote page is the second choice. */}
          <PhoneLink
            source="cta_band"
            showIcon
            label={t.home.ctaSecondary}
            className="flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-brand-600 px-7 py-4 text-base font-bold tabular-nums text-white shadow-lg shadow-black/30 transition-colors hover:bg-brand-500"
          />
          <Link
            href={pathFor("quote", lang)}
            className="rounded-xl border-2 border-white/25 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            {t.home.ctaPrimary}
          </Link>
        </div>
      </div>
    </section>
  );
}
