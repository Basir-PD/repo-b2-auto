"use client";

import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MapPin, Mail, Clock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactMap() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(mapRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(infoRef.current?.children || [], {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      x: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-3 sm:mb-4">
            {t.contact?.title || "Visitez-nous"} <span className="text-indigo-600">{t.contact?.titleHighlight || "Aujourd'hui"}</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto px-2">
            {t.contact?.subtitle || "Nous sommes situés à Laval, Québec. Contactez-nous pour obtenir votre soumission gratuite!"}
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* Map - Centered and Larger */}
          <div ref={mapRef} className="w-full max-w-6xl mx-auto relative">
            <div className="h-[50vh] sm:h-[55vh] md:h-auto md:aspect-[16/9] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_10px_30px_-10px_rgba(34,197,94,0.2)] border-2 sm:border-4 border-white bg-slate-100 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89425.35633423!2d-73.79847!3d45.60629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91f8abc7e0d7f%3A0x5040cadec2cc9c0!2sLaval%2C%20QC!5e0!3m2!1sen!2sca!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none" />
            </div>

            {/* Floating location badge */}
            <div className="absolute -bottom-4 sm:-bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <div>
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-90">Location</p>
                  <p className="text-[11px] sm:text-xs md:text-sm font-black">Laval, QC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Cards - 3 Column Grid */}
          <div ref={infoRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-12">
            {/* Phone */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                <div className="bg-indigo-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                    {t.contact?.phoneTitle || "Appelez-nous"}
                  </h3>
                  <a
                    href="tel:+15146232787"
                    className="text-lg sm:text-xl font-black text-indigo-600 hover:text-indigo-700 transition-colors block"
                  >
                    +1 (514) 623-2787
                  </a>
                  <p className="text-slate-600 font-medium mt-1.5 sm:mt-2 text-xs sm:text-sm">
                    {t.contact?.phoneDesc || "Disponible 7 jours sur 7"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                <div className="bg-indigo-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                    {t.contact?.emailTitle || "Écrivez-nous"}
                  </h3>
                  <a
                    href="mailto:info@b2auto.com"
                    className="text-base sm:text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors block break-all"
                  >
                    info@b2auto.com
                  </a>
                  <p className="text-slate-600 font-medium mt-1.5 sm:mt-2 text-xs sm:text-sm">
                    {t.contact?.emailDesc || "Réponse rapide garantie"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 sm:col-span-2 md:col-span-1">
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                <div className="bg-indigo-50 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={1.5} />
                </div>
                <div className="w-full">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
                    {t.contact?.hoursTitle || "Heures d'ouverture"}
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">{t.footer.days.week}</span>
                      <span className="text-slate-600 font-medium">8AM-8PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">{t.footer.days.sat}</span>
                      <span className="text-slate-600 font-medium">9AM-5PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">{t.footer.days.sun}</span>
                      <span className="text-slate-600 font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
