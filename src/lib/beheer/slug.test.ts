import { describe, expect, it } from "vitest";
import { slugFromTitle } from "./slug.ts";

describe("slugFromTitle", () => {
  it("turns a Dutch title into a stable slug", () => {
    expect(slugFromTitle("Business styling")).toBe("business-styling");
    expect(slugFromTitle("Verhuur Kerst")).toBe("verhuur-kerst");
  });
});
