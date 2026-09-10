import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";

import { isLang, pathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress } from "@/config/site";
import { getCopy } from "@/content/copy";
import { faqByIds } from "@/content/faq";
import { LANDING_CONTENT, landingBySlug } from "@/content/landing";
import { HOME_PHOTOS } from "@/content/photos";
import QuoteForm from "@/components/site/QuoteForm";
import PhoneLink from "@/components/site/PhoneLink";
import PhotoGrid from "@/components/site/PhotoGrid";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import HowItWorks from "@/components/pages/HowItWorks";
import StatBand from "@/components/pages/StatBand";

export function generateStaticParams() {
  return LANDING_CONTENT.map((lp) => ({ lang: lp.lang, slug: lp.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) return {};
  const lp = landingBySlug(raw, slug);
  if (!lp) return {};

  return {
    title: lp.title,
    description: lp.sub,
    // Ad landing pages must never compete with the organic pages they mirror.
    robots: { index: false, follow: true },
  };
}

/**
 * A paid landing page: logo, phone, form, trust signals. No navigation, no
 * footer links, no way out other than converting or leaving. Every element
 * that isn't the offer or the form has been removed on purpose.
 */
export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;

  const lp = landingBySlug(lang, slug);
  if (!lp) notFound();

  const t = getCopy(lang);
  const faq = faqByIds(lang, lp.faq);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo and phone only — no nav. */}
      <header className="border-b border-slate-200">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Image
            src="/logo-autob2.png"
            alt={siteConfig.name}
            width={600}
            height={214}
            sizes="101px"
            loading="eager"
            className="h-8 w-auto sm:h-9"
          />
          <PhoneLink
            source={`lp_${slug}_header`}
            showIcon
            labelClassName="sr-only sm:not-sr-only"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-black tabular-nums text-white transition-colors hover:bg-brand-700 sm:px-4 sm:text-base"
          />
        </div>
      </header>

      <main id="main" className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-brand-50 to-white"
        />
        {/*
          A radial gradient, not a blurred circle. `blur-3xl` on a 34rem
          element is a very expensive paint, and this is the page paid traffic
          lands on — the one place where a wasted frame costs money.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[34rem] [background:radial-gradient(60rem_28rem_at_15%_0%,var(--brand-100),transparent_70%)]"
        />

        <div className="container mx-auto px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              {/*
                No eyebrow above the H1. It carried the price range, which was
                removed on request — and with the beats sitting directly under
                the headline there is nothing for a badge to do but push the
                form further down the phone screen.
              */}
              <h1 className="text-[2.1rem] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-[2.75rem]">
                {lp.h1}
              </h1>

              {/*
                The homepage hero's beats treatment, not a variant of it: the
                dot is a separator between beats, so the first one does not get
                one — a leading dot turns a rhythm into a bullet list.

                `lp.sub` is deliberately not rendered. It is the meta and og
                description, which is what shows when someone pastes the link
                into Messenger.
              */}
              <ul className="mt-6 flex max-w-xl flex-wrap items-center gap-x-3.5 gap-y-2 text-lg font-bold text-slate-800 sm:text-xl">
                {lp.beats.map((beat, index) => (
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
                Stacked and equal width, same as the homepage. WhatsApp leads:
                the form is already in this viewport, and someone standing next
                to a dead car would rather send a photo than describe it.
              */}
              <div className="mt-8 flex max-w-md flex-col gap-3">
                <WhatsAppLink
                  source={`lp_${slug}`}
                  label={t.home.whatsappCta}
                  prefill={t.home.whatsappPrefill}
                />
                <PhoneLink
                  source={`lp_${slug}_hero`}
                  showIcon
                  label={t.home.ctaSecondary}
                  className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                />
              </div>

              <ul className="mt-8 space-y-3">
                {lp.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-[15px] font-semibold text-slate-800"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" strokeWidth={3} />
                    {bullet}
                  </li>
                ))}
              </ul>

              <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
                {lp.reassurance}
              </p>
            </div>

            <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
              <QuoteForm lang={lang} source={`lp_${slug}`} />
            </div>
          </div>
        </div>

        {/*
          The homepage's treatment of the same asset: full width beneath the
          hero, intrinsic 1600x476 so the box is reserved and it cannot shift
          the page. It used to be a fixed-height crop under a mask, which is
          how a 3:2 photo was made to behave like a banner — unnecessary now
          that the banner is the actual image.
        */}
        <div className="container mx-auto px-4 pb-14 sm:px-6 sm:pb-16">
          <Image
            src="/tow-truck-hero.webp"
            alt={
              lang === "fr"
                ? "Remorqueuse à plateau d'Autos B2 chargée d'un véhicule, à Mascouche"
                : "Autos B2 flatbed tow truck loaded with a vehicle, in Mascouche"
            }
            width={1600}
            height={476}
            loading="lazy"
            sizes="(min-width: 1088px) 1024px, 100vw"
            quality={72}
            className="mx-auto h-auto w-full max-w-5xl"
          />
        </div>

        {/*
          Below the photograph, not above it. The truck is the proof and the
          figures are its caption — set above, they read as a header for the
          form that came before them.
        */}
        <div className="container mx-auto px-4 pb-14 sm:px-6 sm:pb-16">
          <StatBand lang={lang} />
        </div>

        {/*
          The three steps, the same component the homepage renders. A landing
          page that asks a stranger to start a process it has never described
          is asking for the call it does not get.
        */}
        <HowItWorks lang={lang} compact />

        {/*
          Everything from here down is for the visitor who scrolled past the
          form without using it — someone not yet convinced, not someone who
          missed the button. Each section answers a doubt: are these people
          real (the photographs), what happens with the paperwork and the
          money (the FAQ), and then one more way to act without scrolling
          back up. None of it links anywhere else on the site.
        */}
        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="max-w-3xl text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
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

        {/*
          The homepage's FAQ markup, without the "see all questions" link —
          that is a way off the page. No FAQPage JSON-LD either: the page is
          noindex, so there is no result for it to enrich.
        */}
        <section className="bg-white py-14 sm:py-16">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
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
          </div>
        </section>

        {/*
          The hero's pair again, not the homepage's "get a quote" link: the
          quote page is somewhere else, and the form it leads to is already on
          this one.

          Not the homepage's closing headline either. "Your old car is worth
          money" is right for a junk car and wrong for one that was in a
          collision last week, and this section closes every landing page.
        */}
        <section className="bg-slate-950 py-14 sm:py-16">
          <div className="container mx-auto px-4 text-center sm:px-6">
            <h2 className="mx-auto max-w-3xl text-2xl font-black tracking-tight text-white sm:text-3xl">
              {lang === "fr"
                ? "Découvrez combien vaut votre véhicule"
                : "Find out what your vehicle is worth"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              {t.home.finalCta.sub}
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
              <WhatsAppLink
                source={`lp_${slug}_final`}
                label={t.home.whatsappCta}
                prefill={t.home.whatsappPrefill}
              />
              <PhoneLink
                source={`lp_${slug}_final`}
                showIcon
                label={t.home.ctaSecondary}
                className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-2 border-white/25 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              />
            </div>
          </div>
        </section>
      </main>

      {/*
        Minimal footer: who we are and how to reach us, no links into the
        site. Google Ads scores landing pages partly on whether the business
        behind them is identifiable and contactable, so the name, address,
        hours and a working phone number all belong here. A service or city
        link does not — each one is an exit from a click that was paid for.
      */}
      <footer className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {fullAddress}
          </p>
          <p className="mt-1.5">
            {t.common.hoursLong} ·{" "}
            <PhoneLink
              source={`lp_${slug}_footer`}
              className="font-semibold tabular-nums text-slate-600 underline hover:text-slate-900"
            />
          </p>
          {/*
            The only links out of a landing page, and they are here because
            they have to be: this page collects a phone number, so the privacy
            policy and the terms it is collected under must be reachable.
          */}
          <p className="mt-2 flex justify-center gap-4">
            <Link
              href={pathFor("privacy", lang)}
              className="font-semibold text-slate-600 underline hover:text-slate-900"
            >
              {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
            </Link>
            <Link
              href={pathFor("terms", lang)}
              className="font-semibold text-slate-600 underline hover:text-slate-900"
            >
              {lang === "fr" ? "Conditions d'utilisation" : "Terms of use"}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
