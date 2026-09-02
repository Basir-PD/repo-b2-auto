# B2 Autos — b2autos.com

Bilingual (fr-CA / en-CA) lead-generation site for **B2 Autos**, a licensed auto
recycler and scrap-car buyer at **340 Chemin Pincourt, Mascouche, QC J7L 2W3**.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Convex (leads + admin) ·
deployed to Vercel. Every marketing page is statically generated.

---

## Where to change things

Everything below lives in **one** place. Nothing is hardcoded in components.

| What | Where |
|---|---|
| Phone number | `config/site.ts` → `siteConfig.phone` |
| Call-tracking (DNI) number | `config/site.ts` → `siteConfig.trackingPhone` — see below |
| Email | `config/site.ts` → `siteConfig.email` |
| Address / postal code | `config/site.ts` → `siteConfig.address` |
| Map coordinates | `config/site.ts` → `siteConfig.geo` — see below |
| Opening hours | `config/site.ts` → `siteConfig.hours` |
| Cash range ($300–$3,000) | `config/site.ts` → `siteConfig.facts.cashMin` / `cashMax` |
| Years in business, vehicles/year | `config/site.ts` → `siteConfig.facts` |
| Google review link | `config/site.ts` → `siteConfig.GBP_REVIEW_LINK` — see below |
| Real Google reviews | `content/reviews.ts` — see below |
| Where lead emails go | `config/site.ts` → `siteConfig.leadInbox` (env `LEAD_INBOX`) |
| SMS / WhatsApp webhook | env `LEAD_WEBHOOK_URL` — see below |
| Page copy | `content/copy/fr.ts` and `content/copy/en.ts` |
| FAQ | `content/faq.ts` (one source for the FAQ page, the homepage block and the schema) |
| Service pages | `content/services.ts` |
| City pages | `content/cities.ts` — see "Adding a city" |
| Blog articles | `content/blog.ts` |
| Ad landing pages | `content/landing.ts` |
| URL slugs, both languages | `config/routes.ts` → `ROUTES` |

---

## Things that are deliberately switched off

These are **not** bugs. Each is waiting on a real value, and each fails safe.

### Call tracking (DNI)

`siteConfig.trackingPhone` is `null`. The `usePhone()` hook returns the real
number for everyone, on the first render, server and client alike — so there is
no flash and no layout shift.

**To turn on:** buy a tracking pool, then set

```ts
trackingPhone: { e164: "+1XXXXXXXXXX", display: "+1 (XXX) XXX-XXXX", href: "tel:+1XXXXXXXXXX" },
```

Visitors arriving with a `gclid`, `wbraid`, `gbraid` or `fbclid` will then see
the tracking number. Nothing else needs changing.

### Google review link

`siteConfig.GBP_REVIEW_LINK` is `""`. Any "leave us a review" button stays
hidden while it is empty. Paste the short link from the Google Business Profile
("Ask for reviews" → copy link) to switch it on.

### Reviews and star ratings

`content/reviews.ts` exports an **empty array**. While it is empty:

- the reviews section does not render at all
- **no `AggregateRating` JSON-LD is emitted**

That second point is deliberate. Publishing a rating in structured data that a
visitor cannot see on the page violates Google's reviews-snippet guidelines and
risks a manual action. The markup follows the data, never the other way round.

**To turn both on:** paste the 5 real reviews into `REVIEWS`, verbatim, with the
reviewer's name exactly as it appears publicly on Google.

> **Never** invent a review, edit the wording, or add a sixth. The count is 5
> and the average is 5.0. The site says "5,0 ★ sur 5 avis Google" and nothing
> more — no "hundreds of customers", no volume language anywhere.

### Map coordinates

`siteConfig.geo` is `null`, so the `geo` block is omitted from the
`LocalBusiness` JSON-LD. A guessed pin is worse than no pin for local ranking.

**To fill:** open the Google Business Profile listing in Google Maps,
right-click the pin, copy the lat/lng, and set
`geo: { latitude: …, longitude: … }`.

---

## Image slots that still need real photography

Stock photos of shiny cars actively hurt credibility for a scrap business. The
site currently ships **one** real photo and uses icons everywhere else rather
than filling space with stock.

| File | Status | What it should be |
|---|---|---|
| `public/hero-tow-truck.jpg` | ✅ real | The company's own flatbed with a load on the deck |
| `public/scrapyar.jpg` | ⚠️ replace | The actual yard at 340 Chemin Pincourt |
| `public/b2-tow-truck.png` | ⚠️ unused | Delete or replace |
| `public/tow-trackinng.webp` | ⚠️ unused | Delete or replace |
| `public/nano-banana.png` | ⚠️ unused | Delete |
| _(missing)_ `public/team-mascouche.jpg` | ❌ needed | The team, on site — for `/fr/a-propos/` |
| _(missing)_ `public/yard-dismantling.jpg` | ❌ needed | Depollution / dismantling, for the recycling section |

Alt text is written in the page's own language and describes the scene, e.g.
`"Remorqueuse à plateau de B2 Autos chargée d'un véhicule, à Mascouche"`.

---

## Adding a city

One entry in `content/cities.ts`. The route, sitemap entry, hreflang cluster,
`areaServed` schema, footer link and internal links all follow automatically.

```ts
{
  key: "rosemere",
  name: "Rosemère",
  slug: { fr: "rachat-auto-rosemere" },     // add `en:` only if you write English copy
  distanceKm: 22,
  driveMinutes: 24,
  sectors: ["…"],
  landmark: "…",
  copy: { fr: { lede, worth, towing, vehicles, paperwork, faqQ, faqA } },
}
```

**Write genuinely unique copy.** The six blocks must not be the same paragraph
with the city name swapped — Google classifies that as doorway content and
filters the whole set, taking the good pages down with the bad. Each city needs
its own distance, its own arteries and sectors, its own pickup window.

A city with no `en` slug simply drops out of the English sitemap and emits no
English hreflang. That is correct: a false alternate breaks the entire cluster,
not just the missing side.

---

## Lead delivery

`POST /api/quote` → stored in Convex (which schedules the notification email) →
optional webhook.

Storing first means a mail or webhook outage costs a *notification*, never a
*lead* — it still appears in `/admin` either way.

Two kinds of submission arrive:

- **complete** — the form was submitted
- **partial** — someone typed a valid phone number and left. Sent via
  `sendBeacon`, stored and flagged `⚠️ FORMULAIRE ABANDONNÉ`. A phone number
  and a vehicle is enough to call someone back.

**Environment variables**

```bash
# .env.local (Next)
NEXT_PUBLIC_SITE_URL=https://b2autos.com
NEXT_PUBLIC_CONVEX_URL=            # written by `npx convex dev`
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX     # unset = no tags load at all
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
INGEST_SECRET=                     # optional, must match the Convex var
LEAD_INBOX=admin@b2autos.com
LEAD_WEBHOOK_URL=                  # Zapier/Make -> Twilio SMS or WhatsApp

# Convex deployment (`npx convex env set …`)
RESEND_API_KEY= QUOTE_FROM= QUOTE_INBOX= ADMIN_EMAILS=
```

`LEAD_WEBHOOK_URL` is what makes a five-minute callback possible. Point it at a
Zapier or Make hook that fans out to Twilio or WhatsApp. It is called with a
3-second timeout and its failure is logged, never surfaced — the lead is
already stored by then.

---

## The form

**Four inputs, one step:** vehicle · name · phone · postal code, plus the Law 25
consent checkbox.

Every field earns its place: the vehicle is what a price is calculated from, the
phone is the only way to deliver that price, the name is what we open the call
with, and the postal code confirms the address is inside the free-tow radius.
Everything else — email, condition, paperwork, whether it runs — is a question
for the callback, where it costs nothing, instead of a field on the page, where
it costs leads.

The consent checkbox is **not** a fifth input. Law 25 requires an explicit,
unchecked opt-in before anyone may be phoned or texted, so it is a legal control
rather than data being collected. It links to `/fr/politique-de-confidentialite/`.

Spam is handled by an off-screen honeypot plus per-IP rate limiting. There is no
visible CAPTCHA on purpose — it costs more conversions than the spam it stops.

---

## Tracking

All events go through GTM (`lib/tracking.ts`). Nothing loads until
`NEXT_PUBLIC_GTM_ID` is set.

`form_start` · `generate_lead` · `click_to_call` · `whatsapp_click` ·
`email_click` · `scroll_75` · `quote_calculator_used`

On submit the browser **navigates** to `/fr/merci/` (or `/en/thank-you/`), so a
real pageview conversion fires in Google Ads and Meta rather than relying on an
event alone. Those pages are `noindex` and disallowed in `robots.txt`.

**Attribution.** `lib/attribution.ts` captures `gclid`, `wbraid`, `gbraid`,
`fbclid`, `msclkid` and every `utm_*` on first paint and keeps them in
`sessionStorage`, first-touch wins. They ride along on the lead, which is what
makes an offline conversion upload possible months later when a deal closes.

### Law 25 consent

`components/site/CookieConsent.tsx` + Google Consent Mode v2.

Order matters and is the point: a **plain inline script** in `<head>` sets every
storage type to `denied` *before* the GTM container loads. The banner pushes an
`update` only on an explicit choice. Getting that order backwards is the most
common Law 25 failure.

"Tout refuser" is the same size, weight and prominence as "Tout accepter". That
symmetry is a legal requirement in Quebec, not a design preference. Granular
toggles: Nécessaires (locked on) / Analytiques / Marketing. The decision is
stored for 6 months, then the question is asked again.

---

## Routing

French is primary. `/` 302-redirects by `Accept-Language`, defaulting to French.

Slugs differ per language on purpose — `/en/rachat-auto-scrap/` would rank for
nothing. `config/routes.ts` holds the `ROUTES` registry; a stable key pairs the
two, and that key is what the language switcher and the hreflang tags resolve
against. The switcher links to the **equivalent page**, and returns `null` when
a page has no twin rather than dumping the visitor on the homepage.

There is deliberately **no `app/layout.tsx`**. `<html lang>` has to be correct in
the served HTML for both languages, and only a layout that can see the `[lang]`
segment can do that — so `app/(public)/[lang]/layout.tsx` is the root layout for
the site, and `app/(admin)/admin/layout.tsx` is a second one for the dashboard.

`/lp/` pages carry no header nav and no footer links, and are `noindex, follow`.
`components/site/SiteChrome.tsx` strips the shared chrome on those paths during
server rendering, so the header and footer are absent from the served HTML, not
just hidden after hydration.

---

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # static export of every marketing route
npm run lint
npx tsc --noEmit
```

## Hard constraints — do not break these

- **Never invent** statistics, review counts, ratings or customer names.
- The review count is **5**, the average is **5.0**. Never round up, never write
  "hundreds of satisfied customers" or any volume language.
- The address is **Mascouche**. Laval is a service area, never the address.
- The email is **admin@b2autos.com**.
- Hours are **8:00–20:30, seven days a week**, identical on every page and in
  the schema. They come from `siteConfig.hours`, so they cannot drift.
- **No social media icons or links** anywhere. `sameAs` is omitted from the
  JSON-LD entirely — an empty `sameAs` is worse than none.
- The copyright year is dynamic.
- No dead `#` links.
