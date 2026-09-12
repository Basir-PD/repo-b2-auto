import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock, FileCheck, Lock, MapPin, Recycle } from "lucide-react";

import { LANGS, isLang, pathFor, cityPathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress, mapsEmbedUrl, mapsUrl } from "@/config/site";
import { getCopy } from "@/content/copy";
import { homeFaqFor } from "@/content/faq";
import { CITIES } from "@/content/cities";
import { SERVICE_AREA } from "@/content/service-area";
import { HOME_PHOTOS } from "@/content/photos";
import { hasReviews, REVIEWS } from "@/content/reviews";
import QuoteForm from "@/components/site/QuoteForm";
import HowItWorks from "@/components/pages/HowItWorks";
import StatBand from "@/components/pages/StatBand";
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

/**
 * The three how-it-works illustrations, in sequence order: get an offer, we
 * tow, we pay cash. Identical in both languages, so they are not in the copy
 * files — only their alt text is, which genuinely does differ.
 */
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
                There was a city-and-hours eyebrow above the headline. Removed
                on request. Worth knowing what went with it: the H1 is a price
                guarantee that names no city, so nothing above the fold is
                local any more. The cities are still in the title, the meta
                description, the schema and the service-area section — but a
                visitor now reads the whole first screen without seeing their
                own city. Put it back if the Laval and Montreal pages stall.
              */}
              {/*
                Set in sentence case, not the caps it was written in. At
                3.25rem in font-black, caps across three lines reads as
                shouting — which is precisely what the competitor's hero does.
                The guarantee is the differentiator, so it gets the brand
                green and lets the colour do the emphasis instead.

                The two halves are inline rather than force-broken: the split
                lands wherever the line wraps, which holds up across both
                languages and every width. The colour marks the seam.
              */}
              <h1 className="text-balance text-[2rem] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-[2.6rem] lg:text-[3rem]">
                {t.home.h1.promise} <span className="text-brand-700">{t.home.h1.guarantee}</span>
              </h1>

              {/*
                Three beats, set as a row rather than a sentence. Written as
                "Offre en 2 minutes. Cash. Remorquage gratuit." — the periods
                are doing the work of separators, so they are rendered as
                separators.
              */}
              <ul className="mt-6 flex max-w-xl flex-wrap items-center gap-x-3.5 gap-y-2 text-lg font-bold text-slate-800 sm:text-xl">
                {t.home.sub.map((beat, index) => (
                  <li key={beat} className="flex items-center gap-3.5">
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                      />
                    )}
                    {beat}
                  </li>
                ))}
              </ul>

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

              {/*
                A grid, not a flex-wrap. At three items the wrap produced tidy
                rows by luck; at six, items of very different widths ragged
                badly. Two fixed columns keep the checkmarks in a line, which
                is the whole visual point of a strip like this.
              */}
              <ul className="mt-8 grid gap-x-5 gap-y-3 sm:grid-cols-2">
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
            Full width beneath both columns, where it has room to be read. The
            explicit width/height reserve the box so it cannot shift the page.

            It used to carry `priority` + fetchPriority="high" on the theory
            that it was the LCP element on a wide screen. Measured, it was not
            the bottleneck: dropping the preload took desktop LCP from 0.8s to
            0.6s, because the preload was competing with the font for the
            H1 — which is the real LCP element on every viewport. On mobile
            this sits well below the fold, so preloading it was pure cost.
          */}
          <div className="mt-12 lg:mt-16">
            <Image
              src="/tow-truck-hero.webp"
              alt=""
              width={1600}
              height={476}
              loading="lazy"
              sizes="(min-width: 1088px) 1024px, 100vw"
              quality={72}
              className="mx-auto h-auto w-full max-w-5xl"
            />
          </div>

          {/*
            The three figures, directly under the photograph and rendered by
            the same component the landing pages use — so the homepage and the
            paid pages state the same claims in the same shape. They used to
            live much further down, set as three green blocks of sentence
            text, which is why the two page types disagreed on what a
            statistic looks like here.
          */}
          <div className="mx-auto mt-8 max-w-5xl">
            <StatBand lang={lang} />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- How it works */}
      <HowItWorks lang={lang} />

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
        </div>
      </section>

      {/* ------------------------------------------------------- Why us */}
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t.home.why.title}
          </h2>
          {/*
            Four points, but deliberately not four equal boxes.

            Only the first one — we own the yard, we are not a broker — is a
            claim a competitor with a phone number and a subcontractor cannot
            copy. The other three are reassurances against the three things
            people fear when they call a scrap buyer: the price changing on
            arrival, being left with the SAAQ paperwork, and the car ending up
            in a field. So the differentiator gets the dark card and the full
            height of the column, and the reassurances read as a list, which
            is what they are. Equal cards would have said all four matter the
            same amount.

            The icons name the point rather than decorate it: a pin for the
            real address, a lock for the price that does not move, a stamped
            document for the SAAQ, a recycling mark for the disposal.
          */}
          {/*
            The differentiator on top, the reassurances underneath — not four
            equal boxes.

            Only the first point, that we own the yard and are not a broker,
            is a claim a competitor with a phone number and a subcontractor
            cannot make. The other three answer the three things people are
            actually afraid of when they call a scrap buyer: the price
            changing when the truck arrives, being left holding the SAAQ
            paperwork, and the car ending up in a field. Equal cards would
            have said all four carry the same weight.

            The icons name the point rather than decorate it: a pin for the
            real address, a lock for the price that does not move, a stamped
            document for the SAAQ, a recycling mark for the disposal.
          */}
          <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-brand-700 p-7 text-white sm:flex-row sm:items-center sm:gap-7 sm:p-9">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <MapPin className="h-7 w-7 text-brand-200" strokeWidth={2.25} />
            </span>
            <div className="max-w-2xl">
              <h3 className="text-xl font-black leading-snug sm:text-2xl">
                {t.home.why.points[0].title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-brand-100">
                {t.home.why.points[0].body}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.why.points.slice(1).map((point, index) => {
              const Icon = [Lock, FileCheck, Recycle][index];
              return (
                <div
                  key={point.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{point.body}</p>
                </div>
              );
            })}
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

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
            {t.home.serviceArea.lead}
          </p>

          {/*
            Grouped by region, not one flat run of 33 chips. The region names
            are search terms in their own right, and a reader scanning for
            "is my city here?" finds it faster in a labelled group.
          */}
          <div className="mt-10 space-y-8">
            {SERVICE_AREA.map((region) => (
              <div key={region.key}>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
                  {region.label[lang]}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {region.cities.map((city) => {
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
            ))}
          </div>
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
