"use client";

import { Menu, Phone, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .to(menuRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.inOut",
      })
      .from(menuItemsRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.3");
  }, { scope: menuRef });

  useGSAP(() => {
    if (isMenuOpen) {
      tl.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current?.reverse();
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-0' : 'py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8'}`}>
      <div className={isScrolled ? 'w-full' : 'container mx-auto max-w-5xl'}>
        <div className={`px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between transition-all duration-300 relative z-50 ${
          isScrolled
            ? 'h-14 sm:h-16 bg-white/90 backdrop-blur-md shadow-lg border-b border-white/40'
            : 'h-16 sm:h-18 md:h-20 glass-dark rounded-xl sm:rounded-2xl hover:scale-[1.01] hover:shadow-2xl hover:shadow-indigo-900/20'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`rounded-lg -skew-x-6 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-all duration-300 bg-indigo-600 ${
              isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'
            }`}>
              <span className={`font-black text-white skew-x-6 ${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>B</span>
            </div>
            <span className={`font-black tracking-tighter uppercase italic transition-all duration-300 ${
              isScrolled ? 'text-lg sm:text-xl text-slate-900' : 'text-xl sm:text-2xl text-white'
            }`}>B2 Auto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className={`text-sm font-bold uppercase tracking-wide transition-colors ${
              isScrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-300 hover:text-indigo-400'
            }`}>
              {t.header.services}
            </Link>
            <Link href="#about" className={`text-sm font-bold uppercase tracking-wide transition-colors ${
              isScrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-300 hover:text-indigo-400'
            }`}>
              {t.header.about}
            </Link>
            <Link href="#faq" className={`text-sm font-bold uppercase tracking-wide transition-colors ${
              isScrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-300 hover:text-indigo-400'
            }`}>
              {t.header.faq}
            </Link>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 border transition-all text-xs font-bold uppercase ${
                  isScrolled
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <span className={language === 'en' ? "text-indigo-600" : isScrolled ? "text-slate-400" : "text-slate-400"}>EN</span>
                <span className={isScrolled ? "text-slate-400" : "text-slate-600"}>/</span>
                <span className={language === 'fr' ? "text-indigo-600" : isScrolled ? "text-slate-400" : "text-slate-400"}>FR</span>
                <ChevronDown className={`w-3 h-3 ml-1 ${isScrolled ? 'text-slate-400' : 'text-slate-400'}`} />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-slate-900 border border-white/10 rounded-lg shadow-xl overflow-hidden py-1">
                  <button
                    onClick={() => { setLanguage('fr'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors ${language === 'fr' ? 'text-indigo-400' : 'text-slate-300'}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors ${language === 'en' ? 'text-indigo-400' : 'text-slate-300'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <a
              href="tel:+15146232787"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold group ${
                isScrolled
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              <Phone className="w-4 h-4 text-amber-500 group-hover:animate-bounce" />
              <span>+1 (514) 623-2787</span>
            </a>
            <Link
              href="#contact"
              className="hidden md:block skew-button px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-wider -skew-x-6 shadow-lg shadow-indigo-900/50"
            >
              <span className="block skew-x-6">{t.header.getOffer}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 transition-colors z-50 relative ${
                isScrolled ? 'text-slate-900 hover:text-indigo-600' : 'text-white hover:text-indigo-400'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-slate-950 z-40 translate-x-full md:hidden"
      >
        <div className="flex flex-col h-full pt-20 sm:pt-24 px-6 sm:px-8 pb-8 sm:pb-10">
          <div ref={menuItemsRef} className="flex flex-col gap-5 sm:gap-6 text-center">
            <Link
              href="#services"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-white hover:text-indigo-400 transition-colors"
            >
              {t.header.services}
            </Link>
            <Link
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-white hover:text-indigo-400 transition-colors"
            >
              {t.header.about}
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-white hover:text-indigo-400 transition-colors"
            >
              {t.header.faq}
            </Link>

            <div className="w-full h-px bg-white/10 my-2 sm:my-4" />

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLanguage('en')}
                className={`text-base sm:text-lg font-bold ${language === 'en' ? 'text-indigo-400' : 'text-slate-500'}`}
              >
                EN
              </button>
              <span className="text-slate-700">/</span>
              <button
                onClick={() => setLanguage('fr')}
                className={`text-base sm:text-lg font-bold ${language === 'fr' ? 'text-indigo-400' : 'text-slate-500'}`}
              >
                FR
              </button>
            </div>

            <a
              href="tel:+15146232787"
              className="flex items-center justify-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold text-white hover:text-amber-400 transition-colors"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>+1 (514) 623-2787</span>
            </a>

            <Link
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 sm:mt-4 w-full py-3 sm:py-4 bg-indigo-600 text-white font-black uppercase tracking-wider text-base sm:text-xl rounded-lg shadow-lg shadow-indigo-900/50"
            >
              {t.header.getOffer}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
