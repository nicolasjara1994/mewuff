import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md"
      aria-label={`${siteConfig.name}, ir al inicio`}
    >
      <svg
        aria-hidden="true"
        data-logo-mark
        viewBox="0 0 32 32"
        className="size-8 text-clay group-hover:rotate-[-8deg]"
      >
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <ellipse cx="16" cy="19.5" rx="5" ry="4.2" fill="currentColor" />
        <ellipse cx="10.2" cy="13.6" rx="2" ry="2.6" fill="currentColor" />
        <ellipse cx="14" cy="10.4" rx="2" ry="2.7" fill="currentColor" />
        <ellipse cx="18" cy="10.4" rx="2" ry="2.7" fill="currentColor" />
        <ellipse cx="21.8" cy="13.6" rx="2" ry="2.6" fill="currentColor" />
      </svg>
      <span data-logo-word className="font-display text-xl tracking-tight text-ink">
        MeWuff{" "}
        <span data-logo-accent className="text-clay italic">
          Studio
        </span>
      </span>
    </Link>
  );
}
