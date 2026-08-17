/**
 * Isabloom basispalet. Seizoensthema's wisselen later alleen de accentlaag
 * (--color-moss / --color-accent), niet paper/gold/ink.
 *
 * Goud komt uit de brief (#A67C3D tot #8C6D3F) tot het logo-bestand
 * beschikbaar is om exact te samplen.
 */
export const TOKENS = {
  paper: "#F4EEE4",
  chalk: "#EBE3D4",
  ink: "#1F2A24",
  muted: "#5C675F",
  gold: "#A67C3D",
  goldDeep: "#8C6D3F",
  moss: "#1F3D2B",
  line: "#D9CDB8",
} as const;

export const FORBIDDEN_SURFACE = "#FFFFFF";

export const FONTS = {
  serif: "Fraunces",
  sans: "Source Sans 3",
} as const;
