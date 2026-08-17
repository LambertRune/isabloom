import { describe, expect, it } from "vitest";
import { TOKENS } from "@/design/tokens.ts";
import {
  contrastRatio,
  ensureContrastOnPaper,
  resolveSeasonAccent,
} from "./contrast.ts";

describe("WCAG contrast helpers", () => {
  it("keeps paper/ink, paper/moss and paper/goldDeep at AA for 14px text", () => {
    expect(contrastRatio(TOKENS.ink, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(TOKENS.moss, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(TOKENS.goldDeep, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("darkens a weak season accent until it passes AA on paper", () => {
    const weak = "#E8C9A0";
    expect(contrastRatio(weak, TOKENS.paper)).toBeLessThan(4.5);
    const resolved = ensureContrastOnPaper(weak);
    expect(resolved).toBeTruthy();
    expect(contrastRatio(resolved as string, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("rejects invalid season accents and keeps a passing hex", () => {
    expect(resolveSeasonAccent(null)).toBe(TOKENS.goldDeep);
    expect(resolveSeasonAccent("terracotta")).toBe(TOKENS.goldDeep);
    expect(resolveSeasonAccent(TOKENS.goldDeep)).toBe(TOKENS.goldDeep);
  });
});

describe("season theme accent guard", () => {
  it("refuses a weak customer accent and keeps goldDeep as the fallback", async () => {
    const { resolveThemeAccent } = await import("@/lib/season/resolve-theme.ts");
    expect(contrastRatio(resolveThemeAccent({ accent_color: "#E8C9A0" }), TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
    expect(resolveThemeAccent(null)).toBe(TOKENS.goldDeep);
  });
});
