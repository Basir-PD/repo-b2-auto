"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig, fullAddress, mapsUrl } from "@/lib/site";
import { trackCall, trackEvent } from "@/lib/analytics";

export default function Footer() {
  const { t } = useLanguage();
  const socials = [
    { href: siteConfig.social.facebook, Icon: Facebook, label: "Facebook" },
    { href: siteConfig.social.instagram, Icon: Instagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer id="contact" className="border-t border-slate-900 bg-slate-950 pb-24 pt-10 text-slate-300 md:pb-12 md:pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Closing call-to-action */}
        <div className="mb-10 flex flex-col items-center gap-5 rounded-xl border border-slate-800 bg-slate-900 p-6 text-center sm:mb-12 sm:flex-row sm:justify-between sm:p-8 sm:text-left">
          <div>
            <p className="text-lg font-black tracking-tight text-white sm:text-xl">
              {t.faq.ctaTitle}
            </p>
            <p className="mt-1 text-sm text-slate-400">{t.header.phoneTagline}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={siteConfig.phone.href}
              onClick={() => trackCall("footer_cta")}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-bold tabular-nums text-white transition-colors hover:bg-brand-700"
            >
              <Phone className="h-5 w-5" strokeWidth={2.5} />
              {siteConfig.phone.display}
            </a>
            <a
              href={siteConfig.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_whatsapp", { source: "footer" })}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-slate-900"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
              {t.header.whatsapp}
            </a>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 sm:mb-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Brand + NAP */}
          <div className="space-y-4 sm:col-span-2 sm:space-y-5 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 -skew-x-6 items-center justify-center rounded-lg bg-brand-600 sm:h-10 sm:w-10">
                <span className="skew-x-6 text-lg font-black text-white sm:text-xl">B</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                B2 Autos
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
              {t.footer.description}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3 sm:gap-4">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:text-white sm:h-10 sm:w-10"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer">
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-white sm:mb-5 sm:text-lg">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { href: "#services", label: t.header.services },
                { href: "#about", label: t.header.about },
                { href: "#quote", label: t.header.getQuote },
                { href: "#faq", label: t.header.faq },
                { href: "#location", label: t.contact.addressTitle },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-brand-400 sm:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — the NAP block search engines read */}
          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-white sm:mb-5 sm:text-lg">
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 sm:mt-1 sm:h-5 sm:w-5" />
                <a
                  href={siteConfig.phone.href}
                  onClick={() => trackCall("footer")}
                  className="text-sm font-medium text-slate-400 hover:text-white sm:text-base"
                >
                  {siteConfig.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 sm:mt-1 sm:h-5 sm:w-5" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-sm font-medium text-slate-400 hover:text-white sm:text-base"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 sm:mt-1 sm:h-5 sm:w-5" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <address className="text-sm font-medium not-italic leading-relaxed text-slate-400 sm:text-base">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.locality}, {siteConfig.address.region} {siteConfig.address.postalCode}
                  </address>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-white sm:mb-5 sm:text-lg">
              {t.footer.businessHours}
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {[
                [t.footer.days.week, "8:00 – 20:00"],
                [t.footer.days.sat, "9:00 – 17:00"],
                [t.footer.days.sun, t.footer.closed],
              ].map(([day, hours]) => (
                <li key={day} className="flex items-start gap-2 sm:gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 sm:mt-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-sm font-medium text-white sm:text-base">{day}</p>
                    <p className="text-xs text-slate-500 sm:text-sm">{hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service areas — a real internal keyword surface for local search */}
        <div className="border-t border-slate-900 pt-6 sm:pt-8">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.footer.serviceAreas}
          </h3>
          <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
            {siteConfig.serviceAreas.join(" · ")}
          </p>
        </div>

        <div className="mt-6 border-t border-slate-900 pb-24 pt-6 text-center text-xs font-medium text-slate-500 sm:text-sm md:pb-0">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName} — {fullAddress}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
