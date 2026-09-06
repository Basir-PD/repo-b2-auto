import { describe, expect, it } from "vitest";
import { DESCRIPTION_MAX, TITLE_MAX, pageTitle } from "@/lib/seo";
import { getCopy } from "@/content/copy";
import { SERVICES } from "@/content/services";
import { ABOUT, CONTACT, PRIVACY, TERMS } from "@/content/pages";
import { CITIES } from "@/content/cities";
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

    it(`${city.name} fits both description templates`, () => {
      const fr = `Vendre une auto scrap à ${city.name} ? On achète comptant, remorquage gratuit, enlèvement souvent le jour même.`;
      const en = `Selling a scrap car in ${city.name}? We pay cash, free towing, and pickup is often the same day.`;
      expect(fr.length, `fr (${fr.length})`).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(en.length, `en (${en.length})`).toBeLessThanOrEqual(DESCRIPTION_MAX);
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
