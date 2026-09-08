# OFF_SITE_TODO.md

Everything that affects ranking for **Autos B2 / Recyclage Autos B2, 340 Chemin Pincourt,
Mascouche, QC J7L 2W3** and **cannot be fixed in this repository**.

Stated goal: rank first, everywhere, within a 50 km radius of the yard, on Google and in
LLM answers.

---

> **Update 2026-09-08:** `OFF_SITE_AUDIT.md` now contains an actual audit of the
> off-site position rather than a generic checklist, and it changes the priority
> order at the bottom of this file. Two findings dominate: another business
> holds 340 Chemin Pincourt across every directory, and Autos B2 has
> essentially no citations at all. Read that first.

## 0. What is achievable, and what is not

This has to come first, because it decides where the effort goes.

**"First, always, everywhere in 50 km" is not achievable as stated**, and no amount of work
on this codebase changes that. The reason is structural, not a quality problem:

**Google's local pack ranks by proximity to the person searching, not to the business.**
Someone standing in Saint-Jérôme, Vaudreuil or Brossard searching "cour à scrap" gets the
yards near *them*. A Mascouche address cannot outrank a Brossard yard for a Brossard
searcher, no matter how good this site is. Proximity is the one major local ranking factor
that is physically fixed.

The furthest city page on this site is Saint-Lin-Laurentides at **28 km**. A 50 km radius is
roughly double that — it reaches Saint-Jérôme, Mirabel, most of the island of Montreal, and
starts touching the South Shore. Across most of that ring there are closer competitors.

**What is genuinely winnable:**

| Surface | Radius realistically winnable | Why |
|---|---|---|
| **Google local pack (map)** | ~0–20 km — Mascouche, Terrebonne, Lachenaie, La Plaine, Bois-des-Filion, Repentigny, Le Gardeur, Charlemagne | Proximity-bound. You are plausibly the closest licensed recycler for these. |
| **Google local pack, contested** | ~20–30 km — Laval, L'Assomption, Blainville, Rosemère, Sainte-Thérèse, Saint-Lin, Montréal-Est | Winnable with reviews + GBP activity, but there are closer yards. Expect top-3, not always #1. |
| **Google organic (blue links)** | **The full 50 km and beyond** | Organic is far less proximity-bound than the map pack. This is where the city pages and blog earn their keep, and where "first" is a realistic target. |
| **LLM / ChatGPT / Perplexity answers** | **No radius limit at all** | These do not rank by proximity. They cite whatever is consistent, structured and corroborated. This is the most winnable surface on the list and the least contested. |

So the honest reframing of the goal: **#1 in the map pack out to ~20 km, top-3 out to ~30 km,
#1 organic across the whole 50 km, and the default cited answer in LLMs with no radius limit.**
That is a strong position and it is reachable. "Always #1 everywhere" is not, and anyone
who tells you otherwise is selling something.

---

## 1. Google Business Profile — the single highest-impact item

**Nothing in this repo affects the map pack as much as the GBP does.** The site supports the
profile; it does not substitute for it.

- [ ] **Claim and verify the listing** if not already done. Unverified = effectively invisible
      in the pack.
- [ ] **Resolve the opening-hours conflict.** The site says 7 days, 08:00–20:30. You told me
      Google shows something different. `public/llms.txt` said a third thing until this week.
      **Google cross-checks hours against the site and treats a mismatch as a trust signal.**
      Decide the real hours, then tell me — the site reads them from one constant
      (`config/site.ts` → `hours`) and I will make every page and the schema match.
- [ ] **Confirm the business name matches exactly.** The site now declares trading name
      `Autos B2` and legal name `Recyclage Autos B2`. The GBP name must be the one you
      actually trade under, character for character. Do not keyword-stuff it
      ("Autos B2 Scrap Car Buyer Mascouche") — that is a suspendable violation and a common
      cause of ranking loss.
- [ ] **Primary category: `Auto wrecker`** (Épaviste / Casse automobile). Secondary:
      `Salvage yard`, `Used auto parts store`, `Towing service`. Primary category is one of
      the strongest pack signals; getting it wrong caps everything else.
- [ ] **Set the service area** to the cities in `content/copy` → `serviceArea.cities`.
- [ ] **Post the yard's real coordinates back to me.** Right-click the pin in Google Maps →
      copy lat/lng. `config/site.ts` has `geo: null` deliberately rather than a guessed pin;
      filling it completes the LocalBusiness schema.
- [ ] **Add real photos** — the yard, the flatbeds, the signage, the entrance from Chemin
      Pincourt. Geotagged if possible. Profiles with recent photos get materially more
      interaction.
- [ ] **Turn on messaging** and answer within minutes during posted hours.
- [ ] **Use GBP Posts weekly.** Cheap, ignored by most competitors, and it keeps the profile
      active.
- [ ] **Fill the Q&A section yourself** with the real questions from `content/faq.ts`. You are
      allowed to ask and answer your own. If you leave it empty, someone else fills it.

## 2. Reviews — currently the biggest single gap

You have **5 reviews averaging 5.0**. That is real but small. Review count and velocity are
among the strongest pack factors, and 5 is beatable by any competitor who asks.

- [ ] **Get the GBP "leave a review" short link** and send it to me. `config/site.ts` has
      `GBP_REVIEW_LINK: ""`, and every review-request button on the site stays hidden while
      it is empty. This is a one-line change that switches the whole flow on.
- [ ] **Send the 5 existing review texts to me**, verbatim, with the reviewer names as they
      appear publicly. `content/reviews.ts` is an empty array on purpose: until the real text
      is on the page, the `AggregateRating` schema stays suppressed. **Shipping a star rating
      that a visitor cannot see on the page violates Google's review-snippet guidelines and
      risks a manual action** — so the markup follows the data, not the other way round. Give
      me the 5 and the stars turn on legitimately.
- [ ] **Build an ask-every-time habit.** The driver has the customer's attention at the moment
      they have just been handed cash. That is the highest-conversion review moment you will
      ever get. A card with a QR code to the review link, handed over with the payment.
- [ ] **Target: 40+ reviews.** Steady beats spiky — a burst of 20 in a week reads as
      manipulation.
- [ ] **Reply to every review**, in the language it was written in. Replies are indexed.
- [ ] **Never buy reviews, never incentivise them.** One filtered batch can cost the profile.

## 3. Citations and NAP consistency

Google corroborates your address across the web. Every inconsistency dilutes it.

⚠️ **A specific risk here.** The contact email is `admin@b2autos.com` while the site is
`autosb2.com`. Any citation built from the email domain will list the wrong site. Audit for
this specifically.

- [ ] **Decide the `b2autos.com` question.** Do you own it? If yes, the 301s are already
      written in `next.config.ts` and only need the domain pointed at the project in Vercel.
      If no, that is a live risk — someone else can hold a domain confusingly close to yours.
- [ ] Core Canadian citations, NAP identical to the GBP character for character:
      Yellow Pages / Pages Jaunes, 411.ca, Cylex, Foursquare, Apple Maps (Apple Business
      Connect), Bing Places, Waze, Yelp.
- [ ] Quebec/industry-specific: **ARPAC** (Association des recycleurs de pièces d'autos et de
      camions), the SAAQ recycler listing, Kijiji Autos, LesPAC, RPM Web / auto-recycler
      networks.
- [ ] **Find and fix existing wrong listings.** Search the phone number `514 623-2787` in
      quotes and see what comes back with a stale address, an old name, or `b2autos.com`.
- [ ] **Get the legal name right everywhere**: `Recyclage Autos B2`.

## 4. Links

Local link equity, not volume. Ten relevant local links beat a thousand directory links.

- [ ] Chambre de commerce de Mascouche / Les Moulins, and the Terrebonne and Repentigny
      chambers.
- [ ] Ville de Mascouche business directory; the MRC Les Moulins economic development site.
- [ ] Local news and community: **Le Trait d'Union**, **La Revue de Terrebonne**,
      **L'Hebdo Rive-Nord**. Angle that is genuinely newsworthy: how many end-of-life vehicles
      you keep out of landfill, the depollution process, catalytic-converter theft.
- [ ] Reciprocal links with non-competing local trades — garages, body shops, towing
      companies who do not buy vehicles, insurance brokers handling write-offs. **Body shops
      and insurance adjusters are your best referral source and your best link source at the
      same time.**
- [ ] Sponsor something local with a web presence — a minor-hockey team, a community event.
- [ ] **Do not buy links.** This industry is heavily spammed and heavily scrutinised.

## 5. LLM and AI answer visibility

Least contested surface, no proximity limit, and largely already set up in code.

Already done in this repo: `/llms.txt` is served and now consistent on domain, legal name and
service area; `robots.txt` explicitly allows `GPTBot`, `OAI-SearchBot`, `PerplexityBot`,
`ClaudeBot` and `Google-Extended`; the FAQ and LocalBusiness JSON-LD are complete and match
visible copy.

What has to happen off-site:

- [ ] **Fix the hours in `llms.txt`.** It still says Mon–Fri 08:00–20:00, Sat 09:00–17:00, Sun
      closed, which contradicts every page on the site. This is the last remaining
      contradiction in the file and it is blocked on your decision.
- [ ] **Get cited on third-party pages.** LLMs largely retrieve from web search and from
      corroborated sources. A mention on a chamber-of-commerce page or in a local news article
      is worth more to an LLM answer than another page on your own site.
- [ ] **Be present where the training and retrieval data is**: Reddit (r/montreal, r/Quebec),
      Facebook Marketplace and local buy/sell groups, Kijiji. Answer real questions honestly
      as the business. Do not astroturf.
- [ ] **Wikidata entry** for the business, if it meets notability. Directly feeds knowledge
      graphs.
- [ ] Periodically **ask ChatGPT, Perplexity, Claude and Gemini** "who buys scrap cars in
      Mascouche / Terrebonne / Laval" and record what they say. That is the only real
      measurement of this surface, and it takes five minutes a month.

## 6. Measurement

- [ ] **Confirm `NEXT_PUBLIC_GTM_ID=GTM-5V37JFTD` is set in Vercel.** The container ID is not
      in this repo — it is env-driven — so the local build ships no GTM at all. I cannot see
      your Vercel environment. If it is not set, tracking is not running.
- [ ] **Verify the site in Google Search Console** (apex `https://autosb2.com`, now that the
      canonical host has moved) and submit `/sitemap.xml`. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
      — the meta tag is already wired up and renders only when the env var is present.
- [ ] **Verify in Bing Webmaster Tools** too. Bing feeds ChatGPT search.
- [ ] Track local pack position **by location, not sitewide** — a single "average position"
      number is meaningless for a business whose ranking varies by where the searcher stands.
      A local rank grid (Local Falcon, BrightLocal) shows the real picture and will show you
      exactly where the proximity ceiling in §0 begins.
- [ ] Watch GBP calls and direction requests as the primary conversion metric. For this
      business those matter more than sessions.

---

## 7. Not off-site — still open in the code

Tracked here so nothing gets lost between the two documents. Full detail in `SEO_AUDIT.md` §12.

**Blocked on you:** real opening hours · yard lat/lng · the 5 review texts · GBP review link ·
whether you own `b2autos.com` · confirmation that city-page gaps get marked `TODO` rather than
invented.

**Not blocked, ready to do:** city pages are 268–381 unique words against a 400 target and have
one FAQ each instead of two · 31 of 42 meta descriptions are under 140 characters · blog posts
emit zero hreflang · no `WebSite`/`Organization` JSON-LD node · `BreadcrumbList` missing on 10
pages that already show a visible trail · no in-body links between service and city pages ·
no `directions_click` event · `TRACKING.md` not written · ~3.5 MB of unreferenced images in
`public/`.

---

## Priority order

If only some of this happens, do it in this order — highest ranking impact per hour first:

1. **GBP claimed, verified, correct category, hours resolved** (§1)
2. **Reviews: get the link to me, then ask every single customer** (§2)
3. **Fix the hours contradiction across site, GBP and llms.txt** (§1, §5)
4. **Search Console + confirm GTM is live**, so everything after this is measurable (§6)
5. **Citation cleanup, especially anything carrying `b2autos.com`** (§3)
6. **City-page depth and internal linking** (§7 — I can start on this now)
7. **Local links** (§4)
8. **LLM presence and third-party mentions** (§5)

Items 1 and 2 will move the needle more than everything else on this list combined. Neither of
them is a code change.
