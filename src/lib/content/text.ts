export function shortenText(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  const clipped = trimmed
    .slice(0, max)
    .replace(/\s+\S*$/, "")
    .replace(/[.,;:!?-]+$/, "");
  return `${clipped}…`;
}
