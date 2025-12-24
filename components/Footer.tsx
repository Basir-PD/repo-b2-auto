"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 py-10 sm:py-12 md:py-16 border-t border-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg -skew-x-6 flex items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-white skew-x-6">B</span>
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase italic">B2 Auto</span>
            </div>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
              {t.footer.description}
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <li><Link href="#services" className="text-sm sm:text-base hover:text-amber-400 transition-colors font-medium">Services</Link></li>
              <li><Link href="#about" className="text-sm sm:text-base hover:text-amber-400 transition-colors font-medium">{t.header.about}</Link></li>
              <li><Link href="#faq" className="text-sm sm:text-base hover:text-amber-400 transition-colors font-medium">FAQ</Link></li>
              <li><Link href="#contact" className="text-sm sm:text-base hover:text-amber-400 transition-colors font-medium">{t.footer.contactUs}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">{t.footer.contactUs}</h3>
            <ul className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-400 font-medium">+1 (514) 623-2787</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-400 font-medium break-all">info@b2auto.com</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-400 font-medium">Laval, QC</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">{t.footer.businessHours}</h3>
            <ul className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">{t.footer.days.week}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">8:00 AM - 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">{t.footer.days.sat}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">9:00 AM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">{t.footer.days.sun}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 sm:pt-8 text-center text-slate-500 text-xs sm:text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} B2 Auto. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
