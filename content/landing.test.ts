import { describe, expect, it } from "vitest";
import { faqByIds } from "@/content/faq";
import { getCopy } from "@/content/copy";
import { LANDING_CONTENT } from "@/content/landing";

describe("landing page FAQs", () => {
  /*
    The ids are strings typed by hand into content/landing.ts, and the page
    renders whatever they resolve to. Renaming an entry in content/faq.ts
    would otherwise surface as a build-time throw on one landing page — or,
    worse, as someone "fixing" the throw by dropping the id.
  */
  it.each(LANDING_CONTENT.map((lp) => [`${lp.lang}/${lp.slug}`, lp] as const))(
    "%s resolves every FAQ id in its own language",
    (_label, lp) => {
      expect(() => faqByIds(lp.lang, lp.faq)).not.toThrow();
    }
  );

  it.each(LANDING_CONTENT.map((lp) => [`${lp.lang}/${lp.slug}`, lp] as const))(
    "%s carries four or five questions, none repeated",
    (_label, lp) => {
      expect(lp.faq.length).toBeGreaterThanOrEqual(4);
      expect(lp.faq.length).toBeLessThanOrEqual(5);
      expect(new Set(lp.faq).size).toBe(lp.faq.length);
    }
  );

  it("throws on an unknown id instead of rendering a shorter list", () => {
    expect(() => faqByIds("en", ["valeur", "no-such-question"])).toThrow(/no-such-question/);
  });
});

/*
  `sections` and `yard` exist to answer one measurement: on 2026-09-28 the
  eleven landing pages were 55–74% identical to each other sentence for
  sentence, /fr/lp/cour-scrap/ had seven original sentences out of thirty-one,
  and Google Ads scored its landing page experience Below average.

  So these specs guard originality, not shape. A block that renders but says
  what the page next door already said costs the click it was added to save.
*/
describe("landing page prose", () => {
  const withSections = LANDING_CONTENT.filter((lp) => lp.sections?.length);

  it.each(withSections.map((lp) => [`${lp.lang}/${lp.slug}`, lp] as const))(
    "%s gives every section a heading and a body",
    (_label, lp) => {
      for (const section of lp.sections ?? []) {
        expect(section.h2.trim()).not.toBe("");
        expect(section.body.length).toBeGreaterThan(0);
        for (const paragraph of section.body) expect(paragraph.trim()).not.toBe("");
      }
    }
  );

  /*
    The failure this is really for: a new landing page is built by copying
    the nearest one, and the prose that was supposed to distinguish them
    arrives identical. That reads as fine in review and undoes the entire
    reason the field exists.
  */
  it("never repeats a paragraph, within a page or across pages", () => {
    const seen = new Map<string, string>();
    for (const lp of withSections) {
      const where = `${lp.lang}/${lp.slug}`;
      for (const section of lp.sections ?? []) {
        for (const paragraph of section.body) {
          const previous = seen.get(paragraph);
          expect(previous, `duplicated on ${where} and ${previous}`).toBeUndefined();
          seen.set(paragraph, where);
        }
      }
    }
  });

  it.each(
    LANDING_CONTENT.filter((lp) => lp.yard).map((lp) => [`${lp.lang}/${lp.slug}`, lp] as const)
  )("%s describes the visit rather than just naming the yard", (_label, lp) => {
    const yard = lp.yard;
    if (!yard) throw new Error("filtered above");
    expect(yard.h2.trim()).not.toBe("");
    expect(yard.body.trim()).not.toBe("");
    expect(yard.steps.length).toBeGreaterThanOrEqual(3);
    // The parts answer is the whole point of the block for this keyword:
    // half of "cour à scrap" wants a used alternator, not a buyer.
    expect(yard.parts.trim()).not.toBe("");
  });
});

describe("landing page heroes", () => {
  /*
    The green line above the headline is the site slogan unless a page sets
    its own. A headline that says the slogan again reads as the hero
    repeating itself, which is what /fr/lp/cour-scrap/ did.
  */
  const words = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z]+/g, " ")
      .trim();

  it.each(LANDING_CONTENT.map((lp) => [`${lp.lang}/${lp.slug}`, lp] as const))(
    "%s does not say the line above its headline again in the headline",
    (_, lp) => {
      const eyebrow = lp.eyebrow ?? getCopy(lp.lang).home.slogan;
      expect(words(lp.h1)).not.toContain(words(eyebrow));
    }
  );
});
