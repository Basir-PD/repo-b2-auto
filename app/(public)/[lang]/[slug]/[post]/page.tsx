import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROUTES, isLang, pathFor, type Lang } from "@/config/routes";
import { siteConfig, fullAddress } from "@/config/site";
import { getCopy } from "@/content/copy";
import { POSTS, postBySlug } from "@/content/blog";
import { PageHeader, Sections, CtaBand } from "@/components/pages/PageShell";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";

export function generateStaticParams() {
  return POSTS.map((post) => ({
    lang: post.lang,
    slug: ROUTES.blog[post.lang],
    post: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; post: string }>;
}): Promise<Metadata> {
  const { lang: raw, post: postSlug } = await params;
  if (!isLang(raw)) return {};
  const post = postBySlug(raw, postSlug);
  if (!post) return {};

  const url = `${siteConfig.url}/${raw}/${ROUTES.blog[raw]}/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    /*
      Articles exist in one language, so the cluster is a single self-reference
      — but it still has to be STATED. These four pages were shipping no
      hreflang at all, not even their own, which leaves a crawler to infer the
      language rather than being told it.
    */
    alternates: {
      canonical: url,
      languages: {
        [raw === "fr" ? "fr-CA" : "en-CA"]: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "article",
      locale: raw === "fr" ? "fr_CA" : "en_CA",
      url,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: [
        {
          url: "/hero-tow-truck.jpg",
          width: 1536,
          height: 1024,
          alt: `${siteConfig.name} — ${fullAddress}`,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string; post: string }>;
}) {
  const { lang: raw, slug, post: postSlug } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;

  // Guard the parent segment too — /fr/faq/anything must not resolve here.
  if (slug !== ROUTES.blog[lang]) notFound();

  const post = postBySlug(lang, postSlug);
  if (!post) notFound();

  const t = getCopy(lang);
  const path = `/${lang}/${slug}/${post.slug}/`;

  return (
    <>
      <JsonLd
        id="ld-article"
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          // Article rich results require an image. Until posts carry their
          // own, this is the same asset the OG tags above already use.
          image: [`${siteConfig.url}/hero-tow-truck.jpg`],
          inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
          mainEntityOfPage: `${siteConfig.url}${path}`,
          author: { "@type": "Organization", name: siteConfig.name },
          publisher: { "@id": `${siteConfig.url}/#business` },
        }}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: t.common.breadcrumbHome, path: pathFor("home", lang) },
          { name: t.nav.blog, path: pathFor("blog", lang) },
          { name: post.title, path },
        ])}
      />

      <PageHeader
        lang={lang}
        trail={[
          { name: t.nav.blog, path: pathFor("blog", lang) },
          { name: post.title, path },
        ]}
        h1={post.title}
        lede={post.lede}
      />

      <p className="container mx-auto max-w-4xl px-4 pt-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        {t.common.published}{" "}
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>

      <Sections sections={post.sections} />
      <CtaBand lang={lang} />
    </>
  );
}
