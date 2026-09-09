# TODO

Open work on autosb2.com. Companion to `SEO_AUDIT.md` (on-site findings), `OFF_SITE_AUDIT.md` (off-site
findings, run 2026-09-08) and `OFF_SITE_TODO.md` (the off-site action list).

Last updated: 2026-09-09.

---

## 0. 🔴 Read `OFF_SITE_AUDIT.md` first

The off-site audit found that **340 Chemin Pincourt is listed across every major
directory as "Pièces d'Auto Christian 2007 Inc"**, phone 450-477-1050 — a
different business at your address — while Autos B2 has effectively zero
citations and is absent from PagesJaunes entirely. That outranks everything
below it in importance and needs a decision from the owner before other
off-site work is worth doing.

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

- [x] ~~Google review link.~~ **DONE — live.**
      `https://g.page/r/CdR6L4WXXsR5ECE/review`, taken from the profile's own
      "Ask for reviews" panel. Verified it resolves to
      `search.google.com/local/writereview` with place ID
      `ChIJewxBfUzdyEwR1HovhZdexHk`, so it opens the star dialog directly
      rather than a search result. Rendering in the footer and on both contact
      pages.
- [ ] **Review texts — there are currently ZERO reviews**, not five. The
      earlier note assumed five; the owner's profile shows none. `siteConfig.
      reviews` now reads 0/0 and `content/reviews.ts` stays empty, so the
      reviews section and the AggregateRating schema both stay off. Paste real
      ones as they arrive and both turn on together. Never a rating without
      the reviews behind it.
- [ ] **GBP name: keep "Recyclage Autos B2" or revert to "Autos B2".** The site
      now corroborates the longer form (footer text, `legalName`,
      `alternateName`) without spending title characters on it. Fully compliant
      only if the name is also on the signage. See the discussion in
      `OFF_SITE_TODO.md` §1.
- [x] ~~Confirm `NEXT_PUBLIC_GTM_ID` is set in Vercel~~ — **CONFIRMED LIVE.**
      `GTM-5V37JFTD` is present in the production HTML. Tracking is running.
- [x] ~~Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel.~~ **Not needed.**
      The owner registered a **Domain** property, which verifies by DNS, not by
      the HTML meta tag. The TXT record is already live on `autosb2.com`:
      `google-site-verification=446cMRhLX92UCeMXYo-wJyzFRFsiaR2LHdSvwNnuqGE`
      (nameservers are Namecheap, `dns1/dns2.registrar-servers.com`).
      The env var and its meta tag stay wired but unused; setting it would
      change nothing. A Domain property is the better choice here anyway — it
      covers the apex, `www` and any subdomain in one, which matters given the
      apex→www redirect.
- [ ] **City-page local facts** — see §3. Confirm that gaps should ship as
      clearly-marked `TODO` placeholders rather than invented detail.

---

## 3. Content

- [ ] **City pages are 248–380 unique words** against a 400 target — all
      eighteen of them, and the file's own header comment claims "400+".
      Weakest: Bois-des-Filion (268 fr / 248 en, only 2 named sectors),
      Montréal-Est (287 / 284), Blainville (297 / 262). Needs real local
      detail; do not invent landmarks, testimonials or statistics.
- [ ] **One FAQ per city page, not two.** `content/cities.ts` has a single
      `faqQ`/`faqA` per city, and the `FAQPage` schema is a one-item array.
- [ ] 🔴 **24 of the 33 served municipalities have no page.** The owner
      confirmed the real territory on 2026-09-08 and it is much wider than the
      site had: the Lower Laurentians (Saint-Jérôme, Mirabel, Boisbriand,
      Sainte-Sophie, Saint-Eustache, Pointe-Calumet), the West Island
      (Dollard-des-Ormeaux, Kirkland, Beaconsfield, Dorval, Côte-Saint-Luc,
      Westmount) and the South Shore (Varennes, Boucherville). All 33 now
      appear in `content/service-area.ts`, in both `areaServed` nodes, on the
      homepage and in the footer — but a coverage claim is not a page, and it
      is the page that ranks for "cour à scrap Saint-Jérôme".
      Highest-value missing pages, by search volume and by distance from the
      yard: **Saint-Jérôme, Saint-Eustache, Boisbriand, Mirabel** (a real
      Laurentians cluster, none of it covered), then
      **Dollard-des-Ormeaux / Dorval** for the West Island anglophone market,
      which searches in English. Each new city now costs two pages, not one:
      as of 2026-09-09 every city ships in both languages and a test enforces
      it.
      Blocked on real local detail: each page needs its own sectors, arteries
      and pickup window. Do not template these; Google filters doorway sets.
- [ ] **Blog titles carry no brand suffix** while every other page does. Left
      as-is deliberately — the brand would force truncation on informational
      titles — but `content/metadata.test.ts` still asserts a `pageTitle()`
      composition the page never performs. Make the test assert what ships.
- [ ] `/fr/contact/` and `/en/contact/` share a byte-identical title.

---

## 4. Internal linking

- [x] ~~Service pages have no in-body links to city pages, and city pages none
      back.~~ **Done.** `components/pages/CrossLinks.tsx` adds a "Where we
      offer this" block to every service page and a "Our services in {city}"
      block to every city page. Anchor text names both halves — "Remorquage
      gratuit de véhicule à Laval", not "Laval" — because the anchor is the
      signal. Measured before and after: a service page went from 1 in-body
      link to 10, a city page from 9 to 13.
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

- [x] ~~`--font-sans` was the literal family name, not `var(--font-outfit)`.~~
      **Done in 782da81.** Every Tailwind `font-sans` utility was falling
      through to the generic sans-serif and skipping next/font's size-adjusted
      fallback metrics.
- [x] ~~LP `priority` on a below-the-fold image.~~ **Done in 782da81.** It was
      competing with the real LCP element on the one page type where the first
      paint is bought and paid for.
- [x] ~~~3.5 MB of unreferenced images in `public/`.~~ **Done in 782da81.**
      Five files, 3.43 MB. `public/` is now 1.2 MB.
- [ ] **Maps iframes have no intrinsic `width`/`height`** — all three are sized
      only by Tailwind classes. CSS reserves the box so real CLS is low, but the
      attributes are absent.
- [ ] **One `og:image` for all 46 pages** (`/hero-tow-truck.jpg`, 431 KB).

---

## 7. Indexation

- [ ] **`/lp/` pages emit no canonical.** They are `noindex` and
      `Disallow`-ed so this is defensible, but a self-referencing canonical
      costs nothing and protects against ad tracking parameters.
- [x] ~~Attach `b2autos.com` in the Vercel dashboard.~~ **Decided against —
      the owner is retiring the domain.** Everything is on `autosb2.com`,
      including the mailbox, which moved to `admin@autosb2.com`.
      The 301s for `b2autos.com` and `www.b2autos.com` stay in
      `next.config.ts`. They are inert while the domain is unattached and cost
      nothing, and they are the safety net if anything out there still links
      to the old host. Delete them only once the domain has lapsed and stopped
      resolving.

- [x] ~~Verify in Search Console.~~ **DONE — verified 2026-09-08.** A Domain
      property on `autosb2.com`, verified by the DNS TXT record, so it covers
      the apex, `www` and every subdomain at once. Confirmed live in the
      console: Performance, Indexing and Experience panels all present and
      reading "Processing data, please check again in a day or so", which is
      the normal state for a property with no history yet.
- [x] ~~Submit `/sitemap.xml` in Search Console.~~ **DONE — 2026-09-08.**
      Submitted as the full URL `https://www.autosb2.com/sitemap.xml`; a Domain
      property has no host prefix in the box, so the short form does not work.
      Status: **Success**, 40 discovered pages, read the same day.
      *The sitemap is now 46 URLs* — the six new English city pages. Google
      re-reads a submitted sitemap on its own; no resubmission needed.
- [ ] **Come back in a few days** for the first real numbers. Pages tells you
      how many of the 40 URLs are indexed; Performance gives queries and
      average position — the first time any ranking question on this project
      is answerable with data rather than inference.

---

## Done

Canonical host consolidated to the apex · 301s for the three other hostnames ·
`llms.txt` aligned on domain, legal name and service area · Saint-Eustache added
to the service area · `geo` filled from the GBP pin · `WebSite` and
`Organization` schema · `BreadcrumbList` on the 6 pages that were missing it ·
`Article` image · blog-post hreflang · all 12 city meta descriptions rewritten to
140–155 characters with real per-city distances · closing time corrected to
20:00 across 31 occurrences in 10 files · registered name stated in the footer
and schema without touching titles · review CTA built and gated · the six French-only city pages given English twins,
taking the sitemap from 40 to 46 URLs and closing the nine-vs-three link gap on the
English homepage.
