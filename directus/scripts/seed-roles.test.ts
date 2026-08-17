import { describe, expect, it } from "vitest";
import {
  hasNonEmptyFilter,
  isLicenseFilterBlock,
} from "./seed-roles.mjs";

describe("seed-roles website filters", () => {
  it("detects Core rejecting custom item filters", () => {
    const restricted = new Error(
      'POST /permissions failed (403): {"errors":[{"extensions":{"code":"custom_permission_rules_enabled"}}]}',
    );
    expect(isLicenseFilterBlock(restricted)).toBe(true);
    expect(
      hasNonEmptyFilter({ status: { _eq: "published" } }),
    ).toBe(true);
  });

  it("treats empty permissions as unfiltered reads", () => {
    expect(hasNonEmptyFilter({})).toBe(false);
    expect(isLicenseFilterBlock(new Error("POST /permissions failed (500)"))).toBe(
      false,
    );
  });
});
