import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-clay uppercase">{eyebrow}</p>}
      <Heading
        id={id}
        className={cn(
          "font-serif font-normal tracking-[-0.015em] text-balance text-ink",
          Heading === "h1" ? "text-[2.6rem] leading-[1.05] sm:text-6xl" : "text-[2.1rem] leading-[1.1] sm:text-5xl",
        )}
      >
        {title}
      </Heading>
      {description && <div className="mt-5 text-lg leading-relaxed text-pretty text-muted">{description}</div>}
    </div>
  );
}
