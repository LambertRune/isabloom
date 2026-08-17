type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

export function ImagePlaceholder({ label, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex items-end border border-line bg-chalk ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <p className="px-4 py-3 text-xs tracking-[0.16em] text-muted uppercase">
        {label}
      </p>
    </div>
  );
}
