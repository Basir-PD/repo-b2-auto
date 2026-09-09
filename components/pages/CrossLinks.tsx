import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type Lang, cityPathFor, pathFor } from "@/config/routes";
import { citiesFor } from "@/content/cities";
import { getCopy } from "@/content/copy";
import { SERVICES } from "@/content/services";

/**
 * The links between services and cities.
 *
 * Before this, the two were separate islands: a service page's only in-body
 * link went to the quote form, and a city page linked to nine other cities
 * and nothing else. Everything that connected them came from the global
 * footer, which carries far less weight and tells Google nothing about which
 * service belongs with which city.
 *
 * These are in-body, in context, and the anchor text names both halves —
 * "Remorquage gratuit à Laval" rather than "Laval" — because the anchor is
 * the signal.
 */

/** On a service page: the cities where that service is offered. */
export function CitiesForService({
  lang,
  serviceName,
}: {
  lang: Lang;
  serviceName: string;
}) {
  const t = getCopy(lang);
  const cities = citiesFor(lang);
  if (!cities.length) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {t.crossLinks.citiesForService}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{t.crossLinks.citiesLead}</p>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {cities.map((city) => (
            <li key={city.key}>
              <Link
                href={cityPathFor(city.slug[lang] as string, lang)}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-800 transition-colors hover:border-brand-600 hover:text-brand-700"
              >
                {/* Both halves in the anchor: the service and the city. */}
                <span>
                  {serviceName} {lang === "fr" ? "à" : "in"} {city.name}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** On a city page: the services offered in that city. */
export function ServicesForCity({ lang, cityName }: { lang: Lang; cityName: string }) {
  const t = getCopy(lang);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {t.crossLinks.servicesInCity} {cityName}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{t.crossLinks.servicesLead}</p>
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <li key={service.key}>
            <Link
              href={pathFor(service.key, lang)}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-800 transition-colors hover:border-brand-600 hover:text-brand-700"
            >
              <span>
                {service.serviceName[lang]} {lang === "fr" ? "à" : "in"} {cityName}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-brand-600" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
