import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Phone, Mail, ChevronRight, Check } from "lucide-react";

import {
  LANGS, ROUTES, isLang, pathFor, cityPathFor, resolveSlug, alternatesFor, type Lang, type PageKey,
} from "@/config/routes";
import { siteConfig, fullAddress, mapsEmbedUrl, routeEmbedUrl } from "@/config/site";
import { getCopy } from "@/content/copy";
import { faqFor } from "@/content/faq";
import { CITIES, cityByKey, citiesFor } from "@/content/cities";
import { serviceByKey } from "@/content/services";
import { ABOUT, PRIVACY, TERMS, CONTACT } from "@/content/pages";
import { postsFor } from "@/content/blog";
import { PHOTOS } from "@/content/photos";
import QuoteForm from "@/components/site/QuoteForm";
import PhotoGrid from "@/components/site/PhotoGrid";
import PhoneLink from "@/components/site/PhoneLink";
import MailLink from "@/components/site/MailLink";
import { PageHeader, Sections, CtaBand } from "@/components/pages/PageShell";
import {
  JsonLd, breadcrumbSchema, faqSchema, serviceSchema, webPageSchema,
} from "@/components/site/JsonLd";

/** Every (lang, slug) pair that exists — this is what makes the site static. */
export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LANGS) {
    for (const key of Object.keys(ROUTES) as PageKey[]) {
      const slug = ROUTES[key][lang];
      if (slug) params.push({ lang, slug });
    }
    for (const city of CITIES) {
      const slug = city.slug[lang];
      if (slug) params.push({ lang, slug });
    }
  }
  return params;
}

type Meta = { title: string; description: string; noindex?: boolean };

function metaFor(lang: Lang, slug: string): Meta | null {
  const resolved = resolveSlug(lang, slug);
  if (!resolved) return null;
  const t = getCopy(lang);

  if (resolved.type === "city") {
    const city = cityByKey(resolved.cityKey)!;
    return lang === "fr"
      ? {
          title: `Cour à Scrap ${city.name} | Rachat Auto Comptant + Remorquage Gratuit`,
          description: `Vous vendez une auto scrap à ${city.name} ? Autos B2 achète comptant, remorquage gratuit, enlèvement souvent le jour même. Estimation gratuite : ${siteConfig.phone.display}.`,
        }
      : {
          title: `Scrap Car Buyer ${city.name} | Cash Paid + Free Towing`,
          description: `Selling a scrap car in ${city.name}? Autos B2 pays cash, free towing, pickup often the same day. Free quote: ${siteConfig.phone.display}.`,
        };
  }

  const service = serviceByKey(resolved.key);
  if (service) {
    return { title: service.metaTitle[lang], description: service.metaDescription[lang] };
  }

  switch (resolved.key) {
    case "quote":
      return {
        title: lang === "fr"
          ? "Estimation Gratuite pour Votre Auto Scrap | Autos B2"
          : "Free Quote for Your Scrap Car | Autos B2",
        description: lang === "fr"
          ? "Obtenez un prix ferme pour votre véhicule en moins d'une minute. Quatre questions, sans obligation, remorquage gratuit inclus."
          : "Get a firm price for your vehicle in under a minute. Four questions, no obligation, free towing included.",
      };
    case "thanks":
      // Reachable only after a submit, and never indexed.
      return { title: t.thanks.metaTitle, description: t.thanks.metaDescription, noindex: true };
    case "about":
      return { title: ABOUT.metaTitle[lang], description: ABOUT.metaDescription[lang] };
    case "privacy":
      return { title: PRIVACY.metaTitle[lang], description: PRIVACY.metaDescription[lang] };
    case "terms":
      return { title: TERMS.metaTitle[lang], description: TERMS.metaDescription[lang] };
    case "contact":
      return { title: CONTACT.metaTitle[lang], description: CONTACT.metaDescription[lang] };
    case "faq":
      return {
        title: lang === "fr"
          ? "Questions Fréquentes sur le Rachat d'Auto Scrap | Autos B2"
          : "Frequently Asked Questions About Scrap Car Buying | Autos B2",
        description: lang === "fr"
          ? "Valeur d'une auto scrap, remorquage gratuit, documents SAAQ, délais et paiement comptant : les réponses aux questions qu'on nous pose le plus."
          : "What a scrap car is worth, free towing, SAAQ documents, timing and cash payment: answers to what we're asked most.",
      };
    case "blog":
      return {
        title: lang === "fr"
          ? "Blogue | Vendre son auto scrap au Québec — Autos B2"
          : "Blog | Selling your scrap car in Quebec — Autos B2",
        description: lang === "fr"
          ? "Guides pratiques sur la valeur d'une auto scrap, la cession SAAQ, les pertes totales et la vente d'un véhicule en fin de vie au Québec."
          : "Practical guides on what a scrap car is worth, SAAQ transfers, write-offs and selling an end-of-life vehicle in Quebec.",
      };
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) return {};
  const meta = metaFor(raw, slug);
  if (!meta) return {};

  const resolved = resolveSlug(raw, slug)!;
  const alternates = alternatesFor(resolved);
  const languages: Record<string, string> = {};
  if (alternates.fr) languages["fr-CA"] = `${siteConfig.url}${alternates.fr}`;
  if (alternates.en) languages["en-CA"] = `${siteConfig.url}${alternates.en}`;
  // x-default always points at French — it is the primary language here.
  if (alternates.fr) languages["x-default"] = `${siteConfig.url}${alternates.fr}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${siteConfig.url}/${raw}/${slug}/`, languages },
    ...(meta.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: raw === "fr" ? "fr_CA" : "en_CA",
      url: `${siteConfig.url}/${raw}/${slug}/`,
      siteName: siteConfig.name,
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;

  const resolved = resolveSlug(lang, slug);
  if (!resolved) notFound();

  const t = getCopy(lang);
  const meta = metaFor(lang, slug)!;
  const path = `/${lang}/${slug}/`;

  const crumb = (name: string) => [{ name, path }];

  const common = (
    <>
      <JsonLd
        id="ld-webpage"
        data={webPageSchema({ lang, name: meta.title, description: meta.description, path })}
      />
    </>
  );

  /* ------------------------------------------------------------ City */
  if (resolved.type === "city") {
    const city = cityByKey(resolved.cityKey)!;
    const copy = city.copy[lang]!;
    const h1 =
      lang === "fr"
        ? `Rachat d'auto scrap à ${city.name} — argent comptant, remorquage gratuit`
        : `Cash for scrap cars in ${city.name} — free towing, paid on pickup`;

    const h2 = lang === "fr"
      ? {
          worth: `Combien vaut votre auto à ${city.name} ?`,
          towing: `Notre service de remorquage à ${city.name}`,
          vehicles: `Quels véhicules on achète à ${city.name}`,
          paperwork: "La paperasse SAAQ, expliquée simplement",
          faq: `Questions fréquentes — ${city.name}`,
          sectors: "Secteurs desservis",
          distance: `Distance depuis notre cour`,
        }
      : {
          worth: `What is your car worth in ${city.name}?`,
          towing: `Our towing service in ${city.name}`,
          vehicles: `What we buy in ${city.name}`,
          paperwork: "SAAQ paperwork, explained simply",
          faq: `Frequently asked questions — ${city.name}`,
          sectors: "Sectors we cover",
          distance: "Distance from our yard",
        };

    return (
      <>
        {common}
        <JsonLd id="ld-breadcrumb" data={breadcrumbSchema([{ name: t.common.breadcrumbHome, path: pathFor("home", lang) }, { name: city.name, path }])} />
        <JsonLd id="ld-city-faq" data={faqSchema([{ id: "city", q: copy.faqQ, a: copy.faqA }])} />

        <PageHeader lang={lang} trail={crumb(city.name)} h1={h1} lede={copy.lede} />

        <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-5">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {h2.distance}
              </dt>
              <dd className="mt-1.5 text-lg font-black text-slate-900">
                {city.distanceKm === 0
                  ? lang === "fr" ? "Sur place" : "On site"
                  : `${city.distanceKm} km`}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {lang === "fr" ? "Temps de route" : "Drive time"}
              </dt>
              <dd className="mt-1.5 text-lg font-black text-slate-900">
                ~{city.driveMinutes} min
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {lang === "fr" ? "Repère" : "Landmark"}
              </dt>
              <dd className="mt-1.5 text-[15px] font-bold leading-snug text-slate-900">
                {city.landmark}
              </dd>
            </div>
          </dl>

          <Section h2={h2.worth} body={copy.worth} />
          <Section h2={h2.towing} body={copy.towing} />

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">
            {h2.sectors}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {city.sectors.map((sector) => (
              <li
                key={sector}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700"
              >
                {sector}
              </li>
            ))}
          </ul>

          <Section h2={h2.vehicles} body={copy.vehicles} />
          <Section h2={h2.paperwork} body={copy.paperwork} />

          <section className="mt-10">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {h2.faq}
            </h2>
            <details className="group mt-5 border-y border-slate-200 py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-slate-900 marker:content-['']">
                {copy.faqQ}
                <ChevronRight className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{copy.faqA}</p>
            </details>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {lang === "fr" ? `De Mascouche à ${city.name}` : `From Mascouche to ${city.name}`}
            </h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <iframe
                src={routeEmbedUrl(city.name)}
                title={
                  lang === "fr"
                    ? `Trajet de notre cour de Mascouche jusqu'à ${city.name}`
                    : `Route from our Mascouche yard to ${city.name}`
                }
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0"
              />
            </div>
          </section>

          <div className="mt-12">
            <QuoteForm lang={lang} source={`city_${city.key}`} />
          </div>

          <nav className="mt-12" aria-label={t.nav.cities}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              {t.nav.cities}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {citiesFor(lang)
                .filter((c) => c.key !== city.key)
                .map((c) => (
                  <li key={c.key}>
                    <Link
                      href={cityPathFor(c.slug[lang]!, lang)}
                      className="inline-flex items-center gap-1 rounded-full border border-brand-600 px-3.5 py-1.5 text-sm font-bold text-brand-700 hover:bg-brand-50"
                    >
                      {c.name}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        <CtaBand lang={lang} />
      </>
    );
  }

  /* --------------------------------------------------------- Service */
  const service = serviceByKey(resolved.key);
  if (service) {
    return (
      <>
        {common}
        <JsonLd
          id="ld-service"
          data={serviceSchema({
            lang,
            name: service.serviceName[lang],
            description: service.metaDescription[lang],
            path,
          })}
        />
        <JsonLd id="ld-breadcrumb" data={breadcrumbSchema([{ name: t.common.breadcrumbHome, path: pathFor("home", lang) }, { name: service.serviceName[lang], path }])} />

        <PageHeader
          lang={lang}
          trail={crumb(service.serviceName[lang])}
          h1={service.h1[lang]}
          lede={service.lede[lang]}
        />
        <Sections sections={service.sections[lang]} />

        <div className="container mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:px-8">
          <QuoteForm lang={lang} source={`service_${service.key}`} />
        </div>

        <CtaBand lang={lang} />
      </>
    );
  }

  /* ------------------------------------------------ Everything else */
  switch (resolved.key) {
    case "quote":
      return (
        <>
          {common}
          <PageHeader
            lang={lang}
            trail={crumb(t.nav.quote)}
            h1={lang === "fr" ? "Estimation gratuite pour votre véhicule" : "Free quote for your vehicle"}
            lede={
              lang === "fr"
                ? "Quatre questions, moins d'une minute, aucune obligation. On vous rappelle avec un prix ferme."
                : "Four questions, under a minute, no obligation. We call you back with a firm price."
            }
          />
          <div className="container mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <QuoteForm lang={lang} source="quote_page" />
          </div>
          <CtaBand lang={lang} />
        </>
      );

    case "thanks":
      return (
        <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600">
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </span>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t.thanks.h1}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.thanks.body}
            </p>
            <p className="mt-6 text-sm font-semibold text-slate-700">{t.thanks.urgent}</p>
            <PhoneLink
              source="thanks"
              showIcon
              className="mt-3 inline-flex items-center gap-2.5 rounded-xl bg-brand-600 px-7 py-4 text-xl font-black tabular-nums text-white transition-colors hover:bg-brand-500"
            />
          </div>

          <h2 className="mt-12 text-xl font-black text-slate-900">{t.thanks.whatNext}</h2>
          <ol className="mt-4 space-y-3">
            {t.thanks.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-700">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <Link
            href={pathFor("home", lang)}
            className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
          >
            {t.thanks.backHome}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      );

    case "faq": {
      const items = faqFor(lang);
      return (
        <>
          {common}
          <JsonLd id="ld-faq" data={faqSchema(items)} />
          <JsonLd id="ld-breadcrumb" data={breadcrumbSchema([{ name: t.common.breadcrumbHome, path: pathFor("home", lang) }, { name: t.nav.faq, path }])} />

          <PageHeader
            lang={lang}
            trail={crumb(t.nav.faq)}
            h1={lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
            lede={
              lang === "fr"
                ? "Les réponses aux questions qu'on nous pose le plus souvent au téléphone."
                : "Answers to what we're asked most often on the phone."
            }
          />
          <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {items.map((item) => (
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
          <CtaBand lang={lang} />
        </>
      );
    }

    case "about":
      return (
        <>
          {common}
          <JsonLd id="ld-breadcrumb" data={breadcrumbSchema([{ name: t.common.breadcrumbHome, path: pathFor("home", lang) }, { name: t.nav.about, path }])} />
          <PageHeader lang={lang} trail={crumb(t.nav.about)} h1={ABOUT.h1[lang]} lede={ABOUT.lede[lang]} />
          <Sections sections={ABOUT.sections[lang]} />

          {/*
            This is the page someone opens when they are deciding whether we
            are a real yard or a broker with a phone number, so it gets the
            whole set rather than a sample.
          */}
          <div className="container mx-auto max-w-4xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {t.home.fleetTitle}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{t.home.fleetSub}</p>
            <div className="mt-8">
              <PhotoGrid lang={lang} photos={PHOTOS} columns={2} />
            </div>
          </div>

          <CtaBand lang={lang} />
        </>
      );

    case "privacy":
      return (
        <>
          {common}
          <PageHeader lang={lang} trail={crumb(PRIVACY.h1[lang])} h1={PRIVACY.h1[lang]} lede={PRIVACY.lede[lang]} />
          <Sections sections={PRIVACY.sections[lang]} />
        </>
      );

    case "terms":
      return (
        <>
          {common}
          <PageHeader lang={lang} trail={crumb(TERMS.h1[lang])} h1={TERMS.h1[lang]} lede={TERMS.lede[lang]} />
          <Sections sections={TERMS.sections[lang]} />
        </>
      );

    case "contact":
      return (
        <>
          {common}
          <JsonLd id="ld-breadcrumb" data={breadcrumbSchema([{ name: t.common.breadcrumbHome, path: pathFor("home", lang) }, { name: t.nav.contact, path }])} />
          <PageHeader lang={lang} trail={crumb(t.nav.contact)} h1={CONTACT.h1[lang]} lede={CONTACT.lede[lang]} />

          <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <dl className="space-y-6">
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        {t.common.phoneLabel}
                      </dt>
                      <dd className="mt-1">
                        <PhoneLink
                          source="contact_page"
                          className="text-xl font-black tabular-nums text-slate-900 hover:text-brand-600"
                        />
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        {t.common.emailLabel}
                      </dt>
                      <dd className="mt-1">
                        <MailLink source="contact_page" className="text-base font-semibold text-slate-900 hover:text-brand-600" />
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        {t.common.addressLabel}
                      </dt>
                      <dd className="mt-1 text-base font-semibold not-italic text-slate-900">
                        <address className="not-italic">{fullAddress}</address>
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        {lang === "fr" ? "Heures d'ouverture" : "Opening hours"}
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-slate-900">
                        {t.common.hoursLong}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
                  <iframe
                    src={mapsEmbedUrl}
                    title={
                      lang === "fr"
                        ? `Carte — ${siteConfig.name}, ${fullAddress}`
                        : `Map — ${siteConfig.name}, ${fullAddress}`
                    }
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[320px] w-full border-0"
                  />
                </div>
              </div>

              <QuoteForm lang={lang} source="contact_page" />
            </div>
          </div>
        </>
      );

    case "blog": {
      const posts = postsFor(lang);
      return (
        <>
          {common}
          <PageHeader
            lang={lang}
            trail={crumb(t.nav.blog)}
            h1={lang === "fr" ? "Blogue" : "Blog"}
            lede={
              lang === "fr"
                ? "Guides pratiques sur la valeur d'un véhicule en fin de vie, la cession SAAQ et la vente d'une auto scrap au Québec."
                : "Practical guides on what an end-of-life vehicle is worth, SAAQ transfers, and selling a scrap car in Quebec."
            }
          />
          <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            {posts.length === 0 ? (
              <p className="text-slate-600">
                {lang === "fr" ? "Aucun article pour l'instant." : "No articles yet."}
              </p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <li key={post.slug} className="py-6 first:pt-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(
                          lang === "fr" ? "fr-CA" : "en-CA",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                    </p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      <Link href={`${path}${post.slug}/`} className="hover:text-brand-700">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                      {post.description}
                    </p>
                    <Link
                      href={`${path}${post.slug}/`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
                    >
                      {t.common.readMore}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CtaBand lang={lang} />
        </>
      );
    }

    default:
      notFound();
  }
}

/** Local helper — a city block is always a heading plus one paragraph. */
function Section({ h2, body }: { h2: string; body: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{h2}</h2>
      <p className="mt-4 text-base leading-relaxed text-slate-700">{body}</p>
    </section>
  );
}
