"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { Loader2, Lock } from "lucide-react";

/**
 * Email + password sign-in for the admin.
 *
 * "Create account" is shown because the very first admin has to make
 * their account somehow — it is safe to expose, because convex/auth.ts
 * refuses any address that isn't on the ADMIN_EMAILS allowlist.
 */
export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const formData = new FormData(event.currentTarget);
    formData.set("flow", flow);

    try {
      await signIn("password", formData);
    } catch (err) {
      // ConvexError carries our own message; anything else is a generic failure.
      const message =
        err instanceof ConvexError
          ? String(err.data)
          : flow === "signIn"
            ? "Wrong email or password."
            : "Could not create that account.";
      setError(message);
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600">
            <span className="text-sm font-black tracking-tight text-white">B2</span>
          </span>
          <span className="text-lg font-black tracking-tight text-slate-900">Autos B2</span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {flow === "signIn" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {flow === "signIn"
            ? "Manage quote requests and leads."
            : "Only addresses on the admin allowlist can be registered."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={field} />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={flow === "signIn" ? "current-password" : "new-password"}
              required
              className={field}
            />
            {flow === "signUp" && (
              <p className="mt-1.5 text-xs text-slate-500">
                At least 12 characters, with an uppercase letter, a lowercase letter and a number.
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {flow === "signIn" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setError(null); }}
          className="mt-5 text-sm font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-800"
        >
          {flow === "signIn" ? "First time? Create your account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
