import {
  CONTENT_COLLECTIONS,
  DIRECTUS_VERSION,
  JUNCTION_COLLECTIONS,
  type ContentCollection,
} from "./model.ts";
import type { Snapshot, SnapshotCollection } from "./load-snapshot.ts";

const COLLECTION_LABELS: Record<ContentCollection, { translation: string; singular: string }> = {
  site_settings: { translation: "Site-instellingen", singular: "Site-instellingen" },
  services: { translation: "Diensten", singular: "Dienst" },
  offer_items: { translation: "Aanbod", singular: "Aanboditem" },
  portfolio_items: { translation: "Portfolio", singular: "Portfolio-item" },
  team_members: { translation: "Team", singular: "Teamlid" },
  blog_posts: { translation: "Blog", singular: "Blogbericht" },
  season_themes: { translation: "Seizoensthema's", singular: "Seizoensthema" },
};

const JUNCTION_LABELS: Record<(typeof JUNCTION_COLLECTIONS)[number], { translation: string; singular: string }> = {
  services_files: { translation: "Dienstbestanden", singular: "Dienstbestand" },
  offer_item_files: { translation: "Aanbodbestanden", singular: "Aanbodbestand" },
};

function collectionMeta(
  name: string,
  labels: { translation: string; singular: string },
  singleton: boolean,
  hidden: boolean,
  sortField: string | null,
): SnapshotCollection {
  return {
    collection: name,
    meta: {
      singleton,
      hidden,
      sort_field: sortField,
      translations: [
        {
          language: "nl-NL",
          translation: labels.translation,
          singular: labels.singular,
        },
      ],
    },
    schema: {
      name,
    },
  };
}

export function buildSnapshot(): Snapshot {
  const content = CONTENT_COLLECTIONS.map((name) =>
    collectionMeta(
      name,
      COLLECTION_LABELS[name],
      name === "site_settings",
      false,
      name === "site_settings" ? null : "sort",
    ),
  );
  const junctions = JUNCTION_COLLECTIONS.map((name) =>
    collectionMeta(name, JUNCTION_LABELS[name], false, true, "sort"),
  );

  return {
    version: 1,
    directus: DIRECTUS_VERSION,
    vendor: "postgres",
    collections: [...content, ...junctions],
    fields: [],
    relations: [],
  };
}
