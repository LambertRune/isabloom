import { resolveSeasonAccent } from "@/design/contrast.ts";
import { TOKENS } from "@/design/tokens.ts";

export type SeasonRecord = {
  accent_color?: string | null;
};

export function resolveThemeAccent(theme: SeasonRecord | null | undefined): string {
  return resolveSeasonAccent(theme?.accent_color, TOKENS.goldDeep);
}
