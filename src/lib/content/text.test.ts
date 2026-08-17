import { describe, expect, it } from "vitest";
import { shortenText } from "./text.ts";

describe("shortenText", () => {
  it("keeps short copy intact and trims longer lines", () => {
    expect(shortenText("Kort.", 40)).toBe("Kort.");
    expect(shortenText("Etalages, kantoren, horeca en shop-in-shop.", 20)).toBe(
      "Etalages, kantoren…",
    );
  });
});
