/**
 * Isabloom basispalet. Seizoensthema's wisselen later alleen de accentlaag
 * (--color-moss / --color-accent), niet paper/gold/ink.
 *
 * Goud komt uit de brief (#A67C3D tot #8C6D3F) tot het logo-bestand
 * beschikbaar is om exact te samplen. goldDeep is donkerder dan de brief
 * zodat 14px links AA halen op paper.
 */
export const TOKENS = {
  paper: "#F4EEE4",
  chalk: "#EBE3D4",
  ink: "#1F2A24",
  muted: "#5C675F",
  gold: "#A67C3D",
  goldDeep: "#7C6136",
  moss: "#1F3D2B",
  line: "#D9CDB8",
  night: "#141210",
  blush: "#C96B7A",
  berry: "#8E3D4F",
  leaf: "#4A7C59",
} as const;

export const FORBIDDEN_SURFACE = "#FFFFFF";

export const FONTS = {
  serif: "Fraunces",
  sans: "Source Sans 3",
} as const;

export function tokenCssProperties(): Record<string, string> {
  return {
    "--token-paper": TOKENS.paper,
    "--token-chalk": TOKENS.chalk,
    "--token-ink": TOKENS.ink,
    "--token-muted": TOKENS.muted,
    "--token-gold": TOKENS.gold,
    "--token-gold-deep": TOKENS.goldDeep,
    "--token-moss": TOKENS.moss,
    "--token-line": TOKENS.line,
    "--token-night": TOKENS.night,
    "--token-blush": TOKENS.blush,
    "--token-berry": TOKENS.berry,
    "--token-leaf": TOKENS.leaf,
  };
}
