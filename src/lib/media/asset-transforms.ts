export const MEDIA_UUID = /^[0-9a-f-]{36}$/i;
export const MAX_ASSET_EDGE = 2400;
const FORMATS = new Set(["webp", "avif", "jpg", "jpeg", "png"]);
const FITS = new Set(["cover", "contain", "inside", "outside"]);

export type AssetTransforms = {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
};

function clampInt(value: string | null, min: number, max: number): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.min(max, Math.max(min, parsed));
}

export function parseAssetTransforms(params: URLSearchParams): AssetTransforms {
  const format = params.get("format");
  const fit = params.get("fit");
  return {
    width: clampInt(params.get("width"), 1, MAX_ASSET_EDGE),
    height: clampInt(params.get("height"), 1, MAX_ASSET_EDGE),
    quality: clampInt(params.get("quality"), 1, 100),
    format: format && FORMATS.has(format) ? format : undefined,
    fit: fit && FITS.has(fit) ? fit : undefined,
  };
}

export function buildDirectusAssetPath(id: string, transforms: AssetTransforms): string {
  const params = new URLSearchParams();
  if (transforms.width) {
    params.set("width", String(transforms.width));
  }
  if (transforms.height) {
    params.set("height", String(transforms.height));
  }
  if (transforms.quality) {
    params.set("quality", String(transforms.quality));
  }
  if (transforms.format) {
    params.set("format", transforms.format);
  }
  if (transforms.fit) {
    params.set("fit", transforms.fit);
  }
  const query = params.toString();
  return query ? `/assets/${id}?${query}` : `/assets/${id}`;
}
