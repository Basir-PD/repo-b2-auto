# TODO

Open work on autosb2.com. Companion to `SEO_AUDIT.md` (what was found) and
`OFF_SITE_TODO.md` (what cannot be fixed in code).

Last updated: 2026-09-08.

---

## 1. NAP — the remaining gaps

On-site NAP is consistent and verified in the served HTML: name, address, phone,
hours and domain all match the Google Business Profile, and `geo` is read off the
GBP pin. What is still open:

- [ ] **`convex/emails.ts` holds a second copy of the NAP.** `BUSINESS` at
      `convex/emails.ts:29` hardcodes `name`, `legalName`, `phoneDisplay`,
      `phoneHref` and `address` as literals instead of importing `siteConfig`.
      It agrees with config today only because it was corrected by hand — the
      next NAP change will silently drift the customer confirmation email
      again, which is exactly how it ended up on `info@b2autos.com` and
      `b2autos.com` in the first place.
      *Note:* Convex runs in a separate runtime, so check whether it can import
      from `@/config/site` before assuming a plain import works.

- [ ] **Decide the email domain.** The site is `autosb2.com`; the mailboxes are
      `admin@b2autos.com` (config) and `info@b2autos.com` (confirmation email).
      Deferred on purpose. Not NAP in the strict sense, but any citation built
      from the email domain will list the wrong website.

- [ ] **Audit off-site citations.** Completely untouched and unknown. This is
      where NAP consistency is actually scored. Full list in
      `OFF_SITE_TODO.md` §3 — Yellow Pages/Pages Jaunes, 411.ca, Cylex,
      Foursquare, Apple Business Connect, Bing Places, Waze, Yelp, ARPAC.
      Search `"514 623-2787"` in quotes and fix anything showing a stale
      address, the old name, or `b2autos.com`.

- [ ] **`app/(admin)/admin/SignIn.tsx:52,54`** hardcodes `"B2"` and
      `"Autos B2"` and never imports `@/config/site`. Internal page, low
      priority, but it is the last structural hardcode.

- [ ] **Test fixtures use the live phone number** — `lib/phone.test.ts`,
      `components/site/QuoteForm.test.tsx`, `app/api/quote/route.test.ts`.
      Cosmetic; an arbitrary number would be safer.

---

## 2. Blocked — needs a decision or a value from the owner

- [ ] **Google review link.** `config/site.ts` → `GBP_REVIEW_LINK` is `""`.
      `components/site/ReviewLink.tsx` is built and renders nothing until it is
      set; both placements (footer, contact page) are wired and tested. Paste
      the URL and it goes live. Format: `https://g.page/r/<id>/review` or
      `https://search.google.com/local/writereview?placeid=<id>`.
- [ ] **The 5 review texts**, verbatim, with reviewer names as they appear
      publicly. `content/reviews.ts` is an empty array on purpose — the
      `AggregateRating` schema and the homepage reviews section both stay off
      until the reviews they summarise are visible on the page. Shipping a
      rating with nothing behind it is a manual-action risk.
- [ ] **GBP name: keep "Recyclage Autos B2" or revert to "Autos B2".** The site
      now corroborates the longer form (footer text, `legalName`,
      `alternateName`) without spending title characters on it. Fully compliant
      only if the name is also on the signage. See the discussion in
      `OFF_SITE_TODO.md` §1.
- [ ] **Confirm `NEXT_PUBLIC_GTM_ID=GTM-5V37JFTD` is set in Vercel.** The
      container ID is not in this repo and a local build ships no GTM at all.
      Unverifiable from here.
- [ ] **Confirm the full weekly GBP hours.** Signed-out Maps only exposes the
      current day. The site now says 7 days 08:00–20:00 everywhere; if the GBP
      varies by day, the site still mismatches on those days.
- [ ] **City-page local facts** — see §3. Confirm that gaps should ship as
      clearly-marked `TODO` placeholders rather than invented detail.

---

## 3. Content

- [ ] **City pages are 268–381 unique words** against a 400 target — every one
      of the twelve, and the file's own header comment claims "400+". Weakest:
      Bois-des-Filion (268 words, only 2 named sectors), Montréal-Est (287),
      Blainville (297). Needs real local detail; do not invent landmarks,
      testimonials or statistics.
- [ ] **One FAQ per city page, not two.** `content/cities.ts` has a single
      `faqQ`/`faqA` per city, and the `FAQPage` schema is a one-item array.
- [ ] **Saint-Eustache has no page.** Largest city served without one, and a
      different search market from the Terrebonne–Repentigny corridor.
- [ ] **Blog titles carry no brand suffix** while every other page does. Left
      as-is deliberately — the brand would force truncation on informational
      titles — but `content/metadata.test.ts` still asserts a `pageTitle()`
      composition the page never performs. Make the test assert what ships.
- [ ] `/fr/contact/` and `/en/contact/` share a byte-identical title.

---

## 4. Internal linking

- [ ] **Service pages have no in-body links to city pages, and city pages none
      back.** Every service↔city link on the site comes from the global footer,
      which carries far less weight and gives Google no signal about which city
      belongs with which service.
- [ ] **Blog posts have one inbound link each**, from the blog index only. They
      also link out to nothing but home, blog and the quote page.
- [ ] Blog is in the footer, not the header nav.

---

## 5. Tracking

- [ ] **No `directions_click` event.** The "Obtenir l'itinéraire" anchor
      (`app/(public)/[lang]/page.tsx:438`) has no `onClick` and no call into
      `lib/tracking.ts`. It is the one conversion action of the four with no
      event. Phone, WhatsApp and form submit are all covered — and the form
      correctly fires only on a successful response, not on click.
- [ ] **`TRACKING.md` does not exist.** Needs every event name and payload
      documented: `form_start`, `generate_lead`, `click_to_call`,
      `whatsapp_click`, `email_click`, `scroll_75`, `quote_calculator_used`.

---

## 6. Performance

- [ ] **`app/globals.css:66` sets `--font-sans: Outfit, sans-serif`** — the raw
      family name rather than `var(--font-outfit)`, which is what `next/font`
      actually exposes. `<body>` is fine via `outfit.className`, but anything
      using Tailwind's `font-sans` utility resolves to a family the browser does
      not have self-hosted, bypassing the size-adjusted fallback metrics.
- [ ] **LP `priority` is on a below-the-fold image** —
      `app/(public)/[lang]/lp/[slug]/page.tsx:139` carries `priority` +
      `fetchPriority="high"` on an image that sits after the H1, sub, CTA,
      bullets and the quote form. It is competing with the real LCP element.
- [ ] **~3.5 MB of unreferenced images in `public/`** — `b2-tow-truck.png`
      (1335 KB), `nano-banana.png` (1242 KB), `tow-trackinng.webp` (471 KB),
      `scrapyar.jpg` (256 KB), `hero-image.jpg` (203 KB). README already marks
      four as safe to delete.
- [ ] **Maps iframes have no intrinsic `width`/`height`** — all three are sized
      only by Tailwind classes. CSS reserves the box so real CLS is low, but the
      attributes are absent.
- [ ] **One `og:image` for all 46 pages** (`/hero-tow-truck.jpg`, 431 KB).

---

## 7. Indexation

- [ ] **`/lp/` pages emit no canonical.** They are `noindex` and
      `Disallow`-ed so this is defensible, but a self-referencing canonical
      costs nothing and protects against ad tracking parameters.
- [ ] **DNS/Vercel for the redirects.** The 301s in `next.config.ts` for
      `b2autos.com` and `www.b2autos.com` are inert until both domains are
      added to the Vercel project and pointed at it. Code alone cannot redirect
      a hostname that never reaches the app.
- [ ] **Verify in Search Console** on the apex `https://autosb2.com` now that
      the canonical host moved, and submit `/sitemap.xml`. Set
      `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — the meta tag is already wired and
      renders only when the env var is present.

---

## Done

Canonical host consolidated to the apex · 301s for the three other hostnames ·
`llms.txt` aligned on domain, legal name and service area · Saint-Eustache added
to the service area · `geo` filled from the GBP pin · `WebSite` and
`Organization` schema · `BreadcrumbList` on the 6 pages that were missing it ·
`Article` image · blog-post hreflang · all 12 city meta descriptions rewritten to
140–155 characters with real per-city distances · closing time corrected to
20:00 across 31 occurrences in 10 files · registered name stated in the footer
and schema without touching titles · review CTA built and gated.
