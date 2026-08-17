import { describe, expect, it } from "vitest";
import { BEHEER_ME_FIELDS, canAccessBeheer, safeBeheerPath } from "./access.ts";

describe("beheer access", () => {
  it("lets the Isabloom beheerder in and keeps the Website role out", () => {
    expect(
      canAccessBeheer({
        status: "active",
        role: { name: "Isabloom beheerder", app_access: true, admin_access: false },
      }),
    ).toBe(true);
    expect(
      canAccessBeheer({
        status: "active",
        role: { name: "Website", app_access: false, admin_access: false },
      }),
    ).toBe(false);
    expect(
      canAccessBeheer({
        status: "active",
        role: { name: "Administrator" },
      }),
    ).toBe(true);
  });

  it("only returns paths inside /beheer", () => {
    expect(safeBeheerPath("/beheer/diensten")).toBe("/beheer/diensten");
    expect(safeBeheerPath("https://evil.example/beheer")).toBe("/beheer");
    expect(safeBeheerPath("//evil.example")).toBe("/beheer");
  });

  it("asks Directus for the nested role object, not a role uuid", () => {
    expect(BEHEER_ME_FIELDS).toContain("role.*");
  });
});
