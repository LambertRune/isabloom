import { describe, expect, it } from "vitest";
import { AANBOD } from "@/content/aanbod.ts";
import { OFFER_CATEGORIES } from "../../../directus/model.ts";
import {
  OFFER_CATEGORY_SLUGS,
  offerCategorySlug,
  type OfferCategory,
} from "./categories.ts";

describe("offer category slugs", () => {
  it("maps every Directus offer category to an existing Aanbod section id", () => {
    const keys = Object.keys(OFFER_CATEGORIES) as OfferCategory[];
    const sectionIds = AANBOD.sections.map((section) => section.id);

    expect(keys.length).toBeGreaterThan(0);
    expect(Object.keys(OFFER_CATEGORY_SLUGS)).toEqual(keys);

    for (const key of keys) {
      const slug = offerCategorySlug(key);
      expect(sectionIds).toContain(slug);
      expect(AANBOD.sections.find((section) => section.id === slug)?.title).toBe(
        OFFER_CATEGORIES[key],
      );
    }
  });
});
