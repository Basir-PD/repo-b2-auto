import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";

import { LANGS, isLang, pathFor, cityPathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress } from "@/config/site";
import { getCopy } from "@/content/copy";
import { homeFaqFor } from "@/content/faq";
import { CITIES } from "@/content/cities";
import { hasReviews, REVIEWS } from "@/content/reviews";
import QuoteForm from "@/components/site/QuoteForm";
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

  const heroAlt =
    lang === "fr"
      ? "Remorqueuse à plateau de B2 Autos chargée d'un véhicule, à Mascouche"
      : "B2 Autos flatbed tow truck loaded with a vehicle, in Mascouche";

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
        Bright ground, crisp photo.
        The page opens on near-white with a single green glow rather than a
        flat colour slab, and the truck runs full-bleed along the bottom as
        the hero's floor — sharp and full-colour, not ghosted behind the
        copy. Washing a photo out to make text readable wastes the one asset
        that proves we own the flatbed; giving it its own band keeps both.
      */}
      <section className="relative isolate overflow-hidden bg-white">
        {/* Soft brand light from the top-left. Two layers, no hard edges. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-to-b from-brand-50 to-white"
        />
        <div
          aria-hidden="true"
          className="absolute -left-40 -top-56 -z-10 h-[36rem] w-[36rem] rounded-full bg-brand-100/50 blur-3xl"
        />

        <div className="container mx-auto px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 lg:max-w-xl">
              {/* Where we are and when — the two facts a local searcher checks first. */}
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 sm:text-[13px]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                {siteConfig.address.locality}
                <span className="text-brand-300" aria-hidden="true">
                  /
                </span>
                {t.common.hours}
              </p>

              <h1 className="mt-5 text-[2.1rem] font-black leading-[1.06] tracking-tight text-slate-900 sm:text-[2.9rem] lg:text-[3.25rem]">
                {t.home.h1}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {t.home.sub}
              </p>

              {/*
                The money, set as a figure rather than a badge. It is the
                single number this whole page is about, so it gets the
                typographic weight instead of a pill that reads as decoration.
              */}
              <div className="mt-8 inline-block border-l-4 border-brand-600 pl-4">
                <p className="text-[2rem] font-black leading-none tracking-tight tabular-nums text-slate-900 sm:text-[2.4rem]">
                  {t.home.priceFigure}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-500">
                  {t.home.priceCaption}
                </p>
              </div>

              {/*
                WhatsApp leads here rather than a second link to the quote
                page: the form is already in this viewport, and someone
                standing next to a dead car would rather send a photo than
                describe it. The chat opens with the first message written.
              */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppLink
                  source="hero"
                  label={t.home.whatsappCta}
                  prefill={t.home.whatsappPrefill}
                />
                <PhoneLink
                  source="hero"
                  showIcon
                  label={t.home.ctaSecondary}
                  className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
                {t.home.trustStrip.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700"
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
        </div>

        {/*
          The truck, whole.
          A full-bleed letterbox strip cropped this 3:2 frame down to wheels
          and asphalt — the least recognisable part of the vehicle. A
          contained panel at 5:2 fits the entire truck: deck, load, the B2
          decal on the door, and the grille. On a phone the panel goes back
          to the source's own 3:2, so nothing is cropped at all.
        */}
        <div className="container mx-auto px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <figure className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-900/10 sm:aspect-[2/1] lg:aspect-[5/2]">
            <Image
              src="/hero-tow-truck.jpg"
              alt={heroAlt}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover object-[50%_48%]"
            />
            {/* The photo does a job: it names the yard it was taken at. */}
            <figcaption className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm sm:bottom-4 sm:left-4 sm:text-sm">
              {t.home.photoChip}
            </figcaption>
          </figure>
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

      {/* ------------------------------------------------ What we buy */}
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
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
      <section className="bg-white py-16 sm:py-20 lg:py-24">
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
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
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
        <section className="bg-white py-16 sm:py-20 lg:py-24">
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
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
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
