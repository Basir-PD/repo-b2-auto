"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import { trackCall, trackQuoteStart } from "@/lib/analytics";
import PhoneBadge from "@/components/PhoneBadge";

const NAV = ["services", "about", "faq"] as const;
const LANG_LABEL: Record<"en" | "fr", string> = { en: "English", fr: "Français" };

function LanguageDropdown({
  language,
  setLanguage,
  ariaLabel,
  className = "",
}: {
  language: "en" | "fr";
  setLanguage: (lang: "en" | "fr") => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase text-slate-700 transition-colors hover:bg-slate-200"
      >
        {language}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm font-semibold shadow-lg"
        >
          {(["fr", "en"] as const).map((lang) => (
            <li key={lang}>
              <button
                type="button"
                role="option"
                aria-selected={language === lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3.5 py-2 text-left transition-colors ${
                  language === lang ? "bg-slate-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {LANG_LABEL[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the open menu. The slide itself is a CSS
  // transition — an animation library isn't worth the download on a
  // page whose whole job is loading fast enough to earn the call.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close on Escape — expected of any full-screen overlay.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const navLinks = NAV.map((key) => ({ href: `#${key}`, label: t.header[key] }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200 ${
        isScrolled ? "shadow-sm ring-1 ring-slate-900/5" : "border-b border-slate-100"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-5 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${siteConfig.name} — ${siteConfig.address.locality}`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600">
            <span className="text-lg font-black text-white">B</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">B2 Autos</span>
            <span className="mt-1 hidden text-[10px] font-medium text-slate-500 sm:block">
              {siteConfig.address.locality}, {siteConfig.address.region}
            </span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-bold uppercase tracking-wide text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: language · phone · one CTA */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <LanguageDropdown
            language={language}
            setLanguage={setLanguage}
            ariaLabel={t.header.languageAria}
            className="hidden sm:block"
          />

          <a
            href={siteConfig.phone.href}
            onClick={() => trackCall("header")}
            aria-label={t.header.callAria}
            className="group flex items-center gap-2.5"
          >
            <PhoneBadge className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="hidden flex-col leading-none md:flex">
              <span className="whitespace-nowrap text-base font-black tabular-nums tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 lg:text-lg">
                {siteConfig.phone.display}
              </span>
              <span className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-500">
                {t.header.phoneTagline}
              </span>
            </span>
          </a>

          <Link
            href="#quote"
            onClick={() => trackQuoteStart("header")}
            className="hidden rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-700 md:inline-flex"
          >
            {t.header.getQuote}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative z-50 -mr-2 p-2 text-slate-900 lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`fixed inset-0 z-40 overflow-y-auto bg-white transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col px-6 pb-28 pt-24">
          <nav className="flex flex-col divide-y divide-slate-100" aria-label="Mobile">
            {[...navLinks, { href: "#contact", label: t.footer.contactUs }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-4 text-xl font-bold uppercase tracking-wide text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <LanguageDropdown language={language} setLanguage={setLanguage} ariaLabel={t.header.languageAria} />
          </div>

          <a
            href={siteConfig.phone.href}
            onClick={() => trackCall("mobile_menu")}
            className="mt-8 flex items-center gap-3"
          >
            <PhoneBadge className="h-11 w-11" />
            <span className="flex flex-col leading-none">
              <span className="text-xl font-black tabular-nums text-slate-900">{siteConfig.phone.display}</span>
              <span className="mt-1.5 text-xs font-medium text-slate-500">{t.header.phoneTagline}</span>
            </span>
          </a>

          <Link
            href="#quote"
            onClick={() => { trackQuoteStart("mobile_menu"); setIsMenuOpen(false); }}
            className="mt-6 rounded-lg bg-brand-600 py-4 text-center text-base font-bold uppercase tracking-wide text-white"
          >
            {t.header.getQuote}
          </Link>
        </div>
      </div>
    </header>
  );
}
