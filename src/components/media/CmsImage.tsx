import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function CmsImage({
  fileId,
  alt,
  caption,
  className = "",
}: {
  fileId: string | null;
  alt: string;
  caption?: string | null;
  className?: string;
}) {
  const label = caption || alt;
  if (!fileId) {
    return <ImagePlaceholder label={label} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden border border-line ${className}`.trim()}>
      {/* Server-side proxy keeps the Directus token off the public HTML. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/${fileId}`} alt={alt} className="h-full w-full object-cover" />
      {label ? (
        <p className="absolute bottom-0 left-0 px-4 py-3 text-xs tracking-[0.16em] text-paper uppercase">
          {label}
        </p>
      ) : null}
    </div>
  );
}
