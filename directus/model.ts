export const DIRECTUS_VERSION = "12.0.2";

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

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];
