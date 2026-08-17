import type { ImageLoaderProps } from "next/image";

export function cmsImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 75),
    format: "webp",
  });
  return `${src}?${params.toString()}`;
}

export function cmsLogoLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 90),
  });
  return `${src}?${params.toString()}`;
}
