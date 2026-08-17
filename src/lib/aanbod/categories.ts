import { OFFER_CATEGORIES } from "../../../directus/model.ts";

export type OfferCategory = keyof typeof OFFER_CATEGORIES;

export const OFFER_CATEGORY_SLUGS = {
  shop: "winkel",
  christmas_rental: "verhuur-kerst",
  flower_rental: "verhuur-bloemen",
} as const satisfies Record<OfferCategory, string>;

export function offerCategorySlug(category: OfferCategory): string {
  return OFFER_CATEGORY_SLUGS[category];
}
