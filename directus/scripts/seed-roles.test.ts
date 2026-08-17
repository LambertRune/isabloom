import { describe, expect, it } from "vitest";
import { handlePermissionPostError } from "./seed-roles.mjs";

describe("seed-roles fail-closed filters", () => {
  const restricted = new Error(
    'POST /permissions failed (403): {"errors":[{"extensions":{"code":"custom_permission_rules_enabled"}}]}',
  );

  it("fails the seed when Core rejects a non-empty item filter", () => {
    const body = {
      collection: "blog_posts",
      action: "read",
      permissions: { status: { _eq: "published" } },
    };

    expect(() => handlePermissionPostError(restricted, body)).toThrow(
      /LICENSE_KEY[\s\S]*will not grant Website read/i,
    );
  });

  it("does not rewrite unfiltered reads as a license failure", () => {
    const body = {
      collection: "site_settings",
      action: "read",
      permissions: {},
    };

    expect(() => handlePermissionPostError(restricted, body)).toThrow(restricted);
  });

  it("rethrows unrelated permission errors", () => {
    const other = new Error("POST /permissions failed (500): boom");
    const body = {
      collection: "blog_posts",
      action: "read",
      permissions: { status: { _eq: "published" } },
    };

    expect(() => handlePermissionPostError(other, body)).toThrow(other);
  });
});
