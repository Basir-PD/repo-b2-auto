import { describe, expect, it } from "vitest";
import { DESCRIPTION_MAX, TITLE_MAX, pageTitle } from "@/lib/seo";

describe("pageTitle", () => {
  it("appends the brand exactly once", () => {
    expect(pageTitle("FAQ")).toBe("FAQ | Autos B2");
    expect(pageTitle("FAQ").match(/Autos B2/g)).toHaveLength(1);
  });

  it("keeps the qualifier when it fits", () => {
    expect(pageTitle("Cour à scrap Laval", "comptant")).toContain("— comptant");
  });

  it("drops the qualifier whole rather than cutting it mid-word", () => {
    const t = pageTitle("Rachat d'auto scrap à Saint-Lin-Laurentides", "remorquage gratuit inclus");
    expect(t.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(t).not.toContain("—");
    expect(t).toContain("Autos B2");
  });

  it("never exceeds the limit, even when the name alone is too long", () => {
    const t = pageTitle("A".repeat(200));
    expect(t.length).toBeLessThanOrEqual(TITLE_MAX);
    // The brand survives — it is what makes the result recognisable.
    expect(t.endsWith("| Autos B2")).toBe(true);
  });

  it("holds for every city name we serve", async () => {
    const { CITIES } = await import("@/content/cities");
    for (const city of CITIES) {
      const t = pageTitle(`Cour à scrap ${city.name}`, "rachat comptant");
      expect(t.length, `${city.name} → "${t}"`).toBeLessThanOrEqual(TITLE_MAX);
    }
  });
});

describe("limits", () => {
  it("matches what search results actually render", () => {
    expect(TITLE_MAX).toBe(60);
    expect(DESCRIPTION_MAX).toBe(155);
  });
});
