"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Phone, MapPin, Mail, Clock, ExternalLink, MessageCircle } from "lucide-react";
import { siteConfig, mapsUrl, mapsEmbedUrl } from "@/lib/site";
import { trackCall, trackEvent } from "@/lib/analytics";

export default function ContactMap() {
  const { t } = useLanguage();


  return (
    <section
     
      id="location"
      aria-labelledby="contact-heading"
      className="bg-slate-50 py-16 sm:py-20 lg:py-24"
    >

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2
            id="contact-heading"
            className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
          >
            {t.contact.title} <span className="text-brand-600">{t.contact.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {/* Real, interactive map of the actual yard. */}
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <iframe
                src={mapsEmbedUrl}
                title={t.contact.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[45vh] w-full border-0 sm:h-[50vh] md:aspect-[16/9] md:h-auto"
              />
            </div>

            {/* Address pill */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_directions", { source: "map" })}
              className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-brand-600 px-6 py-3 text-white transition-colors hover:bg-brand-700"
            >
              <MapPin className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <span className="text-left">
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-90 sm:text-[10px] md:text-xs">
                  {t.contact.addressTitle}
                </span>
                <span className="block whitespace-nowrap text-[11px] font-black sm:text-xs md:text-sm">
                  {siteConfig.address.street}, {siteConfig.address.locality}
                </span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" />
            </a>
          </div>

          {/* Contact cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-4">
            <ContactCard icon={Phone} title={t.contact.phoneTitle} note={t.contact.phoneDesc}>
              <a
                href={siteConfig.phone.href}
                onClick={() => trackCall("contact_card")}
                className="block text-lg font-black text-brand-600 transition-colors hover:text-brand-700 sm:text-xl"
              >
                {siteConfig.phone.display}
              </a>
            </ContactCard>

            <ContactCard icon={MessageCircle} title={t.header.whatsapp} note={t.header.whatsappTagline}>
              <a
                href={siteConfig.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_whatsapp", { source: "contact_card" })}
                className="block text-lg font-black text-brand-600 transition-colors hover:text-brand-700 sm:text-xl"
              >
                {siteConfig.phone.display}
              </a>
            </ContactCard>

            <ContactCard icon={Mail} title={t.contact.emailTitle} note={t.contact.emailDesc}>
              <a
                href={`mailto:${siteConfig.email}`}
                onClick={() => trackEvent("click_email", { source: "contact_card" })}
                className="block break-all text-base font-bold text-brand-600 transition-colors hover:text-brand-700 sm:text-lg"
              >
                {siteConfig.email}
              </a>
            </ContactCard>

            <ContactCard icon={MapPin} title={t.contact.addressTitle}>
              {/* Marked up as a postal address so crawlers and AI agents parse the NAP. */}
              <address className="not-italic text-sm font-semibold leading-relaxed text-slate-700">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.locality}, {siteConfig.address.region} {siteConfig.address.postalCode}
              </address>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_directions", { source: "contact_card" })}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                {t.contact.directions}
                <ExternalLink className="h-3 w-3" />
              </a>
            </ContactCard>
          </div>

          {/* Hours + service areas */}
          <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                  <Clock className="h-5 w-5 text-brand-600" strokeWidth={1.75} />
                </span>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">{t.contact.hoursTitle}</h3>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  [t.footer.days.week, "8:00 – 20:00"],
                  [t.footer.days.sat, "9:00 – 17:00"],
                  [t.footer.days.sun, t.footer.closed],
                ].map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                    <dt className="font-bold text-slate-700">{day}</dt>
                    <dd className="font-medium text-slate-600">{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                  <MapPin className="h-5 w-5 text-brand-600" strokeWidth={1.75} />
                </span>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">{t.footer.serviceAreas}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {siteConfig.serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  title,
  note,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 text-center">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
          <Icon className="h-6 w-6 text-brand-600 sm:h-7 sm:w-7" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:text-lg">{title}</h3>
          {children}
          {note && <p className="mt-1.5 text-xs font-medium text-slate-600 sm:text-sm">{note}</p>}
        </div>
      </div>
    </div>
  );
}
