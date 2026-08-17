import { describe, expect, it } from "vitest";
import { OFFER_CATEGORIES } from "../../directus/model.ts";
import { AANBOD } from "./aanbod.ts";
import { aanbodNavItems, firstSentence } from "./aanbod-nav.ts";

describe("aanbod nav items", () => {
  it("builds dropdown entries from OFFER_CATEGORIES, not a parallel label list", () => {
    const items = aanbodNavItems();
    const categories = Object.entries(OFFER_CATEGORIES);

    expect(items.map((item) => item.key)).toEqual(categories.map(([key]) => key));
    expect(items.map((item) => item.title)).toEqual(
      categories.map(([, title]) => title),
    );
    expect(items.map((item) => item.href)).toEqual(
      AANBOD.sections.map((section) => `/aanbod#${section.id}`),
    );
  });

  it("uses the first sentence of each Aanbod section as supporting copy", () => {
    const items = aanbodNavItems();
    for (const section of AANBOD.sections) {
      const item = items.find((entry) => entry.href === `/aanbod#${section.id}`);
      expect(item?.text).toBe(firstSentence(section.text));
    }
  });
});

describe("firstSentence", () => {
  it("keeps a short supporting line and drops the rest", () => {
    expect(firstSentence("Het winkelassortiment en de zaak zelf. Extra toelichting.")).toBe(
      "Het winkelassortiment en de zaak zelf.",
    );
  });
});
