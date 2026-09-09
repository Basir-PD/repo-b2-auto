# START HERE

Pick-up point for the autosb2.com SEO work. Last session: **2026-09-08**.

**`main` is at `2cfc036`, deployed, and the site is UP and verified.**

## 🔴 Read this before touching redirects or the canonical host

An earlier commit in this session moved the canonical host to the apex
`autosb2.com` and added a `www → apex` redirect. **It took the entire site down.**

Vercel redirects the apex to `www` at the DOMAIN level, before a request reaches
the app. The code redirected `www` back to the apex. The two pointed at each other:

```
autosb2.com/fr/      → 308 → www.autosb2.com/fr/   (Vercel domain setting)
www.autosb2.com/fr/  → 301 → autosb2.com/fr/       (next.config.ts)
```

Infinite loop on every page. Reverted in `2cfc036`; recovery deploy took ~60s.

**The canonical host is `https://www.autosb2.com` and it must stay that way** unless
the Vercel domain setting is flipped FIRST. Both `config/site.ts` and
`next.config.ts` carry a warning comment. Do not re-add a redirect for a hostname
Vercel is already redirecting — check Project → Settings → Domains first.

Lesson worth keeping: the redirect rules were verified with `Host` headers against a
local `next start`, where Vercel's domain layer does not exist. That test could never
have caught this. **Host-level redirects have to be checked against production.**

## 1. Paste this to start

Copy the block below into a new session. Fill in the answers you have; leave the rest as
`STILL DON'T KNOW` and it will work around them.

```
Continuing SEO work on autosb2.com. Read START_HERE.md, TODO.md, SEO_AUDIT.md and
OFF_SITE_AUDIT.md first — do not re-audit, it is all done.

State: merged to main and DEPLOYED. main is at 2cfc036. Site is UP and
verified in production. Build passes, npm run verify passes, 101 tests green.
Run `npm install` first — node_modules in a fresh clone is incomplete without it.

⚠️ The canonical host is https://www.autosb2.com. An apex migration was tried
this session and caused a site-wide redirect loop (Vercel redirects apex→www at
the domain level; the code redirected www→apex). It was reverted. Do NOT re-add
a www→apex redirect unless the Vercel domain setting is flipped first. See the
warning at the top of START_HERE.md and the comments in config/site.ts and
next.config.ts.

Answers to your open questions:

1. PIÈCES D'AUTO CHRISTIAN at 340 Chemin Pincourt — the situation is:
   [ same company, old name / separate business sharing the yard /
     previous owner who left / STILL DON'T KNOW ]

2. Google review link:
   [ paste URL or STILL DON'T KNOW ]

3. The 5 Google review texts + reviewer names:
   [ paste, or STILL DON'T KNOW ]

4. Full weekly GBP hours (site currently says 7 days 08:00-20:00):
   [ e.g. Mon-Fri 8-20, Sat 8-17, Sun closed / same 7 days / STILL DON'T KNOW ]

5. GBP name — keeping "Recyclage Autos B2" or reverting to "Autos B2"?
   [ keeping + putting it on the sign / keeping, no sign change /
     reverting / STILL DON'T KNOW ]

6. Do we serve Saint-Eustache? (already added to the service area — confirm)
   [ yes / no ]

Priority for this session: [ pick from the list in START_HERE.md §4 ]
```

---

## 2. What I need from you, and why each one matters

| # | Question | Why it is blocking |
|---|---|---|
| 1 | **What is Pièces d'Auto Christian?** | Every directory lists it at *your* address with a different phone. Google can't attribute 340 Chemin Pincourt to you while that's true. The fix is completely different depending on the answer, so nothing off-site should start until it's known. **Biggest item in the whole project.** |
| 2 | **Google review link** | `GBP_REVIEW_LINK` is `""`. The review CTA is built, gated and hidden until it's set. One-line change. |
| 3 | **The 5 review texts** | `content/reviews.ts` is an empty array on purpose. No review text on the page = no star rating in schema, because shipping a rating nobody can see risks a manual action. Give me the 5 and the stars turn on legitimately. |
| 4 | **Full weekly GBP hours** | Site now says 7 days 08:00–20:00 everywhere. Signed-out Maps only showed today ("Closes 8 p.m."), so if your GBP varies by day, the site still mismatches on those days. |
| 5 | **GBP name decision** | Site already corroborates "Recyclage Autos B2" in the footer and schema without spending title characters. Only fully compliant if it's also on the signage. |
| 6 | **Saint-Eustache** | Already added on your say-so. Just confirming, since it appears in the schema and on the homepage now. |

Two things you can do **without me**, and they matter more than any code:

- **Ask every customer for a review** when the driver hands over the cash. You have 5. That
  is the single biggest thing holding back the 20 km ring.
- **Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel** and verify Search Console on the
  apex `https://autosb2.com`. Right now you have no indexation or query data at all.

---

## 3. Where things stand

**Done and committed** (all verified in the served HTML, not assumed):

- Canonical host consolidated to the apex `autosb2.com`; 301s for `www.autosb2.com`,
  `b2autos.com`, `www.b2autos.com`, single-hop, path and query preserved
- 684 absolute URLs checked — zero off-domain
- Closing time corrected to **20:00** across 31 occurrences in 10 files
- `geo` filled from the GBP pin (45.7421284, -73.6730281)
- `WebSite` + `Organization` schema, `BreadcrumbList` on 6 pages that were missing it,
  `Article` image, blog-post hreflang (they had none at all)
- All 12 city meta descriptions rewritten to 140–155 chars with real per-city distances
- Registered name stated in the footer and schema, deliberately **not** in titles
- `llms.txt` aligned on domain, name, hours and service area
- Review CTA built and gated on `GBP_REVIEW_LINK`
- Saint-Eustache added to the service area

**Confirmed working:** GTM-5V37JFTD is live in production. `b2autos.com` DNS already points
at Vercel — attaching it is a dashboard click, not a DNS change.

**Confirmed broken/missing:** no Search Console verification. No PagesJaunes listing. No
citations anywhere. Another business holds the address online.

---

## 4. Suggested next moves

Pick one and name it in the prompt:

1. **Search Console + the two dashboard tasks.** Set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel, verify
   `https://www.autosb2.com` in Search Console and submit `/sitemap.xml` — there
   is currently no indexation or query data at all. Then attach `b2autos.com` in
   the Vercel dashboard; its DNS already resolves to Vercel and it 404s only
   because it is not attached, so the 301s already in the code go live the moment
   it is.
2. **`convex/emails.ts` NAP import.** It still holds a second hardcoded copy of the business
   facts; it agrees with config only because it was fixed by hand. Next change drifts the
   customer email again.
3. **Internal linking.** Service pages have no in-body links to city pages and vice versa —
   everything goes through the footer today.
4. **City page depth.** All 12 are 268–381 unique words against a 400 target, one FAQ each
   instead of two. Needs real local detail from you; I will not invent landmarks or stats.
5. **`directions_click` event + `TRACKING.md`.** Last untracked conversion action, and the
   event docs do not exist.
6. **Performance batch.** `--font-sans` points at the wrong variable, LP `priority` is on a
   below-fold image, ~3.5 MB of unreferenced images in `public/`.

---

## 5. The documents

| File | What it is |
|---|---|
| `START_HERE.md` | This file. Resume point. |
| `TODO.md` | The working list of everything still open, grouped by area, with file:line refs. |
| `SEO_AUDIT.md` | On-site audit of all 46 routes. Read from the served HTML, not the source. |
| `OFF_SITE_AUDIT.md` | Off-site audit. The address conflict and the citation gap. |
| `OFF_SITE_TODO.md` | Off-site action list — GBP, reviews, citations, links, LLM visibility. Also has the honest ceiling on "rank #1 everywhere in 50 km". |

---

## 6. House rules that carried over

- Never invent business facts. No fake reviews, awards, counts, local details or
  certifications. Where real information is missing, ship a marked `TODO`.
- Do not change a customer-facing claim, price range, guarantee or phone number without
  asking.
- French is Quebec French and stays that way.
- `npm run build` and `npm run verify` after each commit.
- Small commits, one topic each.
- The contact email stays on `b2autos.com` — that split is deliberate and pending a separate
  decision. Do not "fix" it to match the domain.
