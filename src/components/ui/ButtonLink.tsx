import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Estilos compartidos entre <ButtonLink> y <button>. Las microinteracciones son
 * CSS puro (sin JavaScript): leve elevación en hover y compresión al presionar.
 */
export function buttonStyles(variant: ButtonVariant = "primary", className?: string): string {
  return cn(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[0.95rem] font-semibold tracking-wide",
    "transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-(--ease-soft)",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" && "bg-ink text-cream shadow-[0_8px_24px_-12px_rgb(43_38_34/0.6)] hover:bg-ink-soft",
    variant === "secondary" && "border border-ink/25 bg-transparent text-ink hover:border-ink/60 hover:bg-linen",
    variant === "ghost" && "px-0 text-ink underline decoration-clay/50 underline-offset-[6px] hover:decoration-clay",
    className,
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonStyles(variant, className)} {...props}>
      {children}
    </Link>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("size-4 transition-transform duration-300 group-hover:translate-x-0.5", className)}
    >
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
