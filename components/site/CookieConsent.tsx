"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  parseConsent,
  serializeConsent,
  toConsentMode,
  type ConsentState,
} from "@/lib/consent";

type Labels = {
  title: string;
  body: string;
  acceptAll: string;
  rejectAll: string;
  customise: string;
  save: string;
  necessary: string;
  necessaryBody: string;
  analytics: string;
  analyticsBody: string;
  marketing: string;
  marketingBody: string;
  alwaysOn: string;
  policyLink: string;
  privacyHref: string;
};

function writeCookie(state: ConsentState) {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    serializeConsent(state)
  )};path=/;max-age=${CONSENT_MAX_AGE};samesite=lax`;
}

function applyConsentMode(state: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  // Consent Mode v2 expects the arguments-object shape gtag() produces, not
  // an object literal — pushing a plain object here silently does nothing.
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  gtag("consent", "update", toConsentMode(state));
  window.dataLayer.push({ event: "consent_update", ...toConsentMode(state) });
}

/**
 * Law 25 consent banner.
 *
 * "Tout refuser" is the same size, weight and prominence as "Tout accepter" —
 * that symmetry is a legal requirement in Quebec, not a design preference,
 * and it is the part most banners get wrong.
 */
export default function CookieConsent({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
      ?.split("=")[1];
    const existing = parseConsent(raw ? decodeURIComponent(raw) : null);
    if (existing) {
      applyConsentMode(existing);
      return;
    }
    setOpen(true);
  }, []);

  function decide(next: { analytics: boolean; marketing: boolean }) {
    const state: ConsentState = {
      necessary: true,
      ...next,
      decidedAt: new Date().toISOString(),
    };
    writeCookie(state);
    applyConsentMode(state);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-slate-700 bg-slate-950 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-white shadow-2xl sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 id="consent-title" className="text-base font-black sm:text-lg">
          {labels.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {labels.body}{" "}
          <Link href={labels.privacyHref} className="font-semibold text-white underline">
            {labels.policyLink}
          </Link>
        </p>

        {showDetail && (
          <div className="mt-4 space-y-3 rounded-lg bg-slate-900 p-4">
            <Toggle
              label={labels.necessary}
              body={labels.necessaryBody}
              checked
              disabled
              hint={labels.alwaysOn}
              onChange={() => {}}
            />
            <Toggle
              label={labels.analytics}
              body={labels.analyticsBody}
              checked={analytics}
              onChange={setAnalytics}
            />
            <Toggle
              label={labels.marketing}
              body={labels.marketingBody}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          {/* Accept and refuse are deliberately identical in weight. */}
          <button
            type="button"
            onClick={() => decide({ analytics: true, marketing: true })}
            className="flex-1 rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {labels.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => decide({ analytics: false, marketing: false })}
            className="flex-1 rounded-lg bg-slate-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {labels.rejectAll}
          </button>
          {showDetail ? (
            <button
              type="button"
              onClick={() => decide({ analytics, marketing })}
              className="flex-1 rounded-lg border border-slate-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {labels.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="flex-1 rounded-lg border border-slate-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {labels.customise}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  body,
  checked,
  disabled,
  hint,
  onChange,
}: {
  label: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  hint?: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-brand-500 disabled:opacity-60"
      />
      <span>
        <span className="block text-sm font-bold text-white">
          {label}
          {hint && <span className="ml-2 text-xs font-medium text-slate-400">{hint}</span>}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{body}</span>
      </span>
    </label>
  );
}
