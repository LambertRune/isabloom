import Image from "next/image";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { cmsImageLoader } from "@/lib/media/cms-image-loader.ts";

export function CmsImage({
  fileId,
  alt,
  caption,
  className = "",
  sizes = "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw",
}: {
  fileId: string | null;
  alt: string;
  caption?: string | null;
  className?: string;
  sizes?: string;
}) {
  const label = caption || alt;
  if (!fileId) {
    return <ImagePlaceholder label={label} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden border border-line ${className}`.trim()}>
      <Image
        src={`/media/${fileId}`}
        alt={alt}
        fill
        sizes={sizes}
        loader={cmsImageLoader}
        className="object-cover"
      />
      {label ? (
        <p className="absolute bottom-0 left-0 px-4 py-3 text-xs tracking-[0.16em] text-paper uppercase">
          {label}
        </p>
      ) : null}
    </div>
  );
}
