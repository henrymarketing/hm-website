/** Placeholder for missing image assets — replace with real WebP/AVIF. */
export function AssetPlaceholder({
  label,
  todo,
  aspect = 'aspect-video',
  className = '',
}: {
  label: string;
  todo: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full ${aspect} bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center ${className}`}
      // TODO: {todo}
      data-todo={todo}
    >
      <span className="text-neutral-600 text-xs tracking-[0.2em] uppercase mb-2">{label}</span>
      <span className="text-neutral-700 text-xs max-w-sm leading-relaxed">{todo}</span>
    </div>
  );
}
