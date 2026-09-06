"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { STATUSES, SOURCES, type Status, type Source } from "./constants";

const field =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600";

/**
 * One form for both "add a lead that came in by phone" and "edit an
 * existing one". `quote` being null is what distinguishes them.
 */
export default function QuoteEditor({
  quote,
  onClose,
}: {
  quote: Doc<"quotes"> | null;
  onClose: () => void;
}) {
  const createQuote = useMutation(api.quotes.create);
  const updateQuote = useMutation(api.quotes.update);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const isEdit = quote !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
      string,
      string
    >;
    const rawOffer = data.offerAmount?.trim();

    const shared = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      vehicle: data.vehicle.trim(),
      condition: data.condition.trim(),
      message: data.message.trim(),
      notes: data.notes.trim(),
      status: data.status as Status,
      source: data.source as Source,
      // Empty clears the offer rather than writing 0.
      offerAmount: rawOffer ? Number(rawOffer) : undefined,
    };

    try {
      if (isEdit) {
        await updateQuote({ quoteId: quote._id, ...shared });
      } else {
        await createQuote(shared);
      }
      onClose();
    } catch (err) {
      setError(err instanceof ConvexError ? String(err.data) : "Could not save. Please try again.");
      setBusy(false);
    }
  }

  /*
    Escape closes the dialog, and focus moves into it when it opens.

    Both are bound at the document level on purpose. The keydown listener has
    to be, or it never fires while focus sits on <body>, which is where focus
    is the instant the dialog appears. Moving focus in is the other half:
    without it a keyboard user's next Tab continues from wherever they were
    behind the overlay, tabbing through a form they cannot see.

    Focus is handed back to whatever opened the dialog on close, so the
    keyboard position is not lost.
  */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    /*
      The backdrop closes on click; Escape is its keyboard equivalent, and it
      is bound on the document rather than here. A <div> is not focusable, so
      an onKeyDown on this element only fires once focus is already inside —
      which it is not when the dialog has just opened. That version satisfied
      the linter and did nothing.

      `role="presentation"` marks the backdrop as scenery; the panel inside
      carries role="dialog".
    */
    /*
      The keyboard equivalent for this click is the document-level Escape
      listener above, which the lint rule cannot see. It has to live there: a
      <div> is not focusable, so a handler bound here would not fire while
      focus is still on <body>, which is where it is when the dialog opens.
      QuoteEditor.test.tsx proves both paths.
    */
    /*
      Two a11y rules are switched off for this file in biome.json, both
      deliberately and both covered by QuoteEditor.test.tsx:

      useKeyWithClickEvents — the keyboard equivalent for this backdrop click
      is the document-level Escape listener above, which the rule cannot see.
      It has to live on the document: a <div> is not focusable, so a handler
      here would not fire while focus is still on <body>, which is where it is
      the moment the dialog opens. An earlier version did exactly that,
      satisfied the rule, and did nothing.

      useSemanticElements — a native <dialog> would be better, giving focus
      trapping and Escape for free, but jsdom does not implement showModal(),
      so none of it could be tested. Proven behaviour beats better-in-principle
      behaviour that cannot be verified. Revisit when jsdom supports it.
    */
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id={headingId} className="text-lg font-black tracking-tight text-slate-900">
            {isEdit ? "Edit quote" : "Add a quote"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="q-name" className={labelClass}>
                Name
              </label>
              <input
                id="q-name"
                name="name"
                required
                defaultValue={quote?.name ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="q-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="q-phone"
                name="phone"
                type="tel"
                required
                defaultValue={quote?.phone ?? ""}
                className={field}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="q-email" className={labelClass}>
                Email{" "}
                <span className="font-medium normal-case tracking-normal text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                id="q-email"
                name="email"
                type="email"
                defaultValue={quote?.email ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="q-vehicle" className={labelClass}>
                Vehicle
              </label>
              <input
                id="q-vehicle"
                name="vehicle"
                required
                placeholder="2011 Honda Civic"
                defaultValue={quote?.vehicle ?? ""}
                className={field}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="q-status" className={labelClass}>
                Status
              </label>
              <select
                id="q-status"
                name="status"
                defaultValue={quote?.status ?? "new"}
                className={field}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-source" className={labelClass}>
                Source
              </label>
              <select
                id="q-source"
                name="source"
                defaultValue={quote?.source ?? "phone"}
                className={field}
              >
                {SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-offer" className={labelClass}>
                Offer (CAD)
              </label>
              <input
                id="q-offer"
                name="offerAmount"
                type="number"
                min="0"
                step="25"
                placeholder="800"
                defaultValue={quote?.offerAmount ?? ""}
                className={field}
              />
            </div>
          </div>

          <div>
            <label htmlFor="q-condition" className={labelClass}>
              Condition
            </label>
            <input
              id="q-condition"
              name="condition"
              defaultValue={quote?.condition ?? ""}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="q-message" className={labelClass}>
              Customer message
            </label>
            <textarea
              id="q-message"
              name="message"
              rows={2}
              defaultValue={quote?.message ?? ""}
              className={`${field} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="q-notes" className={labelClass}>
              Internal notes{" "}
              <span className="font-medium normal-case tracking-normal text-slate-400">
                (never shown to the customer)
              </span>
            </label>
            <textarea
              id="q-notes"
              name="notes"
              rows={2}
              defaultValue={quote?.notes ?? ""}
              className={`${field} resize-y`}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
