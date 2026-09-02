import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { isLang, type Lang } from "@/config/routes";
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
    <div className="min-h-screen bg-slate-950">
      {/* Logo and phone only — no nav. */}
      <header className="border-b border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-lg font-black text-white">
              B
            </span>
            <span className="text-lg font-black tracking-tight text-white sm:text-xl">
              {siteConfig.name}
            </span>
          </div>
          <PhoneLink
            source={`lp_${slug}_header`}
            showIcon
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2.5 text-sm font-black tabular-nums text-white sm:px-4 sm:text-base"
          />
        </div>
      </header>

      <main id="main" className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[18rem] lg:bottom-0 lg:h-auto">
          <Image
            src="/hero-tow-truck.jpg"
            alt={
              lang === "fr"
                ? "Remorqueuse à plateau de B2 Autos chargée d'un véhicule, à Mascouche"
                : "B2 Autos flatbed tow truck loaded with a vehicle, in Mascouche"
            }
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/75 to-slate-950 lg:bg-gradient-to-r lg:from-slate-950 lg:from-35% lg:via-slate-950/85 lg:to-slate-950/20"
          />
        </div>

        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="inline-flex rounded-full bg-brand-600 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white sm:text-sm">
                {lp.badge}
              </p>

              <h1 className="mt-6 text-[2.1rem] font-black leading-[1.08] tracking-tight text-white sm:text-[2.75rem]">
                {lp.h1}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {lp.sub}
              </p>

              <PhoneLink
                source={`lp_${slug}_hero`}
                showIcon
                label={t.home.ctaSecondary}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-brand-600 px-6 py-4 text-lg font-black text-white shadow-lg transition-colors hover:bg-brand-500 sm:w-auto"
              />

              <ul className="mt-8 space-y-3">
                {lp.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-[15px] font-semibold text-white">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" strokeWidth={3} />
                    {bullet}
                  </li>
                ))}
              </ul>

              <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-slate-400">
                {lp.reassurance}
              </p>
            </div>

            <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
              <QuoteForm lang={lang} source={`lp_${slug}`} />
            </div>
          </div>
        </div>
      </main>

      {/* Minimal footer: legally required identity, no links out. */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-xs text-slate-400 sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {fullAddress} · {t.common.hoursLong}
          </p>
        </div>
      </footer>
    </div>
  );
}
