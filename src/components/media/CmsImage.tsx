import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function CmsImage({
  fileId,
  alt,
  className = "",
}: {
  fileId: string | null;
  alt: string;
  className?: string;
}) {
  if (!fileId) {
    return <ImagePlaceholder label={alt} className={className} />;
  }
  return (
    // Server-side proxy keeps the Directus token off the public HTML.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/media/${fileId}`} alt={alt} className={`object-cover ${className}`.trim()} />
  );
}
