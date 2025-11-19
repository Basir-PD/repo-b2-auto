"use client";

import { Menu, Phone, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

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
    <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="glass-dark rounded-2xl px-6 h-20 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-green-900/20 relative z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-green-600 rounded-lg -skew-x-6 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-3 transition-transform duration-300">
              <span className="text-xl font-black text-white skew-x-6">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">B2 Auto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-bold uppercase tracking-wide text-slate-300 hover:text-green-400 transition-colors">
              {t.header.services}
            </Link>
            <Link href="#about" className="text-sm font-bold uppercase tracking-wide text-slate-300 hover:text-green-400 transition-colors">
              {t.header.about}
            </Link>
            <Link href="#faq" className="text-sm font-bold uppercase tracking-wide text-slate-300 hover:text-green-400 transition-colors">
              {t.header.faq}
            </Link>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-1.5 border border-white/10 transition-all text-xs font-bold text-white uppercase"
              >
                <span className={language === 'en' ? "text-green-400" : "text-slate-400"}>EN</span>
                <span className="text-slate-600">/</span>
                <span className={language === 'fr' ? "text-green-400" : "text-slate-400"}>FR</span>
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-slate-900 border border-white/10 rounded-lg shadow-xl overflow-hidden py-1">
                  <button 
                    onClick={() => { setLanguage('fr'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors ${language === 'fr' ? 'text-green-400' : 'text-slate-300'}`}
                  >
                    Français
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors ${language === 'en' ? 'text-green-400' : 'text-slate-300'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <a 
              href="tel:+15146232787" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-bold text-white group"
            >
              <Phone className="w-4 h-4 text-green-400 group-hover:animate-bounce" />
              <span>+1 (514) 623-2787</span>
            </a>
            <Link 
              href="#contact"
              className="hidden md:block skew-button px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-black uppercase tracking-wider -skew-x-6 shadow-lg shadow-green-900/50"
            >
              <span className="block skew-x-6">{t.header.getOffer}</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-green-400 transition-colors z-50 relative"
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
        <div className="flex flex-col h-full pt-32 px-8 pb-10">
          <div ref={menuItemsRef} className="flex flex-col gap-8 text-center">
            <Link 
              href="#services" 
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-black uppercase italic tracking-tighter text-white hover:text-green-500 transition-colors"
            >
              {t.header.services}
            </Link>
            <Link 
              href="#about" 
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-black uppercase italic tracking-tighter text-white hover:text-green-500 transition-colors"
            >
              {t.header.about}
            </Link>
            <Link 
              href="#faq" 
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-black uppercase italic tracking-tighter text-white hover:text-green-500 transition-colors"
            >
              {t.header.faq}
            </Link>

            <div className="w-full h-px bg-white/10 my-4" />

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setLanguage('en')}
                className={`text-lg font-bold ${language === 'en' ? 'text-green-400' : 'text-slate-500'}`}
              >
                EN
              </button>
              <span className="text-slate-700">/</span>
              <button 
                onClick={() => setLanguage('fr')}
                className={`text-lg font-bold ${language === 'fr' ? 'text-green-400' : 'text-slate-500'}`}
              >
                FR
              </button>
            </div>

            <a 
              href="tel:+15146232787" 
              className="flex items-center justify-center gap-3 text-xl font-bold text-white hover:text-green-400 transition-colors"
            >
              <Phone className="w-6 h-6" />
              <span>+1 (514) 623-2787</span>
            </a>

            <Link 
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 w-full py-4 bg-green-600 text-white font-black uppercase tracking-wider text-xl rounded-lg shadow-lg shadow-green-900/50"
            >
              {t.header.getOffer}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
