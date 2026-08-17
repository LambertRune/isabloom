import { describe, expect, it } from "vitest";
import { BEHEER_SECTIONS } from "./sections.ts";

describe("beheer dashboard", () => {
  it("lists the content sections that the client fills in the paneel", () => {
    expect(BEHEER_SECTIONS.map((item) => item.href)).toEqual([
      "/beheer/zaakgegevens",
      "/beheer/diensten",
      "/beheer/aanbod",
      "/beheer/portfolio",
      "/beheer/team",
    ]);
  });
});
