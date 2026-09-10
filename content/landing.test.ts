import { describe, expect, it } from "vitest";
import { faqByIds } from "@/content/faq";
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
