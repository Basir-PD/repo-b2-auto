import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { isLang, pathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress } from "@/config/site";
import { getCopy } from "@/content/copy";
import { LANDING_CONTENT, landingBySlug } from "@/content/landing";
import QuoteForm from "@/components/site/QuoteForm";
import PhoneLink from "@/components/site/PhoneLink";

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

  return (
    <div className="min-h-screen bg-white">
      {/* Logo and phone only — no nav. */}
      <header className="border-b border-slate-200">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <Image
            src="/logo-autob2.png"
            alt={siteConfig.name}
            width={289}
            height={109}
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
              <p className="inline-flex rounded-full bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white sm:text-sm">
                {lp.badge}
              </p>

              <h1 className="mt-6 text-[2.1rem] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-[2.75rem]">
                {lp.h1}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {lp.sub}
              </p>

              <PhoneLink
                source={`lp_${slug}_hero`}
                showIcon
                label={t.home.ctaSecondary}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-brand-900/15 transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:w-auto"
              />

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

        {/* The truck as the page's floor — same device as the main hero. */}
        <div className="relative h-[12rem] w-full sm:h-[16rem] lg:h-[19rem]">
          <Image
            src="/hero-tow-truck.jpg"
            alt={
              lang === "fr"
                ? "Remorqueuse à plateau d'Autos B2 chargée d'un véhicule, à Mascouche"
                : "Autos B2 flatbed tow truck loaded with a vehicle, in Mascouche"
            }
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={50}
            className="object-cover object-[58%_62%] [mask-image:linear-gradient(to_bottom,transparent,black_34%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_34%)]"
          />
        </div>
      </main>

      {/* Minimal footer: legally required identity, no links out. */}
      <footer className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {fullAddress} · {t.common.hoursLong}
          </p>
          {/*
            The only link out of a landing page, and it is here because it
            has to be: this page collects a phone number, so the privacy
            policy must be reachable from it.
          */}
          <p className="mt-2">
            <Link href={pathFor("privacy", lang)} className="font-semibold text-slate-600 underline hover:text-slate-900">
              {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
