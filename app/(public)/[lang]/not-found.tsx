import Link from "next/link";
import { headers } from "next/headers";
import { getCopy } from "@/content/copy";
import { DEFAULT_LANG, LANG_HEADER, LANGS, pathFor, type Lang } from "@/config/routes";

/**
 * 404 inside the language tree. Middleware funnels stray top-level paths in
 * here, so an unknown URL still lands on a branded page with a route back to
 * the form rather than a bare framework error.
 *
 * Next does not pass route params to a not-found boundary, which is why this
 * page used to print French and English stacked on top of each other and read
 * as something half-finished — the header above it was already in one language
 * while the body spoke both. The middleware now stamps the language of the
 * path onto a request header and this reads it back, so a French visitor gets
 * a French page and an English visitor an English one.
 *
 * Reading a header opts this route into dynamic rendering. That is the right
 * trade for an error page nobody should reach and nothing should cache.
 */
export default async function NotFound() {
  const header = (await headers()).get(LANG_HEADER);
  const lang: Lang = (LANGS as readonly string[]).includes(header ?? "")
    ? (header as Lang)
    : DEFAULT_LANG;

  const t = getCopy(lang).notFound;

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-700">{t.eyebrow}</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{t.body}</p>

      <div className="mt-8">
        <Link
          href={pathFor("quote", lang)}
          className="rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-500"
        >
          {t.quoteCta}
        </Link>
      </div>

      <Link
        href={pathFor("home", lang)}
        className="mt-6 text-sm font-bold text-slate-500 underline"
      >
        {t.backHome}
      </Link>
    </div>
  );
}
