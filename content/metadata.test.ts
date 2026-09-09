import { describe, expect, it } from "vitest";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX, fitDescription, pageTitle } from "@/lib/seo";
import { getCopy } from "@/content/copy";
import { SERVICES } from "@/content/services";
import { ABOUT, CONTACT, PRIVACY, TERMS } from "@/content/pages";
import { siteConfig } from "@/config/site";
import { CITIES } from "@/content/cities";
import { SERVED_CITIES } from "@/content/service-area";
import { POSTS } from "@/content/blog";

const LANGS = ["fr", "en"] as const;

/*
 * Every title and description that ships has to fit what a search result
 * renders. 29 of 36 routes were over before this existed — titles ran to 89
 * characters and the brand was appended twice — and nothing caught it,
 * because nothing was looking.
 *
 * These specs check the copy at its source, which is where it is written and
 * where a regression starts.
 */
function checkTitle(label: string, title: string) {
  const composed = pageTitle(title);
  expect(composed.length, `${label} → "${composed}" (${composed.length})`).toBeLessThanOrEqual(
    TITLE_MAX
  );
  // The brand is appended once, by pageTitle, and never written into the copy.
  expect(title, `${label} should not carry the brand itself`).not.toMatch(/Autos B2|B2 Autos/);
}

function checkDescription(label: string, description: string) {
  expect(description.length, `${label} (${description.length})`).toBeLessThanOrEqual(
    DESCRIPTION_MAX
  );
  // A description Google will not render is a description nobody wrote.
  expect(description.length, `${label} is suspiciously short`).toBeGreaterThan(50);
}

describe("business facts have one source", () => {
  /*
    convex/emails.ts used to restate the NAP by hand and had already drifted:
    the confirmation email said info@b2autos.com while every page said admin@.
    It now derives from config/site.ts. This asserts it stays that way, since
    the failure is invisible — nobody reads their own confirmation email.
  */
  it("the confirmation email derives its facts from config, not a copy", async () => {
    const src = await import("node:fs").then((fs) => fs.readFileSync("convex/emails.ts", "utf8"));
    expect(src).toMatch(/from "\.\.\/config\/site"/);
    // No hardcoded address literals left in the email template.
    expect(src).not.toMatch(/@(b2autos|autosb2)\.com"/);
  });

  /*
    public/llms.txt is the one file on the site that cannot derive anything —
    it is static text, and it is what an LLM reads when asked about this
    business. It had gone stale exactly where it hurts: it still advertised
    08:00–20:00 four hours after the real hours changed, and pointed at the
    non-canonical apex. Both are silent failures, because nothing renders it.
  */
  it("llms.txt agrees with config on hours, phone, email and canonical host", async () => {
    const src = await import("node:fs").then((fs) => fs.readFileSync("public/llms.txt", "utf8"));
    expect(src).toContain(`${siteConfig.hours.opens}\u2013${siteConfig.hours.closes}`);
    expect(src).toContain(siteConfig.phone.display);
    expect(src).toContain(siteConfig.email);
    expect(src).toContain(siteConfig.url);
    // The apex is a redirect. Every URL in here has to be the canonical host.
    expect(src).not.toMatch(/https:\/\/autosb2\.com/);
  });

  /*
    The service area is a coverage claim, so the human-readable list and the
    machine-readable one have to be the same list. They live in different
    files by necessity — llms.txt is static — which is precisely why this is
    asserted rather than assumed.
  */
  it("llms.txt names every city in the service area", async () => {
    const src = await import("node:fs").then((fs) => fs.readFileSync("public/llms.txt", "utf8"));
    // llms.txt is written unaccented for tokeniser-friendliness; compare folded.
    const fold = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "");
    const folded = fold(src);
    for (const city of SERVED_CITIES) {
      expect(folded, `llms.txt is missing ${city}`).toContain(fold(city));
    }
  });
});

describe("homepage metadata", () => {
  for (const lang of LANGS) {
    it(`${lang}: fits a search result`, () => {
      const t = getCopy(lang).home;
      // The homepage title is used as-is, so it carries the brand itself.
      expect(t.metaTitle.length).toBeLessThanOrEqual(TITLE_MAX);
      checkDescription(`${lang} home`, t.metaDescription);
    });
  }
});

describe("service pages", () => {
  for (const service of SERVICES) {
    for (const lang of LANGS) {
      it(`${service.key} (${lang})`, () => {
        checkTitle(`${service.key} ${lang}`, service.metaTitle[lang]);
        checkDescription(`${service.key} ${lang}`, service.metaDescription[lang]);
      });
    }
  }
});

describe("static pages", () => {
  const pages = { ABOUT, PRIVACY, TERMS, CONTACT };
  for (const [name, page] of Object.entries(pages)) {
    for (const lang of LANGS) {
      it(`${name} (${lang})`, () => {
        checkTitle(`${name} ${lang}`, page.metaTitle[lang]);
        checkDescription(`${name} ${lang}`, page.metaDescription[lang]);
      });
    }
  }
});

describe("city pages", () => {
  // The template is what matters here: a name like Saint-Lin-Laurentides is
  // 21 characters before the sentence around it starts.
  for (const city of CITIES) {
    it(`${city.name} fits both title templates`, () => {
      const fr = pageTitle(`Cour à scrap ${city.name}`, "rachat comptant");
      const en = pageTitle(`Scrap car buyer ${city.name}`, "cash paid");
      expect(fr.length, `fr → "${fr}"`).toBeLessThanOrEqual(TITLE_MAX);
      expect(en.length, `en → "${en}"`).toBeLessThanOrEqual(TITLE_MAX);
    });

    /*
      These mirror the templates in app/(public)/[lang]/[slug]/page.tsx. A city
      name like Saint-Lin-Laurentides is 21 characters before the sentence
      around it starts, and the French full template overflows on it — the
      point of this spec is that adding such a city cannot silently ship a
      description Google will truncate, or one so short the snippet looks
      thin next to a competitor who filled the space.
    */
    it(`${city.name} lands inside the description window in both languages`, () => {
      const { name, distanceKm: km, driveMinutes: min } = city;
      const atYard = km === 0;

      const fr = atYard
        ? fitDescription(
            `Vendre une auto scrap à ${name} ? Notre cour est au 340 Chemin Pincourt. On paie comptant, remorquage gratuit et enlèvement souvent le jour même.`
          )
        : fitDescription(
            `Vendre une auto scrap à ${name} ? On paie comptant, remorquage gratuit et enlèvement souvent le jour même. Notre cour est à ${km} km, environ ${min} min.`,
            `Vendre une auto scrap à ${name} ? On paie comptant, remorquage gratuit, enlèvement souvent le jour même. Cour à ${km} km, ${min} min de route.`
          );

      const en = atYard
        ? fitDescription(
            `Selling a scrap car in ${name}? Our yard is right here at 340 Chemin Pincourt. We pay cash on pickup, towing is free, and collection is often same-day.`
          )
        : fitDescription(
            `Selling a scrap car in ${name}? We pay cash on pickup, towing is always free and collection is often same-day. Our yard is ${km} km away, about ${min} min.`,
            `Selling a scrap car in ${name}? We pay cash, towing is free and collection is often same-day. Our yard is ${km} km away, about a ${min} minute drive.`,
            `Selling a scrap car in ${name}? We pay cash, towing is free and collection is often same-day. Our yard is ${km} km away, about ${min} min.`
          );

      for (const [label, d] of [
        ["fr", fr],
        ["en", en],
      ] as const) {
        expect(d.length, `${label} → "${d}" (${d.length})`).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(d.length, `${label} → "${d}" (${d.length})`).toBeLessThanOrEqual(DESCRIPTION_MAX);
      }
    });
  }

  /*
    Language parity. The homepage links a city only when that city has a page
    in the language being viewed, so a missing `en` slug rendered as nine
    linked cities in French and three in English — the same coverage claim,
    visibly thinner on one side. It also dropped the city out of the English
    sitemap entirely. Both languages ship together or the asymmetry comes back
    silently on the next city added.
  */
  it("every city has a page in both languages", () => {
    for (const city of CITIES) {
      expect(city.slug.fr, `${city.name} has no fr slug`).toBeTruthy();
      expect(city.slug.en, `${city.name} has no en slug`).toBeTruthy();
      expect(city.copy.fr, `${city.name} has no fr copy`).toBeTruthy();
      expect(city.copy.en, `${city.name} has no en copy`).toBeTruthy();
    }
  });

  it("no two cities share a slug", () => {
    const slugs = CITIES.flatMap((c) => [c.slug.fr, c.slug.en]).filter(Boolean);
    expect(new Set(slugs).size, "duplicate city slug").toBe(slugs.length);
  });

  /*
    Catches the cheap version of the fix: pasting the French block into `en`
    so the page exists. A duplicated body is a duplicated page, and Google
    reads it as one.
  */
  it("English city copy is not the French copy", () => {
    for (const city of CITIES) {
      const en = city.copy.en!;
      const fr = city.copy.fr;
      for (const key of Object.keys(fr) as (keyof typeof fr)[]) {
        expect(en[key], `${city.name}.${key} is identical in both languages`).not.toBe(fr[key]);
      }
    }
  });
});

describe("heading labels", () => {
  /*
    The footer's column label and the page section that lists the same cities
    were both "Areas we serve" in English, so the homepage shipped two H2s
    with identical text — an audit flags it, and anyone navigating by heading
    hears the same label twice for different content. French already
    distinguished them.
  */
  for (const lang of LANGS) {
    it(`${lang}: the footer's city column does not duplicate the service-area section`, () => {
      const t = getCopy(lang);
      expect(t.nav.cities.toLowerCase()).not.toBe(t.home.serviceArea.title.toLowerCase());
    });

    it(`${lang}: no two homepage section headings share a label`, () => {
      const t = getCopy(lang);
      const headings = [
        t.home.howItWorks.title,
        t.home.buyAll.title,
        t.home.why.title,
        t.home.fleetTitle,
        t.home.serviceArea.title,
        t.home.faqHeading,
        t.home.yard.title,
        t.home.finalCta.title,
        // Footer column labels, which sit at the same level.
        t.nav.services,
        t.nav.cities,
      ].map((h) => h.toLowerCase());
      expect(new Set(headings).size, headings.join(" | ")).toBe(headings.length);
    });
  }
});

describe("blog posts", () => {
  for (const post of POSTS) {
    it(post.slug, () => {
      checkTitle(post.slug, post.title);
      checkDescription(post.slug, post.description);
    });
  }
});
