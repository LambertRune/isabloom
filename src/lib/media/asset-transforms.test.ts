import { describe, expect, it } from "vitest";
import {
  buildDirectusAssetPath,
  parseAssetTransforms,
} from "./asset-transforms.ts";

describe("Directus asset transforms", () => {
  it("forwards width, quality and webp format to the Directus asset URL", () => {
    const transforms = parseAssetTransforms(
      new URLSearchParams("width=800&quality=75&format=webp"),
    );
    expect(transforms).toEqual({
      width: 800,
      quality: 75,
      format: "webp",
    });
    expect(buildDirectusAssetPath("11111111-1111-1111-1111-111111111111", transforms)).toBe(
      "/assets/11111111-1111-1111-1111-111111111111?width=800&quality=75&format=webp",
    );
  });

  it("drops unknown formats and clamps oversized widths", () => {
    const transforms = parseAssetTransforms(
      new URLSearchParams("width=99999&format=exe"),
    );
    expect(transforms.width).toBe(2400);
    expect(transforms.format).toBeUndefined();
  });
});
