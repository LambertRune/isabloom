import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
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
