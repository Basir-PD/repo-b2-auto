import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock, MapPin } from "lucide-react";

import { LANGS, isLang, pathFor, cityPathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress, mapsEmbedUrl, mapsUrl } from "@/config/site";
import { getCopy } from "@/content/copy";
import { homeFaqFor } from "@/content/faq";
import { CITIES } from "@/content/cities";
import { HOME_PHOTOS } from "@/content/photos";
import { hasReviews, REVIEWS } from "@/content/reviews";
import QuoteForm from "@/components/site/QuoteForm";
import PhotoGrid from "@/components/site/PhotoGrid";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import PhoneLink from "@/components/site/PhoneLink";
import { JsonLd, faqSchema, webPageSchema } from "@/components/site/JsonLd";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLang(raw)) return {};
  const t = getCopy(raw);

  return {
    title: t.home.metaTitle,
    description: t.home.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/${raw}/`,
      languages: {
        "fr-CA": `${siteConfig.url}/fr/`,
        "en-CA": `${siteConfig.url}/en/`,
        "x-default": `${siteConfig.url}/fr/`,
      },
    },
    openGraph: {
      type: "website",
      locale: raw === "fr" ? "fr_CA" : "en_CA",
      // The page exists in both languages; say so, or a share only ever
      // offers the one it was shared from.
      alternateLocale: raw === "fr" ? ["en_CA"] : ["fr_CA"],
      url: `${siteConfig.url}/${raw}/`,
      siteName: siteConfig.name,
      title: t.home.metaTitle,
      description: t.home.metaDescription,
      images: [
        {
          url: "/hero-tow-truck.jpg",
          width: 1536,
          height: 1024,
          alt: `${siteConfig.name} — ${fullAddress}`,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  const t = getCopy(lang);
  const faq = homeFaqFor(lang);

  return (
    <>
      <JsonLd id="ld-faq-home" data={faqSchema(faq)} />
      <JsonLd
        id="ld-webpage"
        data={webPageSchema({
          lang,
          name: t.home.metaTitle,
          description: t.home.metaDescription,
          path: `/${lang}/`,
        })}
      />

      {/* ---------------------------------------------------------- Hero */}
      {/*
        The truck is our own branded cutout, not a photograph behind a scrim.
        It sits on the page rather than under it: no dimming, no gradient
        fighting the copy for contrast, and the Autos b2 livery is legible —
        which is the whole point of using our truck instead of a stock one.

        It is decorative here: the headline already says what the business
        does, so an alt text would only repeat it to a screen reader.
      */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-56 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-100/40 blur-3xl"
        />

        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 lg:max-w-xl">
              {/*
                The markets served, not the address. The yard is in Mascouche
                and that is stated in the schema, the footer and the yard
                section — but a searcher in Laval needs to see Laval, and it
                would read oddly directly above a headline naming Laval and
                Montreal.
              */}
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 sm:text-[13px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                {lang === "fr" ? "Laval · Montréal · Rive-Nord" : "Laval · Montreal · North Shore"}
                <span className="text-brand-400" aria-hidden="true">
                  /
                </span>
                {t.common.hours}
              </p>

              <h1 className="mt-5 text-[2.1rem] font-black leading-[1.06] tracking-tight text-slate-900 sm:text-[2.9rem] lg:text-[3.25rem]">
                {t.home.h1}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
                {t.home.sub}
              </p>

              {/*
                The price figure is switched off for now, on request.

                It read: priceFigure ("300 $ – 3 000 $") set large in tabular
                numerals against a green rule, with priceCaption beneath. The
                copy keys are still in content/copy/*.ts, so restoring it is
                just uncommenting this block.

              <div className="mt-8 inline-block border-l-4 border-brand-600 pl-4">
                <p className="text-[2rem] font-black leading-none tracking-tight tabular-nums text-slate-900 sm:text-[2.4rem]">
                  {t.home.priceFigure}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-600">
                  {t.home.priceCaption}
                </p>
              </div>
              */}

              {/*
                WhatsApp leads here rather than a second link to the quote
                page: the form is already in this viewport, and someone
                standing next to a dead car would rather send a photo than
                describe it. The chat opens with the first message written.
              */}
              {/*
                Stacked and equal width. Side by side, these two labels
                overflow a 576px column and the phone number breaks across
                lines — a stack that looks deliberate beats a row that wraps.
              */}
              <div className="mt-8 flex max-w-md flex-col gap-3">
                <WhatsAppLink
                  source="hero"
                  label={t.home.whatsappCta}
                  prefill={t.home.whatsappPrefill}
                />
                <PhoneLink
                  source="hero"
                  showIcon
                  label={t.home.ctaSecondary}
                  className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
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
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-md sm:max-w-xl lg:ml-auto lg:mr-0 lg:max-w-md">
                <QuoteForm lang={lang} source="hero_form" compact />
              </div>
            </div>
          </div>

          {/*
            Full width beneath both columns, where it has room to be read.
            `priority` because it is the LCP element on a wide screen, and the
            explicit width/height reserve the box so it cannot shift the page.
          */}
          <div className="mt-12 lg:mt-16">
            <Image
              src="/tow-truck-hero.webp"
              alt=""
              width={1600}
              height={476}
              priority
              fetchPriority="high"
              sizes="(min-width: 1280px) 1216px, 100vw"
              quality={72}
              className="mx-auto h-auto w-full max-w-5xl"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- How it works */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.howItWorks.title}
          </h2>

          {/* Numbered because this genuinely is a sequence — the order is the content. */}
          <ol className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
            {t.home.howItWorks.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 p-6 sm:p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-black text-slate-900">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------- Fleet photos */}
      {/*
        Below the fold on purpose. These are proof, not decoration, and they
        must never compete with the hero for the LCP.
      */}
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.fleetTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            {t.home.fleetSub}
          </p>
          <div className="mt-8">
            <PhotoGrid lang={lang} photos={HOME_PHOTOS} columns={3} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ What we buy */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.buyAll.title}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.buyAll.items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-[15px] font-semibold text-slate-800"
              >
                <Check className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>

          {/* Verified figures only. No volume language, no invented counts. */}
          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {t.home.stats.map((stat) => (
              <div key={stat} className="rounded-xl bg-brand-600 px-6 py-7 text-center text-white">
                <dt className="text-base font-black leading-snug sm:text-lg">{stat}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------- Why us */}
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.why.title}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
            {t.home.why.points.map((point) => (
              <div key={point.title} className="border-l-4 border-brand-600 pl-5">
                <h3 className="text-lg font-black text-slate-900">{point.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Service area */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.serviceArea.title}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {siteConfig.address.street}, {siteConfig.address.locality}, {siteConfig.address.region}{" "}
            {siteConfig.address.postalCode}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {t.home.serviceArea.cities.map((city) => {
              const page = CITIES.find((c) => c.name === city && c.slug[lang]);
              return page ? (
                <li key={city}>
                  <Link
                    href={cityPathFor(page.slug[lang]!, lang)}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-600 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {city}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ) : (
                <li
                  key={city}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
                >
                  {city}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/*
        Reviews. Rendered only when content/reviews.ts holds the 5 real ones —
        an empty section, or a rating with nothing behind it, is worse than
        no section at all.
      */}
      {hasReviews && (
        <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.home.reviewsHeading}
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((review) => (
                <li key={review.author} className="rounded-xl border border-slate-200 p-6">
                  <p className="text-amber-500" aria-label={`${review.rating} / 5`}>
                    {"★".repeat(review.rating)}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                    {review.body[lang]}
                  </p>
                  <p className="mt-4 text-sm font-bold text-slate-900">{review.author}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- FAQ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.faqHeading}
          </h2>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((item) => (
              /* Native <details>: no JavaScript, works before hydration. */
              <details key={item.id} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-slate-900 marker:content-['']">
                  {item.q}
                  <ChevronRight className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
          <Link
            href={pathFor("faq", lang)}
            className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
          >
            {t.home.faqAllLink}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------- The yard */}
      {/*
        Placed between the FAQ and the closing CTA rather than after it. The
        address is the last piece of evidence someone weighs — a scrap buyer
        with a real lot is not a broker reselling the call — and the CTA still
        gets to close the page.
      */}
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                {t.home.yard.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {t.home.yard.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                {t.home.yard.body}
              </p>

              {/*
                The address is the point of the section, so it is set as an
                address, not as body copy — large, on its own lines, the way
                it would be written on an envelope.
              */}
              <address className="mt-7 not-italic">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-brand-600" strokeWidth={2} />
                  <span className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.locality}, {siteConfig.address.region}{" "}
                    {siteConfig.address.postalCode}
                  </span>
                </p>
              </address>

              <p className="mt-5 flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <Clock className="h-4 w-4 shrink-0 text-brand-600" />
                {t.common.hoursLong}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <MapPin className="h-5 w-5" strokeWidth={2.5} />
                  {t.home.yard.directions}
                </a>
                <PhoneLink
                  source="yard"
                  showIcon
                  label={t.home.ctaSecondary}
                  className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-2 border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/*
              Zoomed to 17, close enough to read the lot rather than the
              region. Lazy — an embedded map pulls a lot of script, and this
              sits well below the fold, so it must not touch the initial load
              on a page paid clicks land on.
            */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
              <iframe
                src={mapsEmbedUrl(17)}
                title={t.home.yard.mapAlt}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[300px] w-full border-0 sm:h-[380px] lg:h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Final CTA */}
      <section className="bg-slate-950 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            {t.home.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
            {t.home.finalCta.sub}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={pathFor("quote", lang)}
              className="rounded-xl bg-brand-600 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-brand-500"
            >
              {t.home.ctaPrimary}
            </Link>
            <PhoneLink
              source="final_cta"
              showIcon
              label={t.home.ctaSecondary}
              className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-white/25 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10"
            />
          </div>
        </div>
      </section>
    </>
  );
}
