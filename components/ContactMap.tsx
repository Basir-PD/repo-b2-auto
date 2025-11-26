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
    <section ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
            {t.contact?.title || "Visitez-nous"} <span className="text-green-600">{t.contact?.titleHighlight || "Aujourd'hui"}</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            {t.contact?.subtitle || "Nous sommes situés à Laval, Québec. Contactez-nous pour obtenir votre soumission gratuite!"}
          </p>
        </div>

        <div className="space-y-12">
          {/* Map - Centered and Larger */}
          <div ref={mapRef} className="w-[90vw] mx-auto">
            <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_10px_30px_-10px_rgba(34,197,94,0.2)] border-4 border-white bg-slate-100 relative group">
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
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent pointer-events-none" />
            </div>

            {/* Floating location badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-90">Location</p>
                  <p className="text-sm font-black">Laval, QC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Cards - 3 Column Grid */}
          <div ref={infoRef} className="grid md:grid-cols-3 gap-6 mt-16">
            {/* Phone */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {t.contact?.phoneTitle || "Appelez-nous"}
                  </h3>
                  <a 
                    href="tel:+15146232787" 
                    className="text-xl font-black text-green-600 hover:text-green-700 transition-colors block"
                  >
                    +1 (514) 623-2787
                  </a>
                  <p className="text-slate-600 font-medium mt-2 text-sm">
                    {t.contact?.phoneDesc || "Disponible 7 jours sur 7"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {t.contact?.emailTitle || "Écrivez-nous"}
                  </h3>
                  <a 
                    href="mailto:info@b2auto.com" 
                    className="text-lg font-bold text-green-600 hover:text-green-700 transition-colors block break-all"
                  >
                    info@b2auto.com
                  </a>
                  <p className="text-slate-600 font-medium mt-2 text-sm">
                    {t.contact?.emailDesc || "Réponse rapide garantie"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="w-full">
                  <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">
                    {t.contact?.hoursTitle || "Heures d'ouverture"}
                  </h3>
                  <div className="space-y-2 text-sm">
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
