"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site";
import { trackCall, trackQuoteSubmit } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "vehicle", string>>;

const PHONE_RE = /^[+()\d\s.-]{10,20}$/;

/**
 * The short form that sits in the hero.
 *
 * Three fields, no email: on a page whose job is generating phone calls,
 * every extra field costs leads, and a phone number is all we need to call
 * someone back. The longer form further down the page is still there for
 * anyone who wants to describe the car in detail.
 */
export default function HeroQuoteForm() {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const f = t.hero.heroForm;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const next: FieldErrors = {};
    if (!data.name?.trim()) next.name = f.required;
    if (!data.phone?.trim()) next.phone = f.required;
    else if (!PHONE_RE.test(data.phone.trim())) next.phone = f.invalidPhone;
    if (!data.vehicle?.trim()) next.vehicle = f.required;

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
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
      trackQuoteSubmit("hero_form");
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error("[hero-quote-form]", err);
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-lg border bg-white px-4 py-3 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40";
  const fieldClass = (key: keyof FieldErrors) =>
    `${input} ${errors[key] ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-brand-500"}`;

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <CheckCircle2 className="h-8 w-8 text-brand-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900">{f.successTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {f.successBody}{" "}
          <a
            href={siteConfig.phone.href}
            onClick={() => trackCall("hero_form_success")}
            className="font-black text-brand-600 hover:underline"
          >
            {siteConfig.phone.display}
          </a>
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-bold text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          {f.another}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{f.title}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{f.subtitle}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3.5">
        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="hero-company">Company</label>
          <input id="hero-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Field id="hero-name" label={f.name} error={errors.name}>
          <input
            id="hero-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={f.namePlaceholder}
            className={fieldClass("name")}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field id="hero-phone" label={f.phone} error={errors.phone}>
          <input
            id="hero-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={f.phonePlaceholder}
            className={fieldClass("phone")}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field id="hero-vehicle" label={f.vehicle} error={errors.vehicle}>
          <input
            id="hero-vehicle"
            name="vehicle"
            type="text"
            required
            placeholder={f.vehiclePlaceholder}
            className={fieldClass("vehicle")}
            aria-invalid={Boolean(errors.vehicle)}
          />
        </Field>

        {status === "error" && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {f.errorBody}{" "}
            <a
              href={siteConfig.phone.href}
              onClick={() => trackCall("hero_form_error")}
              className="font-black underline"
            >
              {siteConfig.phone.display}
            </a>
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === "sending" ? f.submitting : f.submit}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-500">{f.privacy}</p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
