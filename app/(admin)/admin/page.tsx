"use client";

import { useState } from "react";
import { Authenticated, Unauthenticated, AuthLoading, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Loader2, Plus, Phone, Mail, Pencil, Trash2, Archive, ArchiveRestore,
  AlertTriangle, LogOut, Inbox,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import SignIn from "./SignIn";
import QuoteEditor from "./QuoteEditor";
import { STATUSES, statusMeta, sourceLabel, type Status } from "./constants";

export default function AdminPage() {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Doc<"quotes"> | null | undefined>(undefined);

  const me = useQuery(api.quotes.me);
  const stats = useQuery(api.quotes.stats);
  const quotes = useQuery(api.quotes.list, {
    status: filter === "all" ? undefined : filter,
    includeArchived: showArchived,
  });

  // Signed in, but the address is no longer on the allowlist.
  if (me === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
        <p className="max-w-sm font-semibold text-slate-900">
          This account isn&rsquo;t on the admin allowlist.
        </p>
        <p className="max-w-sm text-sm text-slate-600">
          Add it to <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">ADMIN_EMAILS</code> on
          the Convex deployment, then sign in again.
        </p>
        <button onClick={() => void signOut()} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-white">
          Sign out
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600">
              <span className="text-sm font-black tracking-tight text-white">B2</span>
            </span>
            <span className="text-base font-black tracking-tight text-slate-900">Quotes</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add quote
            </button>
            <span className="hidden text-xs text-slate-500 sm:inline">{me?.email}</span>
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Sign out"
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-6 sm:py-8">
        {/* ── Pipeline counts ───────────────────────────────────── */}
        {stats && (
          <div className="mb-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-6">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilter(filter === s.value ? "all" : s.value)}
                className={`bg-white px-3 py-3 text-left transition-colors hover:bg-slate-50 ${
                  filter === s.value ? "ring-2 ring-inset ring-brand-500" : ""
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-0.5 text-2xl font-black tabular-nums text-slate-900">
                  {stats.byStatus[s.value] ?? 0}
                </p>
              </button>
            ))}
          </div>
        )}

        {stats && stats.emailFailures > 0 && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-900">
              <strong className="font-bold">
                {stats.emailFailures} notification {stats.emailFailures === 1 ? "email" : "emails"} didn&rsquo;t send.
              </strong>{" "}
              The leads are safe and listed below — only the alert failed. Check{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">RESEND_API_KEY</code> on the Convex deployment.
            </p>
          </div>
        )}

        {/* ── Filters ───────────────────────────────────────────── */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-bold transition-colors ${
              filter === "all" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600 hover:bg-white"
            }`}
          >
            All{stats ? ` (${stats.total})` : ""}
          </button>
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Show archived{stats?.archived ? ` (${stats.archived})` : ""}
          </label>
        </div>

        {/* ── List ──────────────────────────────────────────────── */}
        {quotes === undefined ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Inbox className="h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-900">No quotes here yet</p>
            <p className="max-w-xs text-sm text-slate-500">
              Requests from the website land here automatically. You can also add one by hand.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {quotes.map((quote) => (
              <QuoteRow key={quote._id} quote={quote} onEdit={() => setEditing(quote)} />
            ))}
          </ul>
        )}
      </main>

      {editing !== undefined && (
        <QuoteEditor quote={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}

function QuoteRow({ quote, onEdit }: { quote: Doc<"quotes">; onEdit: () => void }) {
  const setStatus = useMutation(api.quotes.setStatus);
  const setArchived = useMutation(api.quotes.setArchived);
  const remove = useMutation(api.quotes.remove);
  const [confirming, setConfirming] = useState(false);

  const meta = statusMeta(quote.status);
  const archived = quote.archivedAt !== undefined;

  return (
    <li className={`rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${archived ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black tracking-tight text-slate-900">{quote.name}</h3>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.chip}`}>
              {meta.label}
            </span>
            {archived && (
              <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Archived
              </span>
            )}
            {quote.emailSent === false && (
              <span
                title={quote.emailError ?? "Notification email failed"}
                className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800"
              >
                Email failed
              </span>
            )}
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-700">{quote.vehicle}</p>
          {quote.condition && <p className="text-sm text-slate-500">{quote.condition}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={quote.status}
            onChange={(e) => void setStatus({ quoteId: quote._id, status: e.target.value as Status })}
            aria-label={`Status for ${quote.name}`}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 focus:border-brand-500 focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <button type="button" onClick={onEdit} aria-label={`Edit ${quote.name}`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => void setArchived({ quoteId: quote._id, archived: !archived })}
            aria-label={archived ? `Restore ${quote.name}` : `Archive ${quote.name}`}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            {archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${quote.name}`}
            className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-sm">
        <a href={`tel:${quote.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 font-bold text-brand-600 hover:underline">
          <Phone className="h-3.5 w-3.5" /> {quote.phone}
        </a>
        {quote.email && (
          <a href={`mailto:${quote.email}`} className="flex items-center gap-1.5 text-slate-600 hover:underline">
            <Mail className="h-3.5 w-3.5" /> {quote.email}
          </a>
        )}
        {quote.offerAmount !== undefined && (
          <span className="font-bold tabular-nums text-slate-900">${quote.offerAmount.toLocaleString()}</span>
        )}
        <span className="text-slate-400">{sourceLabel(quote.source)}</span>
        <span className="ml-auto text-slate-400">
          {new Date(quote._creationTime).toLocaleString("en-CA", {
            timeZone: "America/Toronto",
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      {(quote.message || quote.notes) && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {quote.message && <p className="text-sm leading-relaxed text-slate-600">{quote.message}</p>}
          {quote.notes && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-700">
              <span className="font-bold">Notes: </span>{quote.notes}
            </p>
          )}
        </div>
      )}

      {confirming && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-sm font-semibold text-rose-900">
            Delete {quote.name} permanently? Archiving keeps it instead.
          </p>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-bold text-slate-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void remove({ quoteId: quote._id })}
              className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-sm font-bold text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
