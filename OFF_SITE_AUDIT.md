# OFF_SITE_AUDIT.md

Off-site audit for **Autos B2 / Recyclage Autos B2, 340 Chemin Pincourt, Mascouche, QC J7L 2W3**,
run 2026-09-08. Companion to `SEO_AUDIT.md` (on-site) and `OFF_SITE_TODO.md` (the action list).

**Method.** Resolved the Google Business Profile from the owner-supplied Maps link; queried the
phone number and both business names; loaded PagesJaunes' Mascouche auto-recycling category in a
real browser and searched its DOM; fetched the live production site and its headers, DNS and
robots.txt directly.

**One caveat up front:** the search tool available here indexes US results, so Canadian
directory coverage may be under-represented. The PagesJaunes check, the DNS checks and the
live-site checks were done directly and are not subject to that limitation.

---

## Finding 1 🔴 — Another business owns this address across the entire web

**340 Chemin Pincourt, Mascouche, QC J7L 2W3** is listed in directory after directory as
**"Pièces d'Auto Christian 2007 Inc"**, phone **450-477-1050** (toll-free 800-363-8093),
described as auto recycling and used parts, roughly 40 employees.

Confirmed present on:

| Directory | Evidence |
|---|---|
| Yelp | `yelp.com/biz/pièces-d-auto-christian-2007-mascouche` — "340 Ch Pincourt, Mascouche", listing updated **December 2025**, i.e. current |
| Canpages | `canpages.ca/page/QC/mascouche/pieces-dauto-christian-2007-inc/3654245` — "340 Chemin Pincourt" |
| AnuGo | address returned verbatim as "340 ch pincourt / Mascouche, QC, J7L2W3", phone 450 477-1050 |
| ProfileCanada | "340 ch Pincourt, Mascouche, QC" |
| quebecpieces.com | listed as Mascouche recycling and parts |
| inforapide.com | Mascouche / Lanaudière directory entry |

**Why this is the most serious item in this audit.** Google's confidence that a business exists
at an address comes from corroboration across independent sources. Every independent source at
340 Chemin Pincourt currently names a *different business* with a *different phone number*.
Autos B2's own site is the only thing on the web asserting Autos B2 is there.

**I do not know which of these is true, and it changes the fix completely:**

1. **Same operation, older trading name.** Then the citations are not wrong so much as stale, and
   the job is to update them to the current name/phone, or deliberately keep both as related
   entities.
2. **Two genuinely separate businesses sharing the yard.** This is the hardest case. Google
   struggles with two businesses at one address and may merge or suppress one. Usually needs a
   distinguishing suite/unit number on one of them.
3. **A predecessor that sold or moved.** Then these are stale listings actively competing with
   you at your own address, and they need to be claimed and corrected or closed.

**This needs your answer before anything else off-site is worth doing.** Building new citations
for Autos B2 while a different name holds the address will produce conflict, not authority.

## Finding 2 🔴 — Autos B2 has effectively zero citations

- **Not on PagesJaunes.** Loaded the Mascouche "Recyclage-Automobile" category directly and
  searched the rendered DOM for `Autos B2` / `B2 Autos`: **no match**. The category is topped by
  *Scrapy Laval* (2225 Montée Masson, Laval) and *9433-3481 Qc Inc* (Sainte-Anne-des-Plaines).
  PagesJaunes/Yellow Pages is the single most important Canadian citation and you are absent from
  the one category that describes you, in your own town.
- **The phone number returns nothing.** A quoted search for `"514 623-2787"` surfaces no listing
  for this business anywhere.
- **The business name returns nothing.** Searches for `"Autos B2"` / `"Recyclage Autos B2"` with
  Mascouche, Terrebonne, recycling and scrap-car terms return competitors only.
- **The domain has no search footprint.** A search for `autosb2.com` returns unrelated sites.
- **No social profiles at all.** `config/site.ts` has `social: []`, so the schema emits no
  `sameAs` — there is nothing for Google to cross-reference the entity against.

## Finding 3 🟡 — Competitors are running the exact playbook, and ranking

The businesses surfacing for your target queries have dedicated per-city pages, the same
structure your site now has:

- `carscrapyard.ca/terrebonne/`
- `quebec.junkcarbin.com/en/scrap-yard-terrebonne/`
- `scraptonauto.ca/cour-a-scrap-terrebonne-quebec/`
- `scrapthisjunk.com/scrap-my-junk-car/Mascouche/`
- `recyclageauto.net` — Recyclage Excel, explicitly targeting "Terrebonne, Saint-Eustache,
  Mascouche" in one page
- `montrealautorecyclage.ca/cash-your-scrap-car-in-terrebonne/`
- `pieceautosnoel.com` — Pièces d'autos S. Noël, Terrebonne/Mascouche

Two things follow. Your on-site structure is **not** a differentiator — it is table stakes, and
several competitors already have it. And several of these are aggregators/lead-brokers rather
than yards, which is exactly the "we are the actual recycler, not a middleman" angle your copy
already makes. That angle is real and worth pushing, because it is true and they cannot copy it.

## Finding 4 🟢 — Things that are already right

- **Google Business Profile core data is accurate.** Name (`Recyclage Autos B2`), address, phone
  `(514) 623-2787`, website `autosb2.com`, and primary category **`Auto wrecker`** — the correct
  category, and it matters more than the name for which searches you appear in.
- **GTM-5V37JFTD is live.** Verified in the production HTML — `NEXT_PUBLIC_GTM_ID` is set in
  Vercel. This closes an open question from the on-site audit; tracking is running.
- **`b2autos.com` DNS already points at Vercel** (`216.198.79.1`), and currently returns 404
  because the domain is not attached to the project. So you control it, and the 301s already
  written in `next.config.ts` need only the domain added in the Vercel dashboard — no DNS work.

## Finding 5 🟡 — Configuration gaps on the live site

- **Search Console verification is NOT set.** No `google-site-verification` meta tag in the
  production HTML, so `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is empty in Vercel. Without GSC you
  have no indexation data, no query data, and no way to submit the sitemap.
- **Meta Pixel is not configured** — no `NEXT_PUBLIC_META_PIXEL_ID`. Fine if Meta ads are not
  running; a gap if they are.
- **The live site is still the pre-branch build.** It canonicalises to `www.autosb2.com`, ships
  `"closes":"20:30"`, and has no `geo`. Everything on the `seo/canonical-domain` branch — the
  apex switch, the corrected hours, the coordinates, the schema work — is unreleased.
- **The apex currently costs three redirects to reach content.** `https://autosb2.com/` →
  308 → `www` → 302 → `/fr` → 308 → `/fr/`. The branch reduces this, but it is live right now.

---

## What this changes about priorities

`OFF_SITE_TODO.md` put GBP and reviews first. That was right on general principle and wrong for
this specific business. Revised:

1. **Resolve the 340 Chemin Pincourt address conflict** (Finding 1). Nothing else off-site
   compounds until Google can attribute the address to you.
2. **Get listed on PagesJaunes**, then the rest of the core citations. You are absent from the
   most important Canadian directory in your own category and town.
3. **Reviews** — still the strongest ongoing pack signal, still only 5.
4. **Set up Search Console**, or all of the above is unmeasurable.
5. **Deploy the branch**, so the corrected hours, apex canonical and schema are actually live.
6. **Attach `b2autos.com` in Vercel** — DNS is already done, so this is a dashboard click.

---

## What I could not check

- Whether the GBP is **verified**, and whether it has photos, Posts or Q&A — needs dashboard access.
- **The real review count.** Signed-out Maps showed no rating at all, only a "Write a review"
  button. The 5 reviews / 5.0 in `config/site.ts` are unconfirmed from outside.
- **Full weekly GBP hours** — signed-out Maps exposes only the current day ("Closes 8 p.m.").
- **Backlinks** — needs a tool like Ahrefs or Semrush.
- **Actual rank by location** — needs a local rank grid (Local Falcon, BrightLocal). Rankings
  vary by where the searcher stands, so a single position number would be meaningless.
