import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export type SnapshotTranslation = {
  language: string;
  translation: string;
  singular?: string;
};

export type SnapshotField = {
  collection: string;
  field: string;
  type: string;
  schema?: {
    default_value?: unknown;
    is_nullable?: boolean;
    is_unique?: boolean;
    is_primary_key?: boolean;
    foreign_key_table?: string | null;
    foreign_key_column?: string | null;
  };
  meta?: {
    interface?: string | null;
    required?: boolean | null;
    hidden?: boolean | null;
    special?: string[] | null;
    translations?: SnapshotTranslation[] | null;
    validation?: unknown;
    validation_message?: string | null;
    options?: Record<string, unknown> | null;
    note?: string | null;
  };
};

export type SnapshotCollection = {
  collection: string;
  meta?: {
    singleton?: boolean | null;
    hidden?: boolean | null;
    translations?: SnapshotTranslation[] | null;
    sort_field?: string | null;
  };
  schema?: {
    name: string;
  };
};

export type SnapshotRelation = {
  collection: string;
  field: string;
  related_collection: string | null;
  meta?: {
    one_field?: string | null;
    junction_field?: string | null;
    sort_field?: string | null;
  };
};

export type Snapshot = {
  version: number;
  directus: string;
  vendor: string;
  collections: SnapshotCollection[];
  fields: SnapshotField[];
  relations: SnapshotRelation[];
};

export function loadSnapshot(): Snapshot {
  const dir = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(dir, "schema", "snapshot.yaml"), "utf8");
  return parse(raw) as Snapshot;
}

export function getCollection(snapshot: Snapshot, name: string): SnapshotCollection {
  const found = snapshot.collections.find((item) => item.collection === name);
  if (!found) {
    throw new Error(`Missing collection ${name}`);
  }
  return found;
}

export function getField(
  snapshot: Snapshot,
  collection: string,
  field: string,
): SnapshotField {
  const found = snapshot.fields.find(
    (item) => item.collection === collection && item.field === field,
  );
  if (!found) {
    throw new Error(`Missing field ${collection}.${field}`);
  }
  return found;
}

export function nlLabel(translations: SnapshotTranslation[] | null | undefined): string | undefined {
  return translations?.find((item) => item.language === "nl-NL")?.translation;
}
