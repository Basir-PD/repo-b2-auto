"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, AlertTriangle, Send, ShieldCheck, Loader2 } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { trackCall, trackQuoteSubmit } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "email" | "vehicle", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{10,20}$/;

export default function QuoteForm() {
  const { t, language } = useLanguage();

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Validate before we spend a round trip.
    const nextErrors: FieldErrors = {};
    if (!data.name?.trim()) nextErrors.name = t.quote.required;
    if (!data.phone?.trim()) nextErrors.phone = t.quote.required;
    else if (!PHONE_RE.test(data.phone.trim())) nextErrors.phone = t.quote.invalidPhone;
    if (!data.email?.trim()) nextErrors.email = t.quote.required;
    else if (!EMAIL_RE.test(data.email.trim())) nextErrors.email = t.quote.invalidEmail;
    if (!data.vehicle?.trim()) nextErrors.vehicle = t.quote.required;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale: language }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      trackQuoteSubmit("quote_form");
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error("[quote-form]", err);
      setStatus("error");
    }
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40";
  const fieldClass = (key: keyof FieldErrors) =>
    `${inputBase} ${errors[key] ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-brand-500"}`;

  return (
    <section
      id="quote"
      aria-labelledby="quote-heading"
      className="bg-slate-50 py-16 sm:py-20 lg:py-24"
    >

      <div className="container mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Pitch */}
          <div className="text-center lg:pt-6 lg:text-left">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t.quote.badge}
            </span>

            <h2
              id="quote-heading"
              className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
            >
              {t.quote.title}{" "}
              <span className="text-brand-600">{t.quote.titleHighlight}</span>
            </h2>

            <p className="speakable-summary mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0 sm:text-lg">
              {t.quote.subtitle}
            </p>

            <ul className="mx-auto mt-7 max-w-sm space-y-3 text-left lg:mx-0">
              {[t.hero.benefits.price, t.hero.benefits.towing, t.hero.benefits.paid].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-slate-700 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                  {benefit}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-slate-600">
              {language === "fr" ? "Vous préférez parler à quelqu'un ?" : "Rather talk to someone?"}{" "}
              <a
                href={siteConfig.phone.href}
                onClick={() => trackCall("quote_section")}
                className="font-black text-slate-900 underline decoration-brand-500 decoration-2 underline-offset-4 hover:text-brand-600"
              >
                {siteConfig.phone.display}
              </a>
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 md:p-8"
          >
            {status === "sent" ? (
              <div role="status" className="flex flex-col items-center py-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 sm:text-2xl">{t.quote.successTitle}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 sm:text-base">
                  {t.quote.successBody}{" "}
                  <a
                    href={siteConfig.phone.href}
                    onClick={() => trackCall("quote_success")}
                    className="font-black text-brand-600 hover:underline"
                  >
                    {siteConfig.phone.display}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-7 text-sm font-bold text-slate-500 underline underline-offset-4 hover:text-slate-800"
                >
                  {language === "fr" ? "Envoyer une autre demande" : "Send another request"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot — hidden from people, irresistible to bots. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label={t.quote.fields.name} error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder={t.quote.fields.namePlaceholder}
                      className={fieldClass("name")}
                      aria-invalid={Boolean(errors.name)}
                    />
                  </Field>

                  <Field id="phone" label={t.quote.fields.phone} error={errors.phone}>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      placeholder={t.quote.fields.phonePlaceholder}
                      className={fieldClass("phone")}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </Field>
                </div>

                <Field id="email" label={t.quote.fields.email} error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder={t.quote.fields.emailPlaceholder}
                    className={fieldClass("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="vehicle" label={t.quote.fields.vehicle} error={errors.vehicle}>
                    <input
                      id="vehicle"
                      name="vehicle"
                      type="text"
                      required
                      placeholder={t.quote.fields.vehiclePlaceholder}
                      className={fieldClass("vehicle")}
                      aria-invalid={Boolean(errors.vehicle)}
                    />
                  </Field>

                  <Field id="condition" label={t.quote.fields.condition}>
                    <select id="condition" name="condition" defaultValue="" className={`${inputBase} border-slate-200 focus:border-brand-500`}>
                      <option value="" disabled>
                        —
                      </option>
                      {t.quote.fields.conditionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field id="message" label={t.quote.fields.message} hint={t.quote.fields.optional}>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder={t.quote.fields.messagePlaceholder}
                    className={`${inputBase} resize-y border-slate-200 focus:border-brand-500`}
                  />
                </Field>

                {status === "error" && (
                  <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm leading-relaxed text-red-800">
                      <strong className="font-bold">{t.quote.errorTitle}</strong> {t.quote.errorBody}{" "}
                      <a
                        href={siteConfig.phone.href}
                        onClick={() => trackCall("quote_error")}
                        className="font-black underline"
                      >
                        {siteConfig.phone.display}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.quote.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {t.quote.submit}
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-slate-500">{t.quote.privacy}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
        {hint && <span className="ml-1.5 font-medium normal-case tracking-normal text-slate-400">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
