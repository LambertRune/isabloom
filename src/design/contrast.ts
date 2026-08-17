import { TOKENS } from "./tokens.ts";

const HEX = /^#[0-9A-Fa-f]{6}$/;
const AA_NORMAL = 4.5;

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function linearize(channel: number) {
  const scaled = channel / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrastRatio(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function ensureContrastOnPaper(
  hex: string,
  minRatio = AA_NORMAL,
  paper = TOKENS.paper,
): string | null {
  if (!HEX.test(hex)) {
    return null;
  }
  if (contrastRatio(hex, paper) >= minRatio) {
    return hex;
  }
  const start = hexToRgb(hex);
  const ink = hexToRgb(TOKENS.ink);
  for (let step = 1; step <= 20; step += 1) {
    const t = step / 20;
    const mixed = rgbToHex({
      r: Math.round(start.r + (ink.r - start.r) * t),
      g: Math.round(start.g + (ink.g - start.g) * t),
      b: Math.round(start.b + (ink.b - start.b) * t),
    });
    if (contrastRatio(mixed, paper) >= minRatio) {
      return mixed;
    }
  }
  return TOKENS.ink;
}

export function resolveSeasonAccent(
  accent: string | null | undefined,
  fallback = TOKENS.goldDeep,
): string {
  if (!accent) {
    return fallback;
  }
  return ensureContrastOnPaper(accent) ?? fallback;
}
