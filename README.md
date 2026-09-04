# Autos B2 — b2autos.com

Bilingual (fr-CA / en-CA) lead-generation site for **Autos B2**, a licensed auto
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

## Before ads can run — what YOU still have to set

Everything below is a value to paste, not code to write. Copy `.env.example`
to `.env.local` for dev and set the same keys in Vercel for production.

| Variable | Where to get it | What breaks without it |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager → container ID, `GTM-XXXXXXX` | **No tag loads at all.** No GA4, no Google Ads conversions, no events. Ads run blind. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Events Manager → dataset ID | No Meta pixel, no Lead events, no Advantage+ optimisation. |
| `NEXT_PUBLIC_TRACKING_PHONE_E164` + `_DISPLAY` | Your call-tracking provider's pool number | DNI stays off; everyone sees the real number and calls cannot be attributed to a click. Both must be set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console → HTML tag method | Cannot verify the property. |
| `LEAD_WEBHOOK_URL` | Zapier/Make hook → Twilio SMS or WhatsApp | Leads still store and email, but nobody gets pinged to call back within five minutes. |
| `NEXT_PUBLIC_CONVEX_URL`, `INGEST_SECRET` | `npx convex dev` | **The form returns 503 and leads are lost.** |

### Then, inside the ad platforms

**Google Ads**
1. Create a conversion action of type *Website*, triggered on a pageview of
   `/fr/merci/` and `/en/thank-you/`. These pages are `noindex` and only
   reachable after a submit, so they are a clean conversion signal.
2. Create a second conversion action for `click_to_call`, which the dataLayer
   already fires from every phone link on the site.
3. Import both into the campaign and let Smart Bidding see at least ~30
   conversions before judging it.
4. Offline conversion import: every lead carries the `gclid` / `wbraid` /
   `gbraid` captured first-touch, so a closed deal can be uploaded back
   against the original click months later.

**Meta**
1. In Events Manager, confirm `PageView`, `Lead` and `Contact` arrive. The
   pixel fires `Lead` on form submit and `Contact` on a phone tap.
2. **Conversions API is NOT built.** The pixel alone loses a meaningful share
   of iOS conversions. This is the one real code gap left — see below.

### Known gaps

- **Meta Conversions API** — specified in the original brief, not
  implemented. `/api/quote` already has the lead server-side and already
  posts to a webhook, so CAPI belongs there; it is a few hours of work.
- **Partial-lead capture has no consent behind it.** When someone types a
  valid phone number and leaves without submitting, `sendBeacon` still sends
  it and it is stored. That person never ticked the consent box, so the lead
  is stamped `⚠️ AUCUN CONSENTEMENT ENREGISTRÉ` and should be treated as an
  analytics signal, not a call list. Calling them is the weakest thing on
  this site legally — weaker than anything the consent checkbox covers. To
  switch it off, delete the `flushPartial` effect in
  `components/site/QuoteForm.tsx`.

## Logo

`public/logo-autob2.png` — derived from the supplied `logo.jpeg` by trimming
the white surround and keying white to transparent, because a JPEG on solid
white shows as a white block on any non-white surface.

Used in the site header and the landing-page header, both of which are white.
**Not** in the footer: the logo's navy measures about 1.3:1 against the
near-black footer and disappears. The footer uses a wordmark until a white
knockout version exists.

`app/icon.svg` is the favicon, in the logo's own navy (`#0A3D82`) sampled from
the artwork. It is a "B2" mark rather than the full logo because the wordmark
is illegible at 16px.

> **Three identities are currently in play** and they should be reconciled
> before ads run: the logo says **AUTO B2**, the site and schema say
> **Autos B2**, and the truck door says **AUTOS B2**. Google cross-checks the
> site's name against the Google Business Profile, and ad copy has to match
> the landing page. Pick one and change `siteConfig.name`.
>
> The logo is also **blue** while the whole UI is **green** (`#206735`).
> Re-tokenising to the logo's blues is a contained change — every colour comes
> from `--brand-*` in `app/globals.css` — but it is a brand decision, not a
> code one.

## Photography

Six real photographs of the fleet live in `public/photos/`, listed in
`content/photos.ts`. Fifteen were supplied; six are used. The rest repeat the
same truck at the same angle on the same kind of day, and a gallery that
repeats itself reads as padding rather than evidence.

Each one is there because it **proves a claim the copy makes**:

| File | Proves |
|---|---|
| `attache-vehicule-plateau.jpg` | A real person doing the work — the strongest signal in the set |
| `transport-multi-vehicules.jpg` | Scale: five cars on one hauler, behind the 2,000/year figure |
| `enlevement-soir-residentiel.jpg` | The 8:30pm hours are real |
| `plateau-vus-charge.jpg` | Our own flatbed, not a subcontractor |
| `remorquage-chariot-elevateur.jpg` | "Any vehicle, no exceptions" |
| `remorquage-soir-berline.jpg` | Same-day, after-hours pickup |

**Where they appear:** three on the homepage, all six on `/a-propos/`,
both below the fold. **None in the hero and none on a `/lp/` page** — the
hero image is the LCP element and the landing pages exist to load fast.

**To add one:** drop the file in `public/photos/`, add an entry to
`content/photos.ts` with alt text and a caption in both languages. Resize to
1200px wide first — that is DPR-2 for the widest slot these ever render in,
and anything larger is bytes nobody sees.

Rules that keep them free: lazy (never `priority`), `quality={55}`, a fixed
aspect-ratio box so they cannot shift the layout, and a `sizes` string that
matches the grid. A phone downloads about 5 KB each at those settings.

### Still missing

| Slot | Status |
|---|---|
| Logo, white knockout | The supplied logo is navy on white. Its navy sits at ~1.3:1 on the footer, so the footer uses a wordmark instead. A white/knockout PNG would let the logo appear there too. |
| Logo, vector | The supplied file is a 500x500 JPEG whose actual artwork is only 289x109. Fine for the header at 44px tall; anything larger needs the original SVG or AI file. |
| `public/scrapyar.jpg` | Generic yard photo. Replace with the actual Mascouche yard. |
| `public/b2-tow-truck.png`, `nano-banana.png`, `tow-trackinng.webp`, `hero-image.jpg` | Unused. Safe to delete. |

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

The consent checkbox is **not** a fifth input. Law 25 requires consent that is
manifest, free and enlightened, asked for separately from everything else — so
it gets its own unchecked control and the submit will not pass without it.

It is enforced **server-side as well**, in `app/api/quote/route.ts`. A check
that only runs in the browser is a convenience for the visitor, not a record,
and the burden of proving consent falls on us. Every complete lead is stored
with a `Consentement accordé le <ISO timestamp>` line, which is that record.

The privacy policy is linked in the last row of the footer on every page,
including the landing pages, rather than inline in the label.

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
