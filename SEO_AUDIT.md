# SEO_AUDIT.md — autosb2.com

Phase 1 audit. **No code was changed to produce this document.**

**Method.** `npm install` (the checked-out `node_modules` was incomplete — `convex` was
missing, so `next build` could not finish), then `next build` → 56 static pages, then
`next start` and a crawl of all 46 public routes. Every number below is read out of the
**actually served HTML**, not inferred from source. Similarity scores are computed on that
HTML. Where a claim comes from reading source rather than output, the file:line is given.

**Headline.** This codebase is in far better SEO shape than a typical audit target. Canonicals,
hreflang, the sitemap, robots, heading hierarchy, structured data, trailing-slash policy and a
NAP single-source module are already implemented and correct. The `TITLE_MAX`/`DESCRIPTION_MAX`
invariants are enforced by a passing 101-test suite (`content/metadata.test.ts`).

Consequently, most of the Phase 2 brief describes work that already exists. The real findings
are narrower and are listed in **§12 — What actually needs fixing**. Two of them are serious:
a public file that publishes **contradictory business hours and a different business name**
(§10), and the fact that **the GTM container ID is not in this repo at all** (§9).

---

## 1. Page inventory

46 public routes. `T` = title length, `D` = meta description length, `W` = word count of the
full rendered `<body>` text (chrome included), `HL` = number of `hreflang` tags.

| Route | Type | T | D | Canonical | H1s | W | Robots | HL | JSON-LD emitted |
|---|---|---|---|---|---|---|---|---|---|
| `/fr/` | Home | 48 | 142 | self | 1 | 949 | index | 3 | AutoWrecker+LocalBusiness, FAQPage, WebPage |
| `/en/` | Home | 44 | 140 | self | 1 | 882 | index | 3 | AutoWrecker+LocalBusiness, FAQPage, WebPage |
| `/fr/rachat-auto-scrap/` | Service | 30 | 151 | self | 1 | 565 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/en/cash-for-junk-cars/` | Service | 29 | 142 | self | 1 | 527 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/fr/remorquage-gratuit/` | Service | 58 | 139 | self | 1 | 458 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/en/free-towing/` | Service | 52 | 140 | self | 1 | 433 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/fr/achat-auto-accidentee/` | Service | 54 | 144 | self | 1 | 491 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/en/damaged-car-buyer/` | Service | 50 | 132 | self | 1 | 473 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/fr/achat-camion-vus/` | Service | 47 | 147 | self | 1 | 456 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/en/truck-suv-buyer/` | Service | 39 | 138 | self | 1 | 417 | index | 3 | AutoWrecker+LocalBusiness, WebPage, Service, BreadcrumbList |
| `/fr/estimation/` | Quote | 49 | 126 | self | 1 | 225 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/en/quote/` | Quote | 38 | 105 | self | 1 | 215 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/fr/merci/` | Static | 42 | 92 | self | 1 | 207 | noindex, follow | 3 | AutoWrecker+LocalBusiness |
| `/en/thank-you/` | Static | 45 | 90 | self | 1 | 187 | noindex, follow | 3 | AutoWrecker+LocalBusiness |
| `/fr/a-propos/` | Static | 43 | 145 | self | 1 | 531 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList |
| `/en/about/` | Static | 45 | 138 | self | 1 | 488 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList |
| `/fr/faq/` | Static | 31 | 142 | self | 1 | 785 | index | 3 | AutoWrecker+LocalBusiness, WebPage, FAQPage, BreadcrumbList |
| `/en/faq/` | Static | 37 | 114 | self | 1 | 733 | index | 3 | AutoWrecker+LocalBusiness, WebPage, FAQPage, BreadcrumbList |
| `/fr/blogue/` | Static | 41 | 135 | self | 1 | 316 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/en/blog/` | Static | 40 | 119 | self | 1 | 155 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/fr/contact/` | Static | 51 | 127 | self | 1 | 225 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList |
| `/en/contact/` | Static | 51 | 124 | self | 1 | 205 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList |
| `/fr/politique-de-confidentialite/` | Static | 39 | 114 | self | 1 | 706 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/en/privacy-policy/` | Static | 25 | 96 | self | 1 | 637 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/fr/conditions-utilisation/` | Static | 35 | 104 | self | 1 | 338 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/en/terms/` | Static | 23 | 87 | self | 1 | 317 | index | 3 | AutoWrecker+LocalBusiness, WebPage |
| `/fr/cour-a-scrap-mascouche/` | City | 51 | 108 | self | 1 | 675 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/en/scrap-yard-mascouche/` | City | 48 | 93 | self | 1 | 622 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/cour-a-scrap-terrebonne/` | City | 52 | 109 | self | 1 | 635 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/en/scrap-car-terrebonne/` | City | 49 | 94 | self | 1 | 586 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-repentigny/` | City | 52 | 109 | self | 1 | 605 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-laval/` | City | 47 | 104 | self | 1 | 636 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/en/cash-for-cars-laval/` | City | 44 | 89 | self | 1 | 602 | index | 3 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-lassomption/` | City | 54 | 111 | self | 1 | 611 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-blainville/` | City | 52 | 109 | self | 1 | 581 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-saint-lin/` | City | 45 | 120 | self | 1 | 593 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-bois-des-filion/` | City | 57 | 114 | self | 1 | 556 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/rachat-auto-montreal-est/` | City | 54 | 111 | self | 1 | 569 | index | 2 | AutoWrecker+LocalBusiness, WebPage, BreadcrumbList, FAQPage |
| `/fr/blogue/combien-vaut-une-auto-pour-la-scrap-au-quebec/` | Post | 55 | 153 | self | 1 | 724 | index | 0 | AutoWrecker+LocalBusiness, Article, BreadcrumbList |
| `/fr/blogue/ceder-son-vehicule-a-la-saaq-guide/` | Post | 55 | 143 | self | 1 | 596 | index | 0 | AutoWrecker+LocalBusiness, Article, BreadcrumbList |
| `/fr/blogue/vendre-une-auto-accidentee-apres-une-perte-totale/` | Post | 63 | 114 | self | 1 | 543 | index | 0 | AutoWrecker+LocalBusiness, Article, BreadcrumbList |
| `/fr/blogue/cour-a-scrap-ou-vente-privee/` | Post | 56 | 136 | self | 1 | 545 | index | 0 | AutoWrecker+LocalBusiness, Article, BreadcrumbList |
| `/fr/lp/vendre-mon-auto/` | LP | 35 | 146 | — | 1 | 195 | noindex, follow | 0 | AutoWrecker+LocalBusiness |
| `/fr/lp/remorquage-gratuit/` | LP | 47 | 148 | — | 1 | 211 | noindex, follow | 0 | AutoWrecker+LocalBusiness |
| `/fr/lp/offre-facebook/` | LP | 44 | 161 | — | 1 | 201 | noindex, follow | 0 | AutoWrecker+LocalBusiness |
| `/en/lp/cash-for-junk-cars/` | LP | 29 | 105 | — | 1 | 178 | noindex, follow | 0 | AutoWrecker+LocalBusiness |

### Every H1 (one per page, all unique)

| Route | H1 |
|---|---|
| `/fr/` | Vendre son auto scrap à Laval et Montréal — payé comptant |
| `/en/` | Sell your junk car in Laval & Montreal — cash on the spot |
| `/fr/rachat-auto-scrap/` | Vendre mon auto scrap — acheteur d'auto scrap, payé comptant |
| `/en/cash-for-junk-cars/` | Sell my junk car — junk car buyer paying cash on the spot |
| `/fr/remorquage-gratuit/` | Remorquage gratuit et enlèvement d'auto — jamais déduit |
| `/en/free-towing/` | Free junk car removal — included, never deducted |
| `/fr/achat-auto-accidentee/` | Vendre son auto accidentée ou sa perte totale |
| `/en/damaged-car-buyer/` | Sell your damaged or totaled car for cash |
| `/fr/achat-camion-vus/` | Achat de camions, VUS et fourgonnettes |
| `/en/truck-suv-buyer/` | We buy trucks, SUVs and vans |
| `/fr/estimation/` | Estimation gratuite pour votre véhicule |
| `/en/quote/` | Free quote for your vehicle |
| `/fr/merci/` | Merci — on vous rappelle sous peu |
| `/en/thank-you/` | Thanks — we'll call you shortly |
| `/fr/a-propos/` | Un recycleur automobile de Mascouche, pas un intermédiaire |
| `/en/about/` | An auto recycler in Mascouche, not a middleman |
| `/fr/faq/` | Questions fréquentes |
| `/en/faq/` | Frequently asked questions |
| `/fr/blogue/` | Blogue |
| `/en/blog/` | Blog |
| `/fr/contact/` | Nous joindre |
| `/en/contact/` | Contact us |
| `/fr/politique-de-confidentialite/` | Politique de confidentialité |
| `/en/privacy-policy/` | Privacy policy |
| `/fr/conditions-utilisation/` | Conditions d'utilisation |
| `/en/terms/` | Terms of use |
| `/fr/cour-a-scrap-mascouche/` | Rachat d'auto scrap à Mascouche — argent comptant, remorquage gratuit |
| `/en/scrap-yard-mascouche/` | Cash for scrap cars in Mascouche — free towing, paid on pickup |
| `/fr/cour-a-scrap-terrebonne/` | Rachat d'auto scrap à Terrebonne — argent comptant, remorquage gratuit |
| `/en/scrap-car-terrebonne/` | Cash for scrap cars in Terrebonne — free towing, paid on pickup |
| `/fr/rachat-auto-repentigny/` | Rachat d'auto scrap à Repentigny — argent comptant, remorquage gratuit |
| `/fr/rachat-auto-laval/` | Rachat d'auto scrap à Laval — argent comptant, remorquage gratuit |
| `/en/cash-for-cars-laval/` | Cash for scrap cars in Laval — free towing, paid on pickup |
| `/fr/rachat-auto-lassomption/` | Rachat d'auto scrap à L'Assomption — argent comptant, remorquage gratuit |
| `/fr/rachat-auto-blainville/` | Rachat d'auto scrap à Blainville — argent comptant, remorquage gratuit |
| `/fr/rachat-auto-saint-lin/` | Rachat d'auto scrap à Saint-Lin-Laurentides — argent comptant, remorquage gratuit |
| `/fr/rachat-auto-bois-des-filion/` | Rachat d'auto scrap à Bois-des-Filion — argent comptant, remorquage gratuit |
| `/fr/rachat-auto-montreal-est/` | Rachat d'auto scrap à Montréal-Est — argent comptant, remorquage gratuit |
| `/fr/blogue/combien-vaut-une-auto-pour-la-scrap-au-quebec/` | Combien vaut une auto pour la scrap au Québec en 2026 ? |
| `/fr/blogue/ceder-son-vehicule-a-la-saaq-guide/` | Comment céder son véhicule à la SAAQ : le guide complet |
| `/fr/blogue/vendre-une-auto-accidentee-apres-une-perte-totale/` | Vendre une auto accidentée : vos options après une perte totale |
| `/fr/blogue/cour-a-scrap-ou-vente-privee/` | Cour à scrap ou vente privée : lequel rapporte le plus ? |
| `/fr/lp/vendre-mon-auto/` | Vendez votre auto aujourd'hui — argent comptant, sur place |
| `/fr/lp/remorquage-gratuit/` | Faites enlever votre véhicule gratuitement — et repartez avec de l'argent |
| `/fr/lp/offre-facebook/` | Votre vieux char dort dans l'entrée ? Il vaut de l'argent. |
| `/en/lp/cash-for-junk-cars/` | Sell your junk car today — cash, paid on the spot |

---

## 2. Pages missing a title, description, canonical or H1

| Check | Result |
|---|---|
| Missing `<title>` | **None** — 46/46 |
| Missing `<meta name="description">` | **None** — 46/46 |
| Missing `<h1>` | **None** — 46/46 |
| More than one `<h1>` | **None** — every page has exactly 1 |
| Missing canonical | **4** — the `/lp/` landing pages only |

The four `/lp/` pages emit no canonical (`app/(public)/[lang]/lp/[slug]/page.tsx:29-32` sets
`robots: { index: false, follow: true }` and no `alternates`). They are `noindex` and
`Disallow`-ed in robots.txt, so this is defensible — but a self-referencing canonical costs
nothing and protects against the page being reached with ad tracking parameters appended.

Everything else canonicalises to `https://www.autosb2.com` + its own path with a trailing
slash. **All 42 are correct self-references.** No cross-canonicals, no canonical to a
non-existent host, no www/non-www inconsistency, no trailing-slash inconsistency.

---

## 3. Duplicate and near-duplicate titles and descriptions

**Duplicate titles: 1 pair.**

- `/fr/contact/` and `/en/contact/` both ship
  `Contact — 340 Chemin Pincourt, Mascouche | Autos B2` — byte-identical across two languages.
  Source: `content/pages.ts:319-322`, where `CONTACT.metaTitle.fr` and `.en` are the same string.

**Duplicate meta descriptions: none.** All 46 are distinct.

**Duplicate H1s: none.** All 46 are distinct.

**Near-duplicate by template.** The nine French city titles share the pattern
`Cour à scrap {City} — rachat comptant | Autos B2` and the three English ones
`Scrap car buyer {City} — cash paid | Autos B2` (built at
`app/(public)/[lang]/[slug]/page.tsx:64-73`). The city descriptions likewise share one
sentence frame per language. This is normal for a location set and is not the doorway
problem — but it does mean the city descriptions are the shortest on the site (see §7).

---

## 4. City-page content similarity

5-gram Jaccard similarity over the rendered body text, **with every city name stripped first**,
so a page that is a template with a swapped name scores near 1.00. Compared within language
only (cross-language pairs are meaningless).

**#### French city pages**

| | mascouche | terrebonne | repentigny | laval | l'assomption | blainville | saint-lin | bois-des-filion | montreal-est |
|---|---|---|---|---|---|---|---|---|---|
| **mascouche** | — | 0.19 | 0.21 | 0.19 | 0.18 | 0.20 | 0.20 | 0.22 | 0.21 |
| **terrebonne** | 0.19 | — | 0.20 | 0.21 | 0.17 | 0.21 | 0.20 | 0.22 | 0.20 |
| **repentigny** | 0.21 | 0.20 | — | 0.20 | 0.21 | 0.22 | 0.22 | 0.24 | 0.24 |
| **laval** | 0.19 | 0.21 | 0.20 | — | 0.18 | 0.22 | 0.21 | 0.21 | 0.22 |
| **l'assomption** | 0.18 | 0.17 | 0.21 | 0.18 | — | 0.19 | 0.21 | 0.20 | 0.21 |
| **blainville** | 0.20 | 0.21 | 0.22 | 0.22 | 0.19 | — | 0.22 | **0.26** | 0.24 |
| **saint-lin** | 0.20 | 0.20 | 0.22 | 0.21 | 0.21 | 0.22 | — | 0.23 | 0.23 |
| **bois-des-filion** | 0.22 | 0.22 | 0.24 | 0.21 | 0.20 | **0.26** | 0.23 | — | 0.23 |
| **montreal-est** | 0.21 | 0.20 | 0.24 | 0.22 | 0.21 | 0.24 | 0.23 | 0.23 | — |

**#### English city pages**

| | mascouche | terrebonne | laval |
|---|---|---|---|
| **mascouche** | — | 0.21 | 0.20 |
| **terrebonne** | 0.21 | — | 0.22 |
| **laval** | 0.20 | 0.22 | — |

**Verdict: these are not doorway pages.** The maximum pair anywhere is 0.26
(Blainville ↔ Bois-des-Filion). A templated location set typically scores 0.75–0.95. Most of
even that 0.20-ish floor is site chrome — header, footer NAP, quote form, CTA band — which is
shared by every page on the site by design, not city-specific padding.

**No body paragraph repeats across three or more city pages.** Scanning for any 8-word-or-longer
sentence appearing on ≥3 city pages returns only chrome: the footer address block, the CTA band
(`"Estimation gratuite, sans obligation, en moins de 2 minutes."`), the quote-form labels, and
the "Villes desservies" link list. Zero hits in the `lede` / `worth` / `towing` / `vehicles` /
`paperwork` prose.

### The real city-page problem: unique word count

Full-page word counts (556–675) look comfortable, but most of that is chrome. Measuring only
the genuinely unique per-city prose (`lede + worth + towing + vehicles + paperwork + faqQ + faqA`
in `content/cities.ts`):

| City | Lang | Unique words | vs. 400 target | Sectors | km | min |
|---|---|---|---|---|---|---|
| Mascouche | fr | 381 | −19 | 6 | 0 | 10 |
| Mascouche | en | 344 | −56 | 6 | 0 | 10 |
| Terrebonne | fr | 350 | −50 | 4 | 9 | 15 |
| Terrebonne | en | 317 | −83 | 4 | 9 | 15 |
| Laval | fr | 349 | −51 | 8 | 24 | 25 |
| Laval | en | 331 | −69 | 8 | 24 | 25 |
| L'Assomption | fr | 325 | −75 | 3 | 22 | 25 |
| Repentigny | fr | 319 | −81 | 4 | 17 | 20 |
| Saint-Lin-Laurentides | fr | 309 | −91 | 3 | 28 | 30 |
| Blainville | fr | 297 | −103 | 4 | 27 | 28 |
| Montréal-Est | fr | 287 | −113 | 5 | 26 | 30 |
| **Bois-des-Filion** | fr | **268** | **−132** | **2** | 19 | 20 |

**Every city page is below the 400-word target**, and the file's own header comment
(`content/cities.ts:11`) claims "Roughly 400+ words of genuinely distinct prose per city" —
which is not true of any of the twelve. Weakest three: Bois-des-Filion (268, and only 2 named
sectors), Montréal-Est (287), Blainville (297).

Driving distance/time and named landmarks **are** already present per city
(`content/cities.ts:39-45`, rendered as a three-cell `<dl>` at
`app/(public)/[lang]/[slug]/page.tsx:259-284`), and each city has an embedded route map from
340 Chemin Pincourt. Those brief items are done.

**Each city page has exactly one FAQ question**, not two
(`content/cities.ts` `faqQ`/`faqA`, rendered at `[slug]/page.tsx:309-322` and fed to
`faqSchema` as a single-item array at `:255`).

---

## 5. Structured data present today

Emitted from `components/site/JsonLd.tsx` plus per-page blocks. Every block parses as valid
JSON and every type is a real schema.org type.

| Type | Where | Status |
|---|---|---|
| `AutoWrecker` + `LocalBusiness` | **Every page**, from `layout.tsx:97` | Present. `@id` = `{url}/#business` |
| `WebPage` | All indexable pages except blog posts and `/merci/` | Present |
| `FAQPage` | `/fr/` `/en/` (5 Qs), `/faq/` (both langs), all 12 city pages (1 Q) | Present, matches visible copy |
| `Service` | 8 service pages | Present, `provider` → `@id` `#business`, `areaServed` = all 9 cities |
| `BreadcrumbList` | City, service, about, contact, faq, blog-post pages | Present |
| `Article` | 4 blog posts | Present with `datePublished`, `dateModified`, `author`, `publisher` |
| `AggregateRating` / `Review` | Nowhere | **Correctly suppressed** — `content/reviews.ts:27` is an empty array, so `hasReviews` is false and `JsonLd.tsx:89` omits the rating. Shipping a rating with no visible reviews is a manual-action risk; this is the right call. |

### What is missing

1. **No standalone `WebSite` node.** `WebSite` appears only nested inside `WebPage.isPartOf`
   (`JsonLd.tsx:194`), with no `@id` and no `potentialAction`. The brief asks for `WebSite`
   on every page.
2. **No standalone `Organization` node.** `LocalBusiness` is a subtype of `Organization`, so
   this is arguably satisfied semantically — but nothing declares the type explicitly.
3. **No `geo` coordinates.** `config/site.ts:94` sets `geo: null` deliberately, with a comment
   explaining the pin was never pulled off the Google Business Profile, and `JsonLd.tsx:80`
   omits the block rather than guessing. **I cannot fix this — it needs a real lat/lng from
   you.** See §12.
4. **`BreadcrumbList` missing on 10 pages that are below the top level**: `/fr/estimation/`,
   `/en/quote/`, `/fr/blogue/`, `/en/blog/`, `/fr/politique-de-confidentialite/`,
   `/en/privacy-policy/`, `/fr/conditions-utilisation/`, `/en/terms/`, `/fr/merci/`,
   `/en/thank-you/`. Visible breadcrumbs *are* rendered on the first eight (via
   `PageHeader` → `Breadcrumbs`, `components/pages/PageShell.tsx:9-42`), so the visible trail
   and the schema disagree.
5. **`Article` has no `image`.** Google's Article rich result wants one. `JsonLd` is not used
   for it — the object is inline at `[post]/page.tsx:77-88`.
6. **`AutoPartsStore` additional type** not declared (the brief's "if appropriate"). The
   business sells reusable parts per `content/pages.ts:50`, so it is defensible.
7. **Same `@id` with two different bodies.** `#business` is emitted on both `/fr/` and `/en/`
   with a different `url` and `description` each time (`JsonLd.tsx:45-46`). Harmless in
   practice, but two definitions of one node is untidy.

**Nothing currently present would fail the Rich Results Test.** The gaps are omissions, not errors.

---

## 6. robots.txt, sitemap.xml and indexation

**Sitemap** (`app/sitemap.ts`, served at `/sitemap.xml`): **40 URLs, and coverage is exact.**

- Indexable routes: 46 total − 4 `/lp/` − 2 thank-you = **40**
- Sitemap entries: **40**
- In indexable set but not in sitemap: **none**
- In sitemap but not indexable: **none**

Every entry carries `<lastmod>`, `<changefreq>`, `<priority>` and an `xhtml:link` hreflang
cluster. Blog posts use the post's own date as `lastmod`; everything else uses build time.

**robots.txt** (`app/robots.ts`, served at `/robots.txt`): no blanket disallow. `Allow: /` for
`*`, with `Disallow` limited to `/api/`, `/admin`, `/fr/lp/`, `/en/lp/`, `/fr/merci/`,
`/en/thank-you/` — all genuinely private or genuinely `noindex`. AdsBot and
`facebookexternalhit` are allowed everywhere first so paid destinations stay crawlable.
`Sitemap:` and `Host:` are both declared and both point at `https://www.autosb2.com`.

**Accidental noindex/nofollow: none.** `noindex` appears in exactly three places, all correct:
the `/lp/` template (`lp/[slug]/page.tsx:32`), the thank-you pages
(`[slug]/page.tsx:99,160`), and the admin dashboard (`admin/layout.tsx:12`). No page that
should rank is blocked. No `nofollow` anywhere on internal links.

**Redirects: none exist.** `next.config.ts` has no `redirects()` block and there is no
`vercel.json`. So:
- non-www → www is **not** handled in this codebase (it may be handled at the host; unverifiable from here)
- `b2autos.com` → `autosb2.com` is **not** handled anywhere
- `/` → `/fr/` or `/en/` is handled, by `middleware.ts:62-66`, as a **302** (deliberate — the
  target depends on `Accept-Language`, and a cached 301 would pin every later visitor to the
  first visitor's language). That reasoning is sound.

---

## 7. Metadata quality

**Titles.** 45 of 46 are ≤60 characters. One exceeds it:

| Route | Len | Title |
|---|---|---|
| `/fr/blogue/vendre-une-auto-accidentee-apres-une-perte-totale/` | 63 | `Vendre une auto accidentée : vos options après une perte totale` |

The four blog posts are also the only pages that **ship no brand suffix** — they bypass
`pageTitle()` and use `post.title` raw (`[post]/page.tsx:30`). Note that
`content/metadata.test.ts:126` tests them *through* `pageTitle()`, so the test asserts a
composition the page never actually performs. The test passes while the shipped title differs.

**Descriptions.** The brief asks for 140–155 characters. **31 of 42 indexable pages are under
140.** The 11 that are in range are the homepage and service pages. The shortest:

| Route | Len |
|---|---|
| `/en/terms/` | 87 |
| `/en/cash-for-cars-laval/` | 89 |
| `/en/thank-you/` | 90 |
| `/fr/merci/` | 92 |
| `/en/scrap-yard-mascouche/` | 93 |
| `/en/scrap-car-terrebonne/` | 94 |
| `/en/privacy-policy/` | 96 |
| `/en/quote/` | 105 |

**All 12 city descriptions are 89–120 characters** — 20–65 characters of search-result real
estate left on the table on exactly the pages that need local click-through. Note the existing
test only enforces an *upper* bound of 155 and a floor of 50 (`content/metadata.test.ts:29-36`).

**Heading hierarchy: clean.** Every one of the 46 pages starts at `H1` and skips no level.
Zero violations.

**Open Graph / Twitter: complete.** All 46 pages carry `og:title`, `og:description`, `og:image`,
`og:url`, `og:locale`, `twitter:card`. `og:locale:alternate` is emitted only where a real twin
exists (`[slug]/page.tsx:163-166`) — correct.

**But there is exactly one `og:image` for the entire site**: `/hero-tow-truck.jpg`, on all 46
pages. No per-page image anywhere.

---

## 8. Internal linking

**No orphan pages among the 40 indexable routes.** Inbound internal link counts:

| Page group | Inbound links |
|---|---|
| French top-level + city pages | 25–29 each |
| English top-level + city pages | 16–17 each |
| **Blog posts (4)** | **1 each** — only from `/fr/blogue/` |
| `/lp/` pages (4) | 0 — by design; paid traffic only, and `Disallow`-ed |

**The gap is contextual in-body linking.** Stripping `<header>` and `<footer>` from the served
HTML and looking at what remains:

| Page | In-body internal links |
|---|---|
| `/fr/rachat-auto-scrap/` (service) | `/fr/`, `/fr/estimation/` — **and nothing else** |
| `/fr/cour-a-scrap-mascouche/` (city) | home, quote, + all 8 other city pages |
| `/fr/` (home) | quote, faq, + all 9 city pages |
| `/fr/blogue/cour-a-scrap-ou-vente-privee/` | `/fr/`, `/fr/blogue/`, `/fr/estimation/` |

So:
- **Service pages link to no city page and to no other service page in the body.** Every
  service→city link on the site comes from the global footer.
- **City pages link to no service page in the body** (they link to each other, at
  `[slug]/page.tsx:344-364`).
- **Blog posts link to no city or service page.**

The brief's "cross-link every service page to every relevant city page and back" is currently
satisfied only by the footer, which passes far less weight than an in-body contextual link and
gives Google no topical signal about *which* city belongs with *which* service.

**Visible breadcrumbs** are rendered on every page that has a `PageHeader`
(`PageShell.tsx:9-42`) with correct `aria-label="Breadcrumb"` and `aria-current="page"`. They
match `BreadcrumbList` everywhere the schema exists — the mismatch is the 8 pages listed in §5
where the visible trail exists but the schema does not.

**Blog placement:** in the footer's company column (`SiteFooter.tsx:117-121`), **not** in the
header nav (`layout.tsx:82-89` lists scrapBuying, towing, damaged, about, faq, contact — no
blog). Not buried, but not prominent, and it shows in the 1-inbound-link count on every post.

---

## 9. Tracking

**GTM-5V37JFTD does not appear anywhere in this repository.** The container is env-driven:
`lib/tracking.ts:13` reads `process.env.NEXT_PUBLIC_GTM_ID`, and
`GoogleTagManager.tsx` returns `null` when it is empty. There is no `.env` file in the
checkout, so **the local production build ships no GTM at all** — I confirmed the crawled HTML
contains no `GTM-` string. Whether the container is live depends entirely on
`NEXT_PUBLIC_GTM_ID` being set in the hosting environment, which I cannot see from here.
I will not add the ID to code; see §12.

The install itself is correct and single: two raw inline `<script>` tags in `<head>`
(consent default first, then Google's verbatim snippet) plus the `<noscript>` iframe as the
first thing in `<body>`. Deliberately not `next/script` — the in-code rationale
(`GoogleTagManager.tsx:23-31`) about `beforeInteractive` deferring past the consent default is
correct.

**Conversion-action coverage:**

| Action | Event | Status |
|---|---|---|
| Phone click | `click_to_call` `{source}` | Tracked — `PhoneLink.tsx:47`, `MobileContactBar.tsx:52` |
| WhatsApp click | `whatsapp_click` `{source}` | Tracked — `WhatsAppLink.tsx:42`, `WhatsAppFloat.tsx:20`, `MobileContactBar.tsx:66` |
| Estimate form submit | `generate_lead` `{source, currency, value}` | Tracked, **on success only** |
| **Directions click** | — | **NOT TRACKED** |

The "Obtenir l'itinéraire" anchor (`[lang]/page.tsx:438-446`, href from `mapsUrl`) has no
`onClick` and no tracking call. It is the one missing conversion event.

**Form submit timing is already correct.** `QuoteForm.tsx:109-152`: the `pushEvent` at line 142
sits *after* `if (!res.ok) throw`, so a 429, a non-OK response, a thrown error or a network
failure all skip it. The repo's own tests assert this (`QuoteForm.test.tsx:161,229`). No change
needed.

Other events already firing: `form_start` (first field edit, guarded),
`scroll_75` (75% depth), `quote_calculator_used`, `email_click`.

**Search Console verification is already implemented** and env-driven:
`layout.tsx:56-58`, via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Nothing to add.

**There is no `TRACKING.md`.**

---

## 10. NAP consistency — and two live contradictions

`config/site.ts` is a genuine single source of truth and 21 files import from it, including
every structural surface: JSON-LD, sitemap, robots, header, footer, phone/WhatsApp/mail links.
This is already done properly.

**But three files carry their own copy of the business facts, and two have already drifted.**

### 🔴 `public/llms.txt` — publicly served, and contradicts the site on four facts

This file is served at `https://www.autosb2.com/llms.txt` and is written for AI answer engines.
It states:

| Field | `public/llms.txt` says | The site says | |
|---|---|---|---|
| Legal name | **B2 Autos Recycling** | Autos B2 | ❌ |
| Website | **https://b2autos.com** | https://www.autosb2.com | ❌ |
| Email | **info@b2autos.com** | admin@b2autos.com | ❌ |
| **Hours** | **Mon–Fri 08:00–20:00, Sat 09:00–17:00, Sun closed** | **7 days, 08:00–20:30** | ❌ |

It also directs quote requests to `https://b2autos.com/#quote`, a URL that does not exist on
this site. This is the single worst NAP problem in the repo: it is a crawlable file publishing
a different business name and different hours than every other page, to exactly the systems
that cite businesses without a click.

### 🔴 `convex/emails.ts` — a second BUSINESS object, already drifted

`convex/emails.ts:29-38` defines its own `BUSINESS` literal used to render the customer
confirmation email. It does not import `siteConfig`. Its email is **`info@b2autos.com`**
(vs `admin@b2autos.com` in config) and its url is **`https://b2autos.com`**. Customers
receive an email carrying a different address and domain than the site they submitted from.

### 🟡 `README.md:258` — an instruction that would break every canonical

```
NEXT_PUBLIC_SITE_URL=https://b2autos.com
```

`NEXT_PUBLIC_SITE_URL` overrides `siteConfig.url` (`config/site.ts:30`), which is stamped into
every canonical, hreflang, `og:url`, JSON-LD `url` and sitemap entry. Anyone following the
README would move the entire site's canonical identity onto a domain it is not served from.

### Structural hardcodes that should import from `siteConfig`

| file:line | Literal | What it is |
|---|---|---|
| `convex/emails.ts:29-38` | full NAP object | see above |
| `convex/emails.ts:27` | `admin@b2autos.com` | duplicates `siteConfig.leadInbox` default |
| `app/(admin)/admin/SignIn.tsx:52,54` | `"B2"`, `"Autos B2"` | file never imports `@/config/site` |
| `app/(public)/[lang]/[slug]/page.tsx:325` | `` `De Mascouche à ${city.name}` `` | H2 on every city page; file imports `siteConfig` but hardcodes the locality |
| `app/(public)/[lang]/[slug]/page.tsx:332-333` | `Trajet de notre cour de Mascouche…` | route-map iframe title, same issue |
| `app/(public)/[lang]/lp/[slug]/page.tsx:143-144` | `…d'Autos B2 …, à Mascouche` | hero alt, hardcodes name + locality |
| `lib/phone.test.ts`, `QuoteForm.test.tsx`, `route.test.ts` | real phone / `J7L 2W3` | test fixtures using the live number |

Prose occurrences of the address, hours and price range inside `content/*` are expected and
were counted, not flagged — they are human-written sentences, not structural duplicates. The
significant ones interpolate `siteConfig` already (e.g. `content/pages.ts:35,111,324`).

### ⚠️ The hours conflict you asked me to flag

You said Google's record for 340 Chemin Pincourt shows hours different from the advertised
"7 days, 8h–20h30". **I have not touched the hours and have not invented any.** What I can add
is that the conflict is not only external — **your own `public/llms.txt` already publishes a
third set of hours** (Mon–Fri 08:00–20:00, Sat 09:00–17:00, Sun closed). So there are currently
three answers in circulation: the site's, Google's, and your own llms.txt's. I need you to tell
me which is authoritative before I change anything. See §12.

### ⚠️ The domain mismatch you asked me to flag

Confirmed and worse than described. The site is `autosb2.com`; the email is `admin@b2autos.com`;
and **`b2autos.com` is also hardcoded as the canonical URL in `convex/emails.ts` and in
`public/llms.txt`, and recommended as `NEXT_PUBLIC_SITE_URL` in the README.** I have changed
nothing. See §12.

---

## 11. Performance, accessibility and crawlability

### Images

| Finding | Detail |
|---|---|
| `sizes` on responsive images | **Correct.** Both `fill` usages declare `sizes` (`lp/[slug]/page.tsx:149` `"100vw"`; `PhotoGrid.tsx:38` breakpoint-aware). The three logo `Image`s are fixed width/height, so `sizes` is not applicable. |
| `priority` | Homepage: exactly 1 (`page.tsx:204`, the hero, `quality={72}`). LP: exactly 1. **All 44 other routes: zero prioritised images** — none of them has a large above-fold image, so this is correct, not a gap. |
| Lazy loading below fold | Correct — `PhotoGrid` and the footer logo use the default lazy. |
| LP `priority` placement | `lp/[slug]/page.tsx:139-152` marks `priority` + `fetchPriority="high"` on an image that sits *after* the H1, sub, CTA, bullets and the quote form. It is almost certainly not the LCP element; the priority hint competes with what is. |
| Oversized files | 5 files >300 KB. **4 of the 5 are never referenced by any code**: `b2-tow-truck.png` (1335 KB), `nano-banana.png` (1242 KB), `tow-trackinng.webp` (471 KB), `scrapyar.jpg` (256 KB), `hero-image.jpg` (203 KB) — ~3.5 MB deployed and never served. The only oversized file in use is `hero-tow-truck.jpg` (431 KB), used as the OG image and the LP hero. |
| Alt text | No missing alt. Two intentional `alt=""` (the decorative homepage truck, `page.tsx:201`, and the Meta Pixel noscript pixel) — both correct. **No language mismatches:** every localised alt resolves through the page's own `lang`. |
| Duplicate alt | `SiteHeader.tsx:67` and `SiteFooter.tsx:36` both use the bare string `"Autos B2"` as alt for the same logo, and both render on every non-LP page — two images with identical generic alt per page. |

### CLS

- **All three Google Maps iframes already have `loading="lazy"`** (`page.tsx:466`,
  `[slug]/page.tsx:334`, `[slug]/page.tsx:672`). The brief's "defer the Maps embed" is done.
- **But none of the three has explicit `width`/`height` attributes** — they are sized only by
  Tailwind classes (`h-[300px] w-full`, `h-[320px] w-full`). The CSS does reserve the box, so
  real-world CLS is low, but the intrinsic-size attributes are absent.

### Fonts

- `next/font/google` (`layout.tsx:20`) — **self-hosted at build time**, `display: "swap"`,
  no request to `fonts.gstatic.com`, no `@font-face` and no remote `@import` anywhere. Good.
- 🟡 **`app/globals.css:66` sets `--font-sans: Outfit, sans-serif;`** — the raw family name,
  not `var(--font-outfit)` which is what the loader actually exposes. `<body>` gets
  `outfit.className` so body text is fine, but anything styled with Tailwind's `font-sans`
  utility resolves to a family name the browser does not have self-hosted, bypassing next/font's
  size-adjusted fallback metrics. That is a real (if small) layout-shift and consistency bug.

### Crawlability without JavaScript

**All primary content renders server-side.** The crawl captured full body text with scripts
stripped — 949 words on `/fr/`, 675 on the Mascouche city page, 785 on `/fr/faq/`. The FAQ
uses native `<details>`/`<summary>`, so answers are in the HTML even when collapsed. The quote
form's fields and labels are in the served markup. Fourteen components carry `"use client"`,
but all are interactivity wrappers (phone link, WhatsApp, form, mobile bar) around
server-rendered content — **nothing meaningful appears only client-side.**

### Link text

Descriptive throughout. `readMore` is `"Lire l'article"` / `"Read the article"` within a
context that names the article, and `serviceArea.linkLabel` is `"Voir la page de votre ville"`.
No bare "click here". No context-free "en savoir plus".

---

## 12. What actually needs fixing

Ordered by impact. Items marked 🛑 are blocked on a decision only you can make.

**Correctness / risk**

1. 🛑 **`public/llms.txt`** publishes a different business name, domain, email and **hours**.
   Blocked on the hours decision.
2. 🛑 **`convex/emails.ts`** has a drifted duplicate NAP (`info@b2autos.com`, `b2autos.com`)
   in customer-facing email. Blocked on the email decision.
3. **`README.md:258`** recommends an env value that would break every canonical on the site.
4. **No `b2autos.com` → `autosb2.com` and no non-www → www redirect** in the codebase.

**Indexation / schema**

5. Add `WebSite` (and an explicit `Organization`) node.
6. Add `BreadcrumbList` to the 10 pages that have a visible trail but no schema.
7. Add `image` to `Article`; add self-canonical + `fr-CA`/`x-default` hreflang to the 4 blog
   posts (they currently emit **zero** hreflang tags).
8. 🛑 `geo` coordinates — needs a real lat/lng from the GBP pin.

**Content**

9. **All 12 city pages are 268–381 unique words**, below the 400 target, and each has **one**
   FAQ question instead of two. Bois-des-Filion is weakest (268 words, 2 sectors).
10. 31 of 42 meta descriptions are under 140 characters, including **all 12 city pages**.
11. `/fr/contact/` and `/en/contact/` share an identical title.
12. One blog title is 63 characters; all 4 blog titles ship without the brand suffix, and the
    test that "covers" them tests a composition the page does not perform.

**Linking**

13. No in-body service↔city or service↔service links; blog posts have 1 inbound link each.

**Tracking**

14. `directions_click` event missing on the "Obtenir l'itinéraire" link.
15. No `TRACKING.md`.
16. 🛑 `NEXT_PUBLIC_GTM_ID` is not set locally and `GTM-5V37JFTD` is not in the repo — I cannot
    confirm the container is live. Confirm it is set in your host, or tell me to add it.

**Performance**

17. LP `priority` is on a below-the-fold image.
18. ~3.5 MB of unreferenced images in `public/`.
19. `--font-sans` names the raw family instead of the next/font variable.
20. Maps iframes lack intrinsic `width`/`height`.
21. One `og:image` for all 46 pages.

---

## 13. Questions I need answered before Phase 2

1. **Hours.** Three sets are in circulation (site: 7 days 8:00–20:30; `llms.txt`: Mon–Fri
   8:00–20:00 / Sat 9:00–17:00 / Sun closed; Google: different again). **Which is correct?**
   I will not guess, and I will not change the advertised hours without this.
2. **Email + domain.** Site is `autosb2.com`; contact email is `admin@b2autos.com`; `emails.ts`
   and `llms.txt` use `info@b2autos.com` and `b2autos.com`. **Which email is real, and do you
   own `b2autos.com`?** (The redirect rule depends on the answer.)
3. **Legal name.** `config/site.ts` says `Autos B2`; `llms.txt` says `B2 Autos Recycling`.
   Which is the registered name, and which is on the Google Business Profile?
4. **Yard coordinates.** Right-click the pin in Google Maps and paste me the lat/lng, and I'll
   fill in `geo` and complete the LocalBusiness schema.
5. **GTM.** Is `NEXT_PUBLIC_GTM_ID=GTM-5V37JFTD` set in your Vercel environment? If not, should
   I hardcode it as the default in `lib/tracking.ts`?
6. **City facts.** To get the city pages past 400 words honestly I need real local detail I do
   not have. Confirm you want me to **write the structure and leave clearly-marked `TODO`
   placeholders** for the parts only you know — I will not invent landmarks, testimonials or
   statistics.
7. **Canonical host.** Is the site served from `www.autosb2.com` or `autosb2.com`? The code
   assumes `www`. I'll enforce whichever you confirm.

---

*Audit complete. No files were modified. Awaiting go-ahead for Phase 2.*
