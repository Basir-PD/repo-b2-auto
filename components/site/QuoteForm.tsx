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
import { formatPhone, phoneIsValid } from "@/lib/phone";
import PhoneLink from "@/components/site/PhoneLink";

type Values = { vehicle: string; name: string; phone: string; postal: string };

const EMPTY: Values = { vehicle: "", name: "", phone: "", postal: "" };

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
 * There is no consent checkbox: it was removed on request, and the line
 * above the submit button carries the consent wording instead.
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

  return (
    <div
      id="quote-form"
      className={`rounded-2xl bg-white ${compact ? "p-5" : "p-5 sm:p-6"} shadow-xl ring-1 ring-slate-900/5`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2
          className={`font-black tracking-tight text-slate-900 ${
            compact ? "text-xl" : "text-xl sm:text-2xl"
          }`}
        >
          {t.title}
        </h2>
        {/*
          The eyebrow moved onto the heading's line rather than above it. It
          was a whole row for two words, and the heading already says the same
          thing.
        */}
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700">
          {t.eyebrow}
        </span>
      </div>

      {/*
        The callback promise, kept: it is what persuades someone to start
        typing. The hours are in the sentence because the promise is not true
        at 2am. The explanatory subtitle above it is gone — it said in a
        sentence what four visible fields say by existing.
      */}
      <p className="mt-2 flex items-center gap-2 text-[13px] font-bold leading-snug text-brand-800">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
        </span>
        {t.replyTime}
      </p>

      {/*
        Three handles, each for a different consumer:

        - `id` is unique per instance, matching how the fields are named, so
          two forms on one page could never collide.
        - `data-quote-form` is the same on every page, which is what GTM wants:
          one trigger with a CSS selector rather than a rule per template.
        - the wrapper carries `id="quote-form"` so anything can link to
          #quote-form and land on the card, heading included; globals.css
          already gives every [id] a scroll-margin so the sticky header does
          not cover it.
      */}
      <form
        id={`${source}-form`}
        data-quote-form={source}
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 flex flex-col gap-3"
      >
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
            placeholder=" "
            aria-invalid={Boolean(errors.vehicle)}
            className={fieldClass(Boolean(errors.vehicle))}
          />
        </Field>

        <Field id={`${source}-name`} label={t.name} error={errors.name}>
          <input
            id={`${source}-name`}
            value={values.name}
            autoComplete="name"
            onChange={(e) => set("name", e.target.value)}
            placeholder=" "
            aria-invalid={Boolean(errors.name)}
            className={fieldClass(Boolean(errors.name))}
          />
        </Field>

        {/* Phone and postal pair up from sm: both are short, and side by side
            they save a row without crowding either. */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Field id={`${source}-phone`} label={t.phone} error={errors.phone} className="sm:flex-1">
            <input
              id={`${source}-phone`}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => set("phone", formatPhone(e.target.value))}
              placeholder=" "
              aria-invalid={Boolean(errors.phone)}
              className={fieldClass(Boolean(errors.phone))}
            />
          </Field>

          <Field
            id={`${source}-postal`}
            label={t.postal}
            error={errors.postal}
            className="sm:flex-1"
          >
            <input
              id={`${source}-postal`}
              value={values.postal}
              autoComplete="postal-code"
              onChange={(e) => set("postal", e.target.value)}
              placeholder=" "
              aria-invalid={Boolean(errors.postal)}
              className={fieldClass(Boolean(errors.postal))}
            />
          </Field>
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
          className="mt-1 flex items-center justify-center gap-2 rounded-lg border-2 border-brand-600 bg-white px-6 py-3.5 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:bg-brand-600 sm:text-white sm:hover:bg-brand-700"
        >
          {sending && <Loader2 className="h-5 w-5 animate-spin" />}
          {sending ? t.submitting : t.submit}
        </button>

        {/*
          The consent checkbox was removed on request. This line carries the
          consent instead: sending the form is the consent action, and it is
          stated where it can be read before the button is pressed.

          Law 25 asks for consent that is manifest and enlightened; a notice
          is weaker than a ticked box. See README before running paid traffic
          against this form.
        */}
        <p className="text-center text-xs leading-snug text-slate-500">{t.privacyNote}</p>
      </form>
    </div>
  );
}

/**
 * Field styling, Material-style.
 *
 * The visible label is gone as a separate row, but NOT as a label: it sits
 * inside the input and floats on focus or once there is a value. That keeps a
 * real <label>, which a placeholder alone would not — placeholder-only inputs
 * disappear the moment someone types, so anyone distracted mid-form loses
 * what the field was, and screen readers get no reliable name.
 *
 * `placeholder=" "` is load-bearing: a single space keeps :placeholder-shown
 * true while empty, which is what drives the float without any JavaScript.
 */
function fieldClass(invalid: boolean) {
  return [
    "peer w-full rounded-lg border bg-white px-3.5 pb-2 pt-6 text-base text-slate-900",
    "transition-colors focus:outline-none focus:ring-2",
    invalid
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/25"
      : "border-slate-300 focus:border-brand-600 focus:ring-brand-600/25",
  ].join(" ");
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="relative">
        {children}
        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute left-3.5 top-1.5 origin-left text-[11px] font-semibold uppercase tracking-wide transition-all",
            // Sits mid-field while empty and unfocused, floats up otherwise.
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
            "peer-placeholder-shown:text-[15px] peer-placeholder-shown:normal-case",
            "peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal",
            "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px]",
            "peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wide",
            /*
              The resting state is slate-600, not slate-400. While the label
              sits mid-field it IS the field's only visible name, so it has to
              clear AA on its own — slate-400 measured 2.56:1. Once it floats
              it is secondary to the value beneath it, and slate-500 (4.76:1)
              is enough.
            */
            error
              ? "text-red-600 peer-placeholder-shown:text-red-600 peer-focus:text-red-600"
              : "text-slate-500 peer-placeholder-shown:text-slate-600 peer-focus:text-brand-700",
          ].join(" ")}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
