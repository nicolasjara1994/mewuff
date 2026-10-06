import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/site";

import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-cream/80 backdrop-blur-md supports-[backdrop-filter]:bg-cream/70">
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative rounded-sm py-2 text-sm font-medium text-ink-soft transition-colors after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-clay after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/personaliza" className="min-h-10 px-5 text-sm">
            Crear mi figura
          </ButtonLink>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
