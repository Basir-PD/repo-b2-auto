import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor, cityPathFor } from "@/config/routes";
import { siteConfig, fullAddress } from "@/config/site";
import { citiesFor } from "@/content/cities";
import { SERVICES } from "@/content/services";
import { getCopy } from "@/content/copy";
import PhoneLink from "@/components/site/PhoneLink";
import MailLink from "@/components/site/MailLink";

/**
 * No social icons: there are no accounts. An icon row linking to "#" is a dead
 * end for a visitor and a dead link for a crawler, so the row does not exist
 * rather than existing empty.
 */
export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getCopy(lang);
  const cities = citiesFor(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* NAP — must match the Google Business Profile character for character. */}
          <div>
            {/*
              A wordmark, not the logo image: the logo's navy sits at about
              1.3:1 against this footer and simply vanishes. A white knockout
              version would fix it — see README.
            */}
            <p className="text-xl font-black tracking-tight text-white">{siteConfig.name}</p>

            <address className="mt-5 space-y-3 not-italic text-sm leading-relaxed">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.locality}, {siteConfig.address.region}{" "}
                  {siteConfig.address.postalCode}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{t.common.hoursLong}</span>
              </p>
            </address>

            <div className="mt-5 space-y-2 text-sm">
              <PhoneLink
                source="footer"
                className="block font-black tabular-nums text-white hover:text-brand-400"
              />
              <MailLink source="footer" className="block hover:text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {t.nav.services}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((service) => (
                <li key={service.key}>
                  <Link href={pathFor(service.key, lang)} className="hover:text-white">
                    {service.serviceName[lang]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={pathFor("quote", lang)} className="hover:text-white">
                  {t.nav.quote}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {t.nav.cities}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {cities.map((city) => (
                <li key={city.key}>
                  <Link href={cityPathFor(city.slug[lang]!, lang)} className="hover:text-white">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              {siteConfig.name}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={pathFor("about", lang)} className="hover:text-white">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={pathFor("faq", lang)} className="hover:text-white">
                  {t.nav.faq}
                </Link>
              </li>
              <li>
                <Link href={pathFor("blog", lang)} className="hover:text-white">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href={pathFor("contact", lang)} className="hover:text-white">
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={pathFor("privacy", lang)} className="hover:text-white">
                  {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
                </Link>
              </li>
              <li>
                <Link href={pathFor("terms", lang)} className="hover:text-white">
                  {lang === "fr" ? "Conditions d'utilisation" : "Terms of use"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/*
          The legal links sit in the very last row rather than only in a
          column above. The quote form no longer links the policy inline, so
          this is the one place on every page that always reaches it.
        */}
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          {/* Dynamic — never a hardcoded year. */}
          <p>
            © {year} {siteConfig.name}. {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}{" "}
            {fullAddress}.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={pathFor("privacy", lang)} className="font-semibold text-white underline hover:text-brand-400">
              {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
            </Link>
            <Link href={pathFor("terms", lang)} className="hover:text-white">
              {lang === "fr" ? "Conditions d'utilisation" : "Terms of use"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
