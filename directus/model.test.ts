import { describe, expect, it } from "vitest";
import {
  ACCENT_COLOR_MESSAGE,
  ACCENT_COLOR_REGEX,
  BLOG_FIELDS,
  BLOG_STATUSES,
  CONTENT_COLLECTIONS,
  COUNTRY_DEFAULT,
  FORBIDDEN_COLLECTIONS,
  JUNCTION_COLLECTIONS,
  OFFER_CATEGORIES,
  OFFER_ITEM_FIELDS,
  PORTFOLIO_FIELDS,
  SEASON_THEME_FIELDS,
  SERVICE_FIELDS,
  SITE_SETTINGS_FIELDS,
  TEAM_FIELDS,
} from "./model.ts";
import { getCollection, getField, loadSnapshot, nlLabel } from "./load-snapshot.ts";

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

describe("portfolio, team, and blog", () => {
  it("has Dutch labels on every portfolio field", () => {
    const snapshot = loadSnapshot();
    for (const field of PORTFOLIO_FIELDS) {
      expect(nlLabel(getField(snapshot, "portfolio_items", field).meta?.translations)).toBeTruthy();
    }
  });

  it("has Dutch labels on every team field", () => {
    const snapshot = loadSnapshot();
    for (const field of TEAM_FIELDS) {
      expect(nlLabel(getField(snapshot, "team_members", field).meta?.translations)).toBeTruthy();
    }
  });

  it("has Dutch labels on every blog field", () => {
    const snapshot = loadSnapshot();
    for (const field of BLOG_FIELDS) {
      expect(nlLabel(getField(snapshot, "blog_posts", field).meta?.translations)).toBeTruthy();
    }
  });

  it("requires portfolio image", () => {
    const snapshot = loadSnapshot();
    const image = getField(snapshot, "portfolio_items", "image");
    expect(image.schema?.is_nullable).toBe(false);
  });

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
});

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
