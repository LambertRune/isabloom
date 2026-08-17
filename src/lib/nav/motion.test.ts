import { describe, expect, it } from "vitest";
import { secondsForMotion } from "./motion.ts";

describe("navbar motion timing", () => {
  it("converts milliseconds to seconds for GSAP", () => {
    expect(secondsForMotion(220, false)).toBe(0.22);
    expect(secondsForMotion(160, false)).toBe(0.16);
  });

  it("collapses duration when the visitor prefers reduced motion", () => {
    expect(secondsForMotion(220, true)).toBe(0);
    expect(secondsForMotion(40, true)).toBe(0);
  });
});
