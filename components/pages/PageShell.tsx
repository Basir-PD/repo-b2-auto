import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Check } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor } from "@/config/routes";
import { getCopy } from "@/content/copy";
import type { Section } from "@/content/services";
import PhoneLink from "@/components/site/PhoneLink";
import WhatsAppLink from "@/components/site/WhatsAppLink";

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
 * few hundred pixels further down. The pages that take it are the ones in
 * the header nav — the four services, about and the FAQ — where a reader has
 * arrived with a question and the answer to most of them is a phone call.
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
              <WhatsAppLink
                source="page_header"
                label={t.home.whatsappCta}
                prefill={t.home.whatsappPrefill}
              />
              <PhoneLink
                source="page_header"
                showIcon
                label={t.home.ctaSecondary}
                className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              />
            </div>

            {/*
              Intrinsic 1600x476 so the box is reserved before the file
              arrives. Lazy and unprioritised: the H1 above is the LCP element
              on every viewport, and preloading this only competes with it.
            */}
            <Image
              src="/tow-truck-hero.webp"
              alt=""
              width={1600}
              height={476}
              loading="lazy"
              sizes="(min-width: 896px) 832px, 100vw"
              quality={72}
              className="mt-8 h-auto w-full"
            />
          </>
        )}
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
          <Link
            href={pathFor("quote", lang)}
            className="rounded-xl bg-brand-600 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-brand-500"
          >
            {t.home.ctaPrimary}
          </Link>
          <PhoneLink
            source="cta_band"
            showIcon
            label={t.home.ctaSecondary}
            className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-white/25 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10"
          />
        </div>
      </div>
    </section>
  );
}
