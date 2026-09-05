"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Lang } from "@/config/routes";
import { pathFor } from "@/config/routes";
import { getCopy } from "@/content/copy";
import { pushEvent } from "@/lib/tracking";
import { fbqTrack } from "@/components/site/MetaPixel";
import { readAttribution } from "@/lib/attribution";
import PhoneLink from "@/components/site/PhoneLink";

/** Ten digits is a North American number; anything else is a typo. */
function digitsOf(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Progressive (514) 555-1234 formatting that never fights the caret. */
function formatPhone(value: string) {
  const d = digitsOf(value).replace(/^1/, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

function phoneIsValid(value: string) {
  return digitsOf(value).replace(/^1/, "").length === 10;
}

type Values = { vehicle: string; name: string; phone: string; postal: string; consent: boolean };

const EMPTY: Values = { vehicle: "", name: "", phone: "", postal: "", consent: false };

/**
 * The quote form. Four inputs, one step.
 *
 * Every field here earns its place: the vehicle is what a price is calculated
 * from, the phone is the only way to deliver that price, the name is what we
 * open the call with, and the postal code confirms the address is inside the
 * free-tow radius. Anything else — email, condition, paperwork, whether it
 * runs — is a question for the callback, where it costs nothing, instead of a
 * field on the page, where it costs leads.
 *
 * The consent checkbox is not a fifth input. Law 25 requires an explicit,
 * unchecked opt-in before we may phone or text someone, so it is a legal
 * control rather than a piece of data we are collecting.
 */
export default function QuoteForm({
  lang,
  /** Where this form instance lives — rides along on every event and the lead. */
  source = "quote_page",
  compact = false,
}: {
  lang: Lang;
  source?: string;
  compact?: boolean;
}) {
  const t = getCopy(lang).form;
  const router = useRouter();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<false | "error" | "throttled">(false);

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const partialSentRef = useRef(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    if (!startedRef.current) {
      startedRef.current = true;
      pushEvent("form_start", { source });
    }
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  /**
   * Partial capture.
   *
   * Someone who typed a valid phone number and then closed the tab is a lead
   * we can still call. sendBeacon survives the unload that a fetch would not.
   */
  useEffect(() => {
    function flushPartial() {
      if (submittedRef.current || partialSentRef.current) return;
      if (!phoneIsValid(values.phone)) return;
      partialSentRef.current = true;

      const payload = JSON.stringify({
        ...values,
        partial: true,
        locale: lang,
        source,
        attribution: readAttribution(),
      });
      try {
        navigator.sendBeacon?.("/api/quote/", new Blob([payload], { type: "application/json" }));
      } catch {
        // A lost partial is not worth throwing over.
      }
    }

    const onHidden = () => document.visibilityState === "hidden" && flushPartial();
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", flushPartial);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flushPartial);
    };
  }, [values, lang, source]);

  function validate() {
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.vehicle.trim()) next.vehicle = t.required;
    if (!values.name.trim()) next.name = t.required;
    if (!values.phone.trim()) next.phone = t.required;
    else if (!phoneIsValid(values.phone)) next.phone = t.invalidPhone;
    if (!values.postal.trim()) next.postal = t.required;
    if (!values.consent) next.consent = t.consentRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validate()) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: "", // honeypot, filled by bots only
          partial: false,
          locale: lang,
          source,
          attribution: readAttribution(),
        }),
      });
      if (res.status === 429) {
        // Not a failure of ours — say so, rather than "it didn't go through".
        setFailed("throttled");
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      submittedRef.current = true;
      pushEvent("generate_lead", { source, currency: "CAD", value: 1 });
      fbqTrack("Lead", { content_name: source, currency: "CAD" });
      // A real navigation, so the thank-you pageview fires a conversion in
      // both Google Ads and Meta rather than relying on an event alone.
      router.push(pathFor("thanks", lang));
    } catch (err) {
      console.error("[quote-form]", err);
      setFailed("error");
      setSending(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

  return (
    <div
      className={`rounded-2xl bg-white ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"} shadow-xl ring-1 ring-slate-900/5`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{t.eyebrow}</p>
      <h2
        className={`mt-2 font-black tracking-tight text-slate-900 ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {t.title}
      </h2>
      <p className="mt-1.5 text-sm text-slate-600">{t.subtitle}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {/* Honeypot — off-screen, never announced, irresistible to bots. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`${source}-company`}>Company</label>
          <input id={`${source}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <Field id={`${source}-vehicle`} label={t.vehicle} error={errors.vehicle}>
          <input
            id={`${source}-vehicle`}
            value={values.vehicle}
            onChange={(e) => set("vehicle", e.target.value)}
            placeholder={t.vehiclePlaceholder}
            aria-invalid={Boolean(errors.vehicle)}
            className={input}
          />
        </Field>

        <Field id={`${source}-name`} label={t.name} error={errors.name}>
          <input
            id={`${source}-name`}
            value={values.name}
            autoComplete="name"
            onChange={(e) => set("name", e.target.value)}
            placeholder={t.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            className={input}
          />
        </Field>

        <Field id={`${source}-phone`} label={t.phone} error={errors.phone}>
          <input
            id={`${source}-phone`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", formatPhone(e.target.value))}
            placeholder={t.phonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            className={input}
          />
        </Field>

        <Field id={`${source}-postal`} label={t.postal} error={errors.postal}>
          <input
            id={`${source}-postal`}
            value={values.postal}
            autoComplete="postal-code"
            onChange={(e) => set("postal", e.target.value)}
            placeholder={t.postalPlaceholder}
            aria-invalid={Boolean(errors.postal)}
            className={input}
          />
        </Field>

        {/*
          Law 25 wants consent that is manifest, free and enlightened, and
          asked for separately from everything else. So: its own control,
          unchecked by default, and the submit will not pass without it. The
          link to the policy sits at the foot of the page rather than inline
          here — same page, one tap, and the form stays uncluttered.
        */}
        <div>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
            />
            <span>{t.consent}</span>
          </label>
          {errors.consent && (
            <p className="mt-1.5 text-sm font-semibold text-red-700">{errors.consent}</p>
          )}
        </div>

        {failed && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">
            {failed === "throttled" ? t.tooManyBody : t.errorBody}{" "}
            <PhoneLink source="quote_form_error" className="font-black underline" />
          </p>
        )}

        {/* One aria-live region announces every validation failure. */}
        <p aria-live="polite" className="sr-only">
          {Object.values(errors).filter(Boolean).join(". ")}
        </p>

        {/*
          Outlined on phones, filled from sm up. On a narrow screen this
          button stacks close to the green hero CTA and the green sticky call
          bar; three filled green blocks in one viewport stop reading as a
          hierarchy. The outline keeps it distinct without demoting it — it is
          still the only control in the card.
        */}
        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-brand-600 bg-white px-6 py-4 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:bg-brand-600 sm:text-white sm:hover:bg-brand-700"
        >
          {sending && <Loader2 className="h-5 w-5 animate-spin" />}
          {sending ? t.submitting : t.submit}
        </button>

        {/*
          The consent checkbox was removed on request. This line replaces it:
          submitting the form is the consent action, and it is stated before
          the button rather than after. Quebec's Law 25 wants consent that is
          explicit and informed — a notice is weaker than a ticked box, so
          see the note in README before running ads on this.
        */}
        <p className="text-center text-xs leading-relaxed text-slate-500">{t.privacyNote}</p>
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-slate-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}
