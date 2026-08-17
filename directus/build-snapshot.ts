import {
  CONTENT_COLLECTIONS,
  COUNTRY_DEFAULT,
  DIRECTUS_VERSION,
  JUNCTION_COLLECTIONS,
  OFFER_CATEGORIES,
  type ContentCollection,
} from "./model.ts";
import type { Snapshot, SnapshotCollection, SnapshotField, SnapshotRelation } from "./load-snapshot.ts";

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

function nl(translation: string, singular?: string) {
  return [{ language: "nl-NL", translation, singular }];
}

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

function uuidId(collection: string): SnapshotField {
  return {
    collection,
    field: "id",
    type: "uuid",
    schema: {
      is_primary_key: true,
      is_nullable: false,
      is_unique: true,
    },
    meta: {
      special: ["uuid"],
      hidden: true,
      interface: "input",
      translations: null,
    },
  };
}

function stringField(
  collection: string,
  field: string,
  label: string,
  options?: { required?: boolean; defaultValue?: unknown; unique?: boolean },
): SnapshotField {
  return {
    collection,
    field,
    type: "string",
    schema: {
      default_value: options?.defaultValue ?? null,
      is_nullable: !options?.required,
      is_unique: options?.unique ?? false,
    },
    meta: {
      interface: "input",
      required: options?.required ?? false,
      translations: nl(label),
    },
  };
}

function textField(collection: string, field: string, label: string, required = false): SnapshotField {
  return {
    collection,
    field,
    type: "text",
    schema: { is_nullable: !required },
    meta: {
      interface: "input-multiline",
      required,
      translations: nl(label),
    },
  };
}

function integerField(
  collection: string,
  field: string,
  label: string,
  defaultValue: number,
): SnapshotField {
  return {
    collection,
    field,
    type: "integer",
    schema: { default_value: defaultValue, is_nullable: false },
    meta: {
      interface: "input",
      required: true,
      translations: nl(label),
    },
  };
}

function booleanField(
  collection: string,
  field: string,
  label: string,
  defaultValue: boolean,
): SnapshotField {
  return {
    collection,
    field,
    type: "boolean",
    schema: { default_value: defaultValue, is_nullable: false },
    meta: {
      interface: "boolean",
      required: true,
      translations: nl(label),
    },
  };
}

function fileField(collection: string, field: string, label: string, kind: "image" | "file"): SnapshotField {
  return {
    collection,
    field,
    type: "uuid",
    schema: {
      is_nullable: true,
      foreign_key_table: "directus_files",
      foreign_key_column: "id",
    },
    meta: {
      special: ["file"],
      interface: kind === "image" ? "file-image" : "file",
      translations: nl(label),
    },
  };
}

function slugField(collection: string): SnapshotField {
  return {
    collection,
    field: "slug",
    type: "string",
    schema: { is_nullable: false, is_unique: true },
    meta: {
      interface: "input",
      required: true,
      translations: nl("Slug"),
      options: { slug: true },
    },
  };
}

function aliasM2m(collection: string, field: string, label: string): SnapshotField {
  return {
    collection,
    field,
    type: "alias",
    meta: {
      special: ["m2m"],
      interface: "files",
      translations: nl(label),
    },
  };
}

function selectField(
  collection: string,
  field: string,
  label: string,
  choices: Record<string, string>,
  defaultValue: string,
): SnapshotField {
  return {
    collection,
    field,
    type: "string",
    schema: { default_value: defaultValue, is_nullable: false },
    meta: {
      interface: "select-dropdown",
      required: true,
      translations: nl(label),
      options: {
        choices: Object.entries(choices).map(([value, text]) => ({ value, text })),
      },
    },
  };
}

function openingHoursField(): SnapshotField {
  return {
    collection: "site_settings",
    field: "opening_hours",
    type: "json",
    schema: { is_nullable: true },
    meta: {
      interface: "list",
      translations: nl("Openingsuren"),
      note: "day is monday tot sunday. opens en closes zijn HH:mm. closed true negeert de tijden.",
      options: {
        fields: [
          {
            field: "day",
            name: "Dag",
            type: "string",
            meta: {
              interface: "select-dropdown",
              width: "half",
              options: {
                choices: [
                  { text: "Maandag", value: "monday" },
                  { text: "Dinsdag", value: "tuesday" },
                  { text: "Woensdag", value: "wednesday" },
                  { text: "Donderdag", value: "thursday" },
                  { text: "Vrijdag", value: "friday" },
                  { text: "Zaterdag", value: "saturday" },
                  { text: "Zondag", value: "sunday" },
                ],
              },
            },
          },
          {
            field: "opens",
            name: "Open",
            type: "string",
            meta: { interface: "input", width: "half" },
          },
          {
            field: "closes",
            name: "Gesloten om",
            type: "string",
            meta: { interface: "input", width: "half" },
          },
          {
            field: "closed",
            name: "Gesloten",
            type: "boolean",
            meta: { interface: "boolean", width: "half" },
          },
        ],
      },
    },
  };
}

function siteSettingsFields(): SnapshotField[] {
  return [
    uuidId("site_settings"),
    stringField("site_settings", "company_name", "Bedrijfsnaam", { required: true }),
    stringField("site_settings", "street", "Straat en nummer"),
    stringField("site_settings", "postal_code", "Postcode"),
    stringField("site_settings", "city", "Gemeente"),
    stringField("site_settings", "country", "Land", { defaultValue: COUNTRY_DEFAULT }),
    stringField("site_settings", "phone", "Telefoon"),
    stringField("site_settings", "email", "E-mail"),
    stringField("site_settings", "instagram_url", "Instagram"),
    stringField("site_settings", "facebook_url", "Facebook"),
    stringField("site_settings", "maps_url", "Google Maps-route"),
    openingHoursField(),
    fileField("site_settings", "logo", "Logo", "image"),
    fileField("site_settings", "favicon", "Favicon", "image"),
  ];
}

function servicesFields(): SnapshotField[] {
  return [
    uuidId("services"),
    stringField("services", "title", "Titel", { required: true }),
    slugField("services"),
    textField("services", "short_text", "Korte tekst", true),
    textField("services", "long_text", "Lange tekst"),
    integerField("services", "sort", "Volgorde", 0),
    stringField("services", "cta_text", "CTA-tekst"),
    stringField("services", "cta_link", "CTA-link"),
    aliasM2m("services", "images", "Afbeeldingen"),
  ];
}

function offerItemsFields(): SnapshotField[] {
  return [
    uuidId("offer_items"),
    stringField("offer_items", "title", "Titel", { required: true }),
    selectField("offer_items", "category", "Categorie", OFFER_CATEGORIES, "shop"),
    textField("offer_items", "text", "Tekst"),
    integerField("offer_items", "sort", "Volgorde", 0),
    booleanField("offer_items", "active", "Actief", true),
    aliasM2m("offer_items", "images", "Afbeeldingen"),
  ];
}

function fileRelation(collection: string, field: string): SnapshotRelation {
  return {
    collection,
    field,
    related_collection: "directus_files",
    meta: {
      one_field: null,
      junction_field: null,
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
    fields: [...siteSettingsFields(), ...servicesFields(), ...offerItemsFields()],
    relations: [fileRelation("site_settings", "logo"), fileRelation("site_settings", "favicon")],
  };
}
