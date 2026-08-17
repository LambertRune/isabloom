# Directus Content Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a git-versioned Directus schema (Postgres + Directus 12) so a Dutch admin app exposes the Isabloom content collections, with contract tests that run without Docker.

**Architecture:** A typed `MODEL` in TypeScript is the authoring contract. `buildSnapshot(MODEL)` writes `directus/schema/snapshot.yaml`. Directus applies that YAML on boot. Roles and permissions are not in the snapshot; a one-shot seed job upserts them after Directus is healthy. Vitest asserts the committed YAML against the model (collections, Dutch labels, defaults, enums, regex, junctions).

**Tech Stack:** Directus 12.x (pin a concrete tag, start from `12.0.2`), PostgreSQL 16 Alpine, Docker Compose, TypeScript, Vitest, `yaml`.

## Global Constraints

- Site copy and admin labels are Dutch (`nl-NL`). API collection and field keys are English.
- No em-dashes in copy, comments, README, commit messages, or this plan's user-facing strings.
- No dummy florist copy, no season accent hex values, no invented opening hours, no `products` collection.
- `country` default `BE` lives in `snapshot.yaml` as `schema.default_value`, never in the seed job.
- `accent_color` uses native `meta.validation` `_regex` (`^$|^#([0-9A-Fa-f]{6})$`). No custom hook. Cleared value is empty string.
- `opening_hours` is JSON with Repeater interface `list`.
- No Directus folders per file type in this PR.
- Contract tests must pass with `npm test` and no running containers.
- Branch `feature/directus-content-model`, PR into `pre-production`.
- Spec: `docs/superpowers/specs/2026-08-17-directus-content-model-design.md`.

## File map

- Create: `.gitignore`
- Create: `.env.example`
- Create: `package.json`
- Create: `package-lock.json` (via npm)
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `docker-compose.yml`
- Create: `README.md` (replace the stub)
- Create: `directus/model.ts`
- Create: `directus/load-snapshot.ts`
- Create: `directus/build-snapshot.ts`
- Create: `directus/write-snapshot.ts`
- Create: `directus/model.test.ts`
- Create: `directus/schema/snapshot.yaml`
- Create: `directus/seed/roles.json`
- Create: `directus/scripts/entrypoint.sh`
- Create: `directus/scripts/seed-roles.mjs`
- Create: `uploads/.gitkeep`
- Keep: `docs/superpowers/specs/2026-08-17-directus-content-model-design.md`

---

### Task 1: Test harness and collection contract

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `directus/model.ts`
- Create: `directus/load-snapshot.ts`
- Create: `directus/model.test.ts`
- Test: `directus/model.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `CONTENT_COLLECTIONS`, `JUNCTION_COLLECTIONS`, `FORBIDDEN_COLLECTIONS`, `loadSnapshot()`, `DIRECTUS_VERSION`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout main
git pull
git checkout -b feature/directus-content-model
```

Expected: branch exists, working tree otherwise unchanged.

- [ ] **Step 2: Write the failing collection test and load helper**

Create `package.json`:

```json
{
  "name": "isabloom",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "cms:snapshot": "tsx directus/write-snapshot.ts"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["directus/**/*.ts", "vitest.config.ts"]
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["directus/**/*.test.ts"],
  },
});
```

Create `.gitignore`:

```
node_modules
.env
data/
uploads/*
!uploads/.gitkeep
```

Create `directus/model.ts`:

```ts
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
```

Create `directus/load-snapshot.ts`:

```ts
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
```

Create `directus/model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  CONTENT_COLLECTIONS,
  FORBIDDEN_COLLECTIONS,
  JUNCTION_COLLECTIONS,
} from "./model.ts";
import { loadSnapshot } from "./load-snapshot.ts";

describe("Directus snapshot contract", () => {
  it("contains exactly the content and junction collections", () => {
    const snapshot = loadSnapshot();
    const names = snapshot.collections.map((item) => item.collection).sort();
    const expected = [...CONTENT_COLLECTIONS, ...JUNCTION_COLLECTIONS].sort();
    expect(names).toEqual(expected);
  });

  it("does not include a products collection", () => {
    const snapshot = loadSnapshot();
    for (const name of FORBIDDEN_COLLECTIONS) {
      expect(snapshot.collections.map((item) => item.collection)).not.toContain(name);
    }
  });
});
```

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest typescript tsx yaml @types/node
```

Expected: `package-lock.json` created, `node_modules` present.

- [ ] **Step 4: Run the collection test to verify it fails**

```bash
npm test
```

Expected: FAIL. `ENOENT` for `directus/schema/snapshot.yaml` (file not found).

- [ ] **Step 5: Add a snapshot builder that emits collection stubs, then write the YAML**

Create `directus/build-snapshot.ts`:

```ts
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
```

Create `directus/write-snapshot.ts`:

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { buildSnapshot } from "./build-snapshot.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const out = join(dir, "schema", "snapshot.yaml");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, stringify(buildSnapshot(), { lineWidth: 0 }));
```

Run:

```bash
npm run cms:snapshot
npm test
```

Expected: PASS. Snapshot contains the nine collection names and no `products`.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.json vitest.config.ts directus
git commit -m "$(cat <<'EOF'
Add Directus snapshot contract tests for content collections.

Keep the schema authoring model in TypeScript so later PRs can extend fields without renaming English API keys.
EOF
)"
```

---

### Task 2: site_settings including country default and opening_hours repeater

**Files:**
- Modify: `directus/model.ts`
- Modify: `directus/build-snapshot.ts`
- Modify: `directus/model.test.ts`
- Modify: `directus/schema/snapshot.yaml` (via `cms:snapshot`)

**Interfaces:**
- Consumes: `buildSnapshot()`, `loadSnapshot()`, `getCollection()`, `getField()`, `nlLabel()`
- Produces: `COUNTRY_DEFAULT`, `site_settings` fields in the snapshot, `schema.default_value: BE` on `country`

- [ ] **Step 1: Extend the test file with site_settings assertions**

Add to `directus/model.ts`:

```ts
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
```

Add tests to `directus/model.test.ts`:

```ts
import { COUNTRY_DEFAULT, SITE_SETTINGS_FIELDS } from "./model.ts";
import { getCollection, getField, nlLabel } from "./load-snapshot.ts";

describe("site_settings", () => {
  it("is a singleton with a Dutch collection label", () => {
    const snapshot = loadSnapshot();
    const collection = getCollection(snapshot, "site_settings");
    expect(collection.meta?.singleton).toBe(true);
    expect(nlLabel(collection.meta?.translations)).toBe("Site-instellingen");
  });

  it("exposes the contracted fields with nl-NL labels", () => {
    const snapshot = loadSnapshot();
    for (const field of SITE_SETTINGS_FIELDS) {
      const item = getField(snapshot, "site_settings", field);
      expect(nlLabel(item.meta?.translations)).toBeTruthy();
    }
  });

  it("stores country default BE in the snapshot schema, not as seed data", () => {
    const snapshot = loadSnapshot();
    const country = getField(snapshot, "site_settings", "country");
    expect(country.schema?.default_value).toBe(COUNTRY_DEFAULT);
  });

  it("uses a json repeater for opening_hours", () => {
    const snapshot = loadSnapshot();
    const hours = getField(snapshot, "site_settings", "opening_hours");
    expect(hours.type).toBe("json");
    expect(hours.meta?.interface).toBe("list");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL with `Missing field site_settings.company_name` (or the first field lookup).

- [ ] **Step 3: Generate id, m2o-file, and string fields in the builder**

Replace `directus/build-snapshot.ts` with a version that can emit fields. Keep the collection helper from Task 1 and add:

```ts
import type { Snapshot, SnapshotField, SnapshotRelation } from "./load-snapshot.ts";
import { COUNTRY_DEFAULT } from "./model.ts";

function nl(translation: string, singular?: string) {
  return [{ language: "nl-NL", translation, singular }];
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
```

In `buildSnapshot()`, set `fields: [...siteSettingsFields()]`. Add m2o relations for `logo` and `favicon` to `directus_files`:

```ts
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
```

Include those two relations in `relations`.

- [ ] **Step 4: Regenerate snapshot and run tests**

```bash
npm run cms:snapshot
npm test
```

Expected: PASS. `country.schema.default_value` is `BE`. `opening_hours.meta.interface` is `list`.

- [ ] **Step 5: Commit**

```bash
git add directus
git commit -m "$(cat <<'EOF'
Add site_settings snapshot fields with country default BE.

Store the Belgium default in schema.default_value so a clean compose apply does not depend on the roles seed job.
EOF
)"
```

---

### Task 3: services and offer_items

**Files:**
- Modify: `directus/model.ts`
- Modify: `directus/build-snapshot.ts`
- Modify: `directus/model.test.ts`
- Modify: `directus/schema/snapshot.yaml`

**Interfaces:**
- Consumes: field helpers from Task 2
- Produces: `OFFER_CATEGORIES`, `services` and `offer_items` fields (images still alias-only until Task 6)

- [ ] **Step 1: Write failing enum and field tests**

Add to `directus/model.ts`:

```ts
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
```

Add tests:

```ts
import { OFFER_CATEGORIES, OFFER_ITEM_FIELDS, SERVICE_FIELDS } from "./model.ts";

function choicesOf(field: { meta?: { options?: Record<string, unknown> | null } }): Array<{ value: string; text: string }> {
  const options = field.meta?.options ?? {};
  return (options.choices as Array<{ value: string; text: string }>) ?? [];
}

describe("services and offer_items", () => {
  it("has Dutch labels on every service field", () => {
    const snapshot = loadSnapshot();
    for (const field of SERVICE_FIELDS) {
      expect(nlLabel(getField(snapshot, "services", field).meta?.translations)).toBeTruthy();
    }
  });

  it("has Dutch labels on every offer item field", () => {
    const snapshot = loadSnapshot();
    for (const field of OFFER_ITEM_FIELDS) {
      expect(nlLabel(getField(snapshot, "offer_items", field).meta?.translations)).toBeTruthy();
    }
  });

  it("maps offer category enum keys to Dutch choices", () => {
    const snapshot = loadSnapshot();
    const category = getField(snapshot, "offer_items", "category");
    const choices = choicesOf(category);
    expect(Object.fromEntries(choices.map((item) => [item.value, item.text]))).toEqual(
      OFFER_CATEGORIES,
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL with `Missing field services.title`.

- [ ] **Step 3: Add builder output for both collections**

Add helpers:

```ts
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
```

`services` fields: `id`, `title` (required), `slug`, `short_text` (text, required), `long_text` (text), `sort` default 0, `cta_text`, `cta_link`, `images` alias m2m.

`offer_items` fields: `id`, `title`, `category` with `OFFER_CATEGORIES` and default `shop`, `text`, `sort` default 0, `active` default true, `images` alias m2m.

Append these fields in `buildSnapshot()`.

- [ ] **Step 4: Regenerate and run tests**

```bash
npm run cms:snapshot
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add directus
git commit -m "$(cat <<'EOF'
Add services and offer_items fields with Dutch category choices.

Keep offer categories as English API keys so the later aanbod page can filter without Dutch slugs in code.
EOF
)"
```

---

### Task 4: portfolio, team, and blog

**Files:**
- Modify: `directus/model.ts`
- Modify: `directus/build-snapshot.ts`
- Modify: `directus/model.test.ts`
- Modify: `directus/schema/snapshot.yaml`

**Interfaces:**
- Consumes: field helpers from Tasks 2-3
- Produces: `BLOG_STATUSES`, remaining content fields except season_themes

- [ ] **Step 1: Write failing tests**

Add to `directus/model.ts`:

```ts
export const BLOG_STATUSES = {
  draft: "Concept",
  published: "Gepubliceerd",
} as const;

export const PORTFOLIO_FIELDS = ["image", "title", "alt", "category", "sort"] as const;
export const TEAM_FIELDS = ["name", "title", "photo", "sort", "active"] as const;
export const BLOG_FIELDS = [
  "title",
  "slug",
  "intro",
  "content",
  "cover",
  "published_at",
  "status",
] as const;
```

Add tests that every listed field has an `nl-NL` label, `portfolio_items.image` is required, `blog_posts.content` uses `input-rich-text-html`, and `blog_posts.status` choices equal `BLOG_STATUSES`.

```ts
it("uses WYSIWYG for blog content", () => {
  const snapshot = loadSnapshot();
  expect(getField(snapshot, "blog_posts", "content").meta?.interface).toBe(
    "input-rich-text-html",
  );
});

it("maps blog status keys to Dutch choices", () => {
  const snapshot = loadSnapshot();
  const status = getField(snapshot, "blog_posts", "status");
  const choices = choicesOf(status);
  expect(Object.fromEntries(choices.map((item) => [item.value, item.text]))).toEqual(
    BLOG_STATUSES,
  );
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL with `Missing field portfolio_items.image`.

- [ ] **Step 3: Implement the three collections in the builder**

`portfolio_items`: required `image` (`file-image`, `schema.is_nullable: false`), optional `title`, `alt`, free-text `category`, `sort` default 0. Add file relation for `image`.

`team_members`: required `name`, optional `title` labeled `Functie`, optional `photo`, `sort` default 0, `active` default true. File relation for `photo`.

`blog_posts`: required `title`, unique `slug`, optional `intro` multiline, `content` with `interface: input-rich-text-html` labeled `Inhoud`, optional `cover`, optional `published_at` type `timestamp` interface `datetime`, `status` select with `BLOG_STATUSES` default `draft`. File relation for `cover`.

- [ ] **Step 4: Regenerate and run tests**

```bash
npm run cms:snapshot
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add directus
git commit -m "$(cat <<'EOF'
Add portfolio, team, and blog snapshot fields.

Use WYSIWYG for blog content so the client can write posts without a block editor.
EOF
)"
```

---

### Task 5: season_themes and native accent_color regex

**Files:**
- Modify: `directus/model.ts`
- Modify: `directus/build-snapshot.ts`
- Modify: `directus/model.test.ts`
- Modify: `directus/schema/snapshot.yaml`

**Interfaces:**
- Consumes: field helpers
- Produces: `ACCENT_COLOR_REGEX`, `season_themes` fields, native `meta.validation`

- [ ] **Step 1: Write failing validation tests**

Add to `directus/model.ts`:

```ts
export const ACCENT_COLOR_REGEX = "^$|^#([0-9A-Fa-f]{6})$";
export const ACCENT_COLOR_MESSAGE = "Accentkleur moet een hex-waarde zijn (#RRGGBB).";

export const SEASON_THEME_FIELDS = [
  "name",
  "start_date",
  "end_date",
  "priority",
  "accent_color",
  "hero_image",
  "hero_video",
  "hero_title",
  "hero_subtitle",
  "force_active",
] as const;
```

Add tests:

```ts
import { ACCENT_COLOR_MESSAGE, ACCENT_COLOR_REGEX, SEASON_THEME_FIELDS } from "./model.ts";

describe("season_themes", () => {
  it("labels every field in Dutch", () => {
    const snapshot = loadSnapshot();
    for (const field of SEASON_THEME_FIELDS) {
      expect(nlLabel(getField(snapshot, "season_themes", field).meta?.translations)).toBeTruthy();
    }
  });

  it("validates accent_color with native regex that allows empty", () => {
    const snapshot = loadSnapshot();
    const accent = getField(snapshot, "season_themes", "accent_color");
    const validation = accent.meta?.validation as {
      _and?: Array<{ accent_color?: { _regex?: string } }>;
    };
    const regex = validation?._and?.[0]?.accent_color?._regex;
    expect(regex).toBe(ACCENT_COLOR_REGEX);
    expect(accent.meta?.validation_message).toBe(ACCENT_COLOR_MESSAGE);
    expect(accent.meta?.options).toMatchObject({ trim: true });
  });
});
```

The builder must emit this validation shape (Directus native, no hook):

```yaml
meta:
  validation:
    _and:
      - accent_color:
          _regex: "^$|^#([0-9A-Fa-f]{6})$"
  validation_message: Accentkleur moet een hex-waarde zijn (#RRGGBB).
  options:
    trim: true
    clear: ""
```

`clear: ""` (or the interface option Directus 12 uses for "save as empty string") is required so an optional hex is `""` rather than `null`. If the 12.x tag uses a different option key, inspect a field created in the Data Studio and match it, but keep `_regex` native.

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL with `Missing field season_themes.name`.

- [ ] **Step 3: Implement season_themes in the builder**

Fields:

- `name` string required, label `Naam`
- `start_date` type `date`, interface `datetime`, required, label `Startdatum`
- `end_date` type `date`, interface `datetime`, required, label `Einddatum`
- `priority` integer default 0, label `Prioriteit`
- `accent_color` string optional, validation as above, label `Accentkleur`
- `hero_image` file-image
- `hero_video` file (not image)
- `hero_title` string, label `Hero-titel`
- `hero_subtitle` string, label `Hero-ondertitel`
- `force_active` boolean default false, label `Handmatig forceren`

Do not seed any season rows.

- [ ] **Step 4: Regenerate and run tests**

```bash
npm run cms:snapshot
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add directus
git commit -m "$(cat <<'EOF'
Add season_themes with native hex validation for accent_color.

Use Directus meta.validation _regex so empty and #RRGGBB values work without a custom hook.
EOF
)"
```

---

### Task 6: M2M junctions for galleries

**Files:**
- Modify: `directus/build-snapshot.ts`
- Modify: `directus/model.test.ts`
- Modify: `directus/schema/snapshot.yaml`

**Interfaces:**
- Consumes: `JUNCTION_COLLECTIONS`, alias `images` fields from Task 3
- Produces: `services_files`, `offer_item_files` with `sort` and `alt`, plus four relations (two per junction)

- [ ] **Step 1: Write failing junction tests**

```ts
describe("gallery junctions", () => {
  it("gives each junction sort and alt fields with Dutch labels", () => {
    const snapshot = loadSnapshot();
    for (const collection of JUNCTION_COLLECTIONS) {
      expect(nlLabel(getField(snapshot, collection, "sort").meta?.translations)).toBe("Volgorde");
      expect(nlLabel(getField(snapshot, collection, "alt").meta?.translations)).toBe("Alt-tekst");
    }
  });

  it("links services.images and offer_items.images through the junctions", () => {
    const snapshot = loadSnapshot();
    const oneFields = snapshot.relations.map((item) => item.meta?.one_field);
    expect(oneFields).toContain("images");
    const tables = snapshot.relations.map((item) => item.collection);
    expect(tables).toEqual(expect.arrayContaining(["services_files", "offer_item_files"]));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL with `Missing field services_files.sort`.

- [ ] **Step 3: Emit junction fields and relations**

For `services_files`:

- `id` uuid
- `services_id` uuid fk to `services.id`
- `directus_files_id` uuid fk to `directus_files.id`
- `sort` integer default 0, label `Volgorde`
- `alt` string, label `Alt-tekst`

Relations:

1. `collection: services_files`, `field: services_id`, `related_collection: services`, `meta.one_field: images`, `meta.junction_field: directus_files_id`
2. `collection: services_files`, `field: directus_files_id`, `related_collection: directus_files`, `meta.junction_field: services_id`

Repeat for `offer_item_files` with `offer_items_id` and `offer_items`.

Hide junction collections in the paneel (`meta.hidden: true`), already set in Task 1.

- [ ] **Step 4: Regenerate and run tests**

```bash
npm run cms:snapshot
npm test
```

Expected: PASS, including the original "exactly these collections" test.

- [ ] **Step 5: Commit**

```bash
git add directus
git commit -m "$(cat <<'EOF'
Add gallery junctions with per-use sort and alt text.

Keep file order on the junction so a photo can appear in a different sequence per dienst or aanbod item.
EOF
)"
```

---

### Task 7: Roles contract (not in the snapshot)

**Files:**
- Create: `directus/seed/roles.json`
- Create: `directus/roles.test.ts`

**Interfaces:**
- Consumes: content and junction collection names
- Produces: `directus/seed/roles.json` shape consumed by `seed-roles.mjs` in Task 8

- [ ] **Step 1: Write failing role tests**

Create `directus/roles.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { CONTENT_COLLECTIONS, JUNCTION_COLLECTIONS } from "./model.ts";

type RoleSeed = {
  name: string;
  appAccess: boolean;
  adminAccess: boolean;
  collections: Record<
    string,
    {
      actions: string[];
      filter?: Record<string, unknown>;
    }
  >;
};

const SYSTEM_COLLECTIONS = [
  "directus_settings",
  "directus_users",
  "directus_roles",
  "directus_webhooks",
  "directus_extensions",
];

function loadRoles(): RoleSeed[] {
  const dir = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(dir, "seed", "roles.json"), "utf8");
  return JSON.parse(raw) as RoleSeed[];
}

describe("role seed", () => {
  it("defines Isabloom beheerder and Website without admin access", () => {
    const roles = loadRoles();
    const names = roles.map((role) => role.name);
    expect(names).toEqual(["Isabloom beheerder", "Website"]);
    for (const role of roles) {
      expect(role.adminAccess).toBe(false);
    }
  });

  it("gives the beheerder CRUD on content, junctions, and files", () => {
    const beheerder = loadRoles().find((role) => role.name === "Isabloom beheerder");
    expect(beheerder).toBeTruthy();
    const crud = ["create", "read", "update", "delete"];
    for (const collection of [...CONTENT_COLLECTIONS, ...JUNCTION_COLLECTIONS, "directus_files"]) {
      expect(beheerder?.collections[collection]?.actions).toEqual(crud);
    }
    for (const collection of SYSTEM_COLLECTIONS) {
      expect(beheerder?.collections[collection]).toBeUndefined();
    }
  });

  it("gives Website read-only access with publish filters", () => {
    const website = loadRoles().find((role) => role.name === "Website");
    expect(website?.appAccess).toBe(false);
    for (const collection of [...CONTENT_COLLECTIONS, "directus_files"]) {
      expect(website?.collections[collection]?.actions).toEqual(["read"]);
    }
    expect(website?.collections.offer_items.filter).toEqual({ active: { _eq: true } });
    expect(website?.collections.team_members.filter).toEqual({ active: { _eq: true } });
    expect(website?.collections.blog_posts.filter).toEqual({ status: { _eq: "published" } });
  });

  it("does not mention country or site_settings item values", () => {
    const raw = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "seed", "roles.json"),
      "utf8",
    );
    expect(raw).not.toContain("\"BE\"");
    expect(raw).not.toContain("country");
  });
});
```

Do not parse the snapshot with yaml in this file unless needed. Remove the unused `parse` import if you copy the snippet as-is.

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL. `ENOENT` for `directus/seed/roles.json`.

- [ ] **Step 3: Write `directus/seed/roles.json`**

The JSON must satisfy the tests exactly: two roles, CRUD vs read, filters, no `country` / `BE`. Website has `appAccess: false`. Beheerder has `appAccess: true`.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: PASS (snapshot tests plus role tests).

- [ ] **Step 5: Commit**

```bash
git add directus/seed/roles.json directus/roles.test.ts
git commit -m "$(cat <<'EOF'
Add role seed contract for the client editor and website reader.

Keep country out of the seed file so BE stays a schema default applied with the snapshot.
EOF
)"
```

---

### Task 8: Docker Compose, entrypoint, and role seed job

**Files:**
- Create: `.env.example`
- Create: `docker-compose.yml`
- Create: `directus/scripts/entrypoint.sh`
- Create: `directus/scripts/seed-roles.mjs`
- Create: `uploads/.gitkeep`
- Create: `data/.gitkeep` only if you keep an empty dir; prefer composing named volumes instead of committing `data/`

**Interfaces:**
- Consumes: `directus/schema/snapshot.yaml`, `directus/seed/roles.json`, `DIRECTUS_VERSION`
- Produces: `docker compose up` that applies schema then upserts roles

- [ ] **Step 1: Confirm the Directus 12 image layout**

```bash
docker pull directus/directus:12.0.2
docker run --rm --entrypoint ls directus/directus:12.0.2 /directus
```

Expected: `cli.js` is present. If the tag is missing, pull the newest `12.x` that exists, update `DIRECTUS_VERSION` in `directus/model.ts`, regenerate the snapshot, and keep tests green. Do not use `latest`.

If `cli.js` lives elsewhere, point the entrypoint at the path you found.

- [ ] **Step 2: Write `.env.example`**

```
POSTGRES_USER=directus
POSTGRES_PASSWORD=directus
POSTGRES_DB=directus
DIRECTUS_SECRET=replace-with-random-value
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-me
PUBLIC_URL=http://localhost:8055
```

- [ ] **Step 3: Write the entrypoint**

Create `directus/scripts/entrypoint.sh`:

```sh
#!/bin/sh
set -e
node /directus/cli.js bootstrap
node /directus/cli.js schema apply --yes /directus/schema/snapshot.yaml
exec node /directus/cli.js start
```

`chmod +x directus/scripts/entrypoint.sh`

- [ ] **Step 4: Write `directus/scripts/seed-roles.mjs`**

The script:

1. Waits until `GET ${PUBLIC_URL}/server/ping` is ok (retry 30 times, 2s apart).
2. `POST /auth/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. Reads `roles.json`.
4. For each role: `GET /roles?filter[name][_eq]=...`. If missing, `POST /roles` with `name`, `app_access`, `admin_access`.
5. Deletes existing permissions for that role on collections listed in the JSON, then `POST /permissions` for each action.
6. `PATCH /settings` with `{ default_language: "nl-NL" }`.
7. Must never PATCH `site_settings` or write `country`.

Login body: `{ "email": process.env.ADMIN_EMAIL, "password": process.env.ADMIN_PASSWORD }`.
Authorization header: `Bearer ${data.data.access_token}`.

Permission body:

```js
{
  role: roleId,
  collection,
  action,
  fields: ["*"],
  permissions: filter ?? {},
  validation: {},
  presets: null,
}
```

- [ ] **Step 5: Write `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

  directus:
    image: directus/directus:12.0.2
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8055:8055"
    environment:
      SECRET: ${DIRECTUS_SECRET}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PUBLIC_URL: ${PUBLIC_URL}
      DB_CLIENT: pg
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: ${POSTGRES_DB}
      DB_USER: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./directus/schema/snapshot.yaml:/directus/schema/snapshot.yaml:ro
      - ./directus/scripts/entrypoint.sh:/directus/custom-entrypoint.sh:ro
      - uploads:/directus/uploads
    entrypoint: ["/bin/sh", "/directus/custom-entrypoint.sh"]
    healthcheck:
      test: ["CMD-SHELL", "wget --spider -q http://localhost:8055/server/ping || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 12
      start_period: 40s

  seed:
    image: node:22-alpine
    depends_on:
      directus:
        condition: service_healthy
    environment:
      PUBLIC_URL: http://directus:8055
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
    volumes:
      - ./directus/seed/roles.json:/seed/roles.json:ro
      - ./directus/scripts/seed-roles.mjs:/seed-roles.mjs:ro
    command: ["node", "/seed-roles.mjs"]
    restart: "no"

volumes:
  postgres_data:
  uploads:
```

Create `uploads/.gitkeep`.

- [ ] **Step 6: Boot and smoke-check locally**

```bash
cp .env.example .env
docker compose up --build
```

Expected:

- Directus answers `http://localhost:8055/server/ping`
- Admin login works with `.env` credentials
- Content collections exist under Dutch names
- `site_settings.country` shows default `BE` on a new singleton without the seed writing it
- Roles `Isabloom beheerder` and `Website` exist
- `npm test` still passes without Docker (run in another terminal)

If `schema apply` rejects the generated YAML, read the CLI error, adjust `build-snapshot.ts` so the snapshot matches Directus 12's expected meta keys, regenerate, keep tests green. After the first successful apply, optionally export:

```bash
docker compose exec directus node /directus/cli.js schema snapshot /tmp/out.yaml
```

Copy only if tests still pass. Do not reintroduce `products`. Do not drop `schema.default_value: BE`.

- [ ] **Step 7: Commit**

```bash
git add docker-compose.yml .env.example directus/scripts uploads/.gitkeep
git commit -m "$(cat <<'EOF'
Add local Directus Compose with schema apply on boot.

Apply the snapshot before start so country default BE exists on a clean volume without role-seed data.
EOF
)"
```

---

### Task 9: README and how to add a field

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: compose commands, `npm test`, `npm run cms:snapshot`
- Produces: operator docs in Dutch

- [ ] **Step 1: Replace `README.md`**

Write Dutch README covering:

1. What this repo is (Isabloom CMS-laag, frontend volgt later).
2. `cp .env.example .env` then `docker compose up`.
3. Open `http://localhost:8055`, login with `ADMIN_EMAIL`.
4. `npm test` runs without Docker.
5. How to add a field: English key, `nl-NL` label in `directus/model.ts` and the builder, `npm run cms:snapshot`, `npm test`, commit YAML, never rename existing keys.
6. Roles live in `directus/seed/roles.json`, not in the snapshot.
7. No webshop, no client login, no dummy content in v1.
8. File folders per type are a later iteration.

No em-dashes. No invented brand copy.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
Document local Directus startup and additive field changes.

Describe the snapshot contract so a new optional field cannot silently rename English API keys.
EOF
)"
```

---

### Task 10: Pull request into pre-production

**Files:** none besides pushing the branch

- [ ] **Step 1: Re-run tests**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin HEAD
gh pr create --base pre-production --title "Directus contentmodel met snapshot en NL-labels" --body "$(cat <<'EOF'
## Summary
- Directus 12 + Postgres 16 lokaal, schema-snapshot in git, apply bij opstart.
- Engelse API-keys, Nederlandse paneel-labels, country-default BE in de snapshot (niet in de seed).
- Contracttesten voor collecties, enums, Repeater-openingsuren, native accent_color-regex, junctions en rollen.

## Test plan
- [ ] `npm test` is groen zonder Docker
- [ ] `docker compose up` start Directus op :8055
- [ ] Collecties hebben NL-namen in het paneel
- [ ] Nieuw site_settings-item toont Land = BE zonder seed-data
- [ ] Rollen "Isabloom beheerder" en "Website" bestaan
- [ ] Geen products-collectie
EOF
)"
```

Expected: PR URL against `pre-production`.

---

## Self-review

**Spec coverage**

| Spec item | Task |
|---|---|
| English keys, nl-NL labels | 1-6 |
| Snapshot in git, apply on boot | 1, 8 |
| Lean Postgres + Directus, no Redis, no Next.js | 8 |
| Seven content collections + two junctions, no products | 1, 6 |
| site_settings fields, opening_hours repeater | 2 |
| country default BE in snapshot | 2, 7, 8 |
| services, offer_items, enums | 3 |
| portfolio, team, blog WYSIWYG | 4 |
| season_themes + native regex | 5 |
| M2M sort+alt junctions | 6 |
| Roles beheerder + Website, no client user | 7-8 |
| Seed does not set country | 7-8 |
| Vitest without Docker | 1-7 |
| README additive-field contract | 9 |
| PR to pre-production | 10 |
| No folders per type (later) | 9 |
| No dummy copy / season rows | 5, 8 |

**Placeholder scan:** none of TBD / implement later / similar-to-Task-N.

**Type consistency:** `CONTENT_COLLECTIONS`, `JUNCTION_COLLECTIONS`, `COUNTRY_DEFAULT`, `ACCENT_COLOR_REGEX`, `OFFER_CATEGORIES`, `BLOG_STATUSES`, `loadSnapshot`, `buildSnapshot`, `roles.json` names stay identical across tasks.
