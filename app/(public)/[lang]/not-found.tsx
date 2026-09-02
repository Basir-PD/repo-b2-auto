import Link from "next/link";
import { pathFor } from "@/config/routes";

/**
 * 404 inside the language tree. Middleware funnels stray top-level paths in
 * here, so an unknown URL still lands on a branded page with a route back to
 * the form rather than a bare framework error.
 *
 * The layout above cannot pass params to a not-found boundary, so the copy is
 * bilingual on one page instead of guessing a language.
 */
export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-700">404</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-3 text-base leading-relaxed text-slate-600">
        Cette page n&apos;existe pas ou a été déplacée. Vous cherchez à vendre un véhicule ?
      </p>
      <p className="mt-1 text-base leading-relaxed text-slate-500">
        This page doesn&apos;t exist or has moved. Looking to sell a vehicle?
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={pathFor("quote", "fr")}
          className="rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-500"
        >
          Obtenir une estimation
        </Link>
        <Link
          href={pathFor("quote", "en")}
          className="rounded-xl border-2 border-brand-600 px-6 py-3.5 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Get a free quote
        </Link>
      </div>

      <Link href={pathFor("home", "fr")} className="mt-6 text-sm font-bold text-slate-500 underline">
        Retour à l&apos;accueil / Back to home
      </Link>
    </div>
  );
}
