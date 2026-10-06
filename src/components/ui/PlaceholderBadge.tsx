import { cn } from "@/lib/cn";

/** Marca visible para imágenes de muestra, de modo que nunca se confundan con trabajos reales. */
export function PlaceholderBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-cream/85 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-muted uppercase backdrop-blur-sm",
        className,
      )}
    >
      Imagen de muestra
    </span>
  );
}
