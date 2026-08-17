import { OFFER_CATEGORIES } from "../../directus/model.ts";
import { AANBOD } from "./aanbod.ts";
import {
  offerCategorySlug,
  type OfferCategory,
} from "@/lib/aanbod/categories.ts";

export type AanbodNavItem = {
  key: OfferCategory;
  href: string;
  title: string;
  text: string;
};

export function firstSentence(text: string): string {
  const match = text.match(/^.+?[.]/);
  return (match?.[0] ?? text).trim();
}

export function aanbodNavItems(): AanbodNavItem[] {
  return (Object.keys(OFFER_CATEGORIES) as OfferCategory[]).map((key) => {
    const id = offerCategorySlug(key);
    const section = AANBOD.sections.find((entry) => entry.id === id);
    return {
      key,
      href: `/aanbod#${id}`,
      title: OFFER_CATEGORIES[key],
      text: firstSentence(section?.text ?? ""),
    };
  });
}
