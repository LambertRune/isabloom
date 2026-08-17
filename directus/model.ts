export const DIRECTUS_VERSION = "12.0.2";

export const COUNTRY_DEFAULT = "BE";

export const SITE_SETTINGS_FIELDS = [
  "company_name",
  "street",
  "postal_code",
  "city",
  "country",
  "phone",
  "email",
  "instagram_url",
  "facebook_url",
  "maps_url",
  "opening_hours",
  "logo",
  "favicon",
] as const;

export const CONTENT_COLLECTIONS = [
  "site_settings",
  "services",
  "offer_items",
  "portfolio_items",
  "team_members",
  "blog_posts",
  "season_themes",
] as const;

export const JUNCTION_COLLECTIONS = [
  "services_files",
  "offer_item_files",
] as const;

export const FORBIDDEN_COLLECTIONS = ["products"] as const;

export const OFFER_CATEGORIES = {
  shop: "Winkel",
  christmas_rental: "Verhuur Kerst",
  flower_rental: "Verhuur Bloemen",
} as const;

export const SERVICE_FIELDS = [
  "title",
  "slug",
  "short_text",
  "long_text",
  "sort",
  "cta_text",
  "cta_link",
  "images",
] as const;

export const OFFER_ITEM_FIELDS = [
  "title",
  "category",
  "text",
  "sort",
  "active",
  "images",
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];
