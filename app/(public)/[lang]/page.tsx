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
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-x-0 top-0 -z-10 h-[19rem] sm:h-[24rem] lg:bottom-0 lg:h-auto">
          <Image
            src="/hero-tow-truck.jpg"
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-55% via-slate-950/65 to-slate-950 lg:hidden"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-gradient-to-r from-slate-950 from-30% via-55% via-slate-950/88 to-slate-950/15 lg:block xl:from-18% xl:via-slate-950/70 xl:to-slate-950/5"
          />
        </div>

        <div className="container mx-auto px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7 lg:max-w-xl">
              <p className="inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white sm:text-sm">
                {t.home.priceAnchor}
              </p>

              <h1 className="mt-6 text-[2.1rem] font-black leading-[1.08] tracking-tight text-white sm:text-[2.9rem] lg:text-[3.3rem]">
                {t.home.h1}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {t.home.sub}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={pathFor("quote", lang)}
                  className="rounded-xl bg-brand-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  {t.home.ctaPrimary}
                </Link>
                <PhoneLink
                  source="hero"
                  showIcon
                  label={t.home.ctaSecondary}
                  className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-white/25 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
                {t.home.trustStrip.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Check className="h-4 w-4 shrink-0 text-brand-400" strokeWidth={3} />
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
