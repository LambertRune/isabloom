import { describe, expect, it } from "vitest";
import { cmsImageLoader, cmsLogoLoader } from "./cms-image-loader.ts";

describe("CMS image loaders", () => {
  it("asks the media proxy for a sized webp photo", () => {
    expect(
      cmsImageLoader({
        src: "/media/11111111-1111-1111-1111-111111111111",
        width: 800,
        quality: 75,
      }),
    ).toBe(
      "/media/11111111-1111-1111-1111-111111111111?width=800&quality=75&format=webp",
    );
  });

  it("keeps the original logo format so SVG wordmarks still load", () => {
    expect(
      cmsLogoLoader({
        src: "/media/11111111-1111-1111-1111-111111111111",
        width: 180,
        quality: 90,
      }),
    ).toBe("/media/11111111-1111-1111-1111-111111111111?width=180&quality=90");
  });
});
