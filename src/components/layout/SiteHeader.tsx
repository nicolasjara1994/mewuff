import Link from "next/link";

import { CartLink } from "@/components/cart/CartLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { mainNav, trackingNav } from "@/lib/site";

import { HeaderScrollState } from "./HeaderScrollState";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header
      data-site-header
      className="theme-dark fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-cream/95 backdrop-blur-md supports-[backdrop-filter]:bg-cream/90"
    >
      <Container className="relative flex h-16 items-center justify-between gap-6 sm:h-20">
        <HeaderScrollState />
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <Logo adaptive />
        </div>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {[...mainNav, trackingNav].map((item) => (
              <li key={item.href} className={item.href === trackingNav.href ? "hidden lg:block" : undefined}>
                <Link
                  href={item.href}
                  className="relative rounded-sm py-2 text-sm font-medium text-ink-soft transition-colors after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CartLink />
          <ButtonLink href="/personaliza" className="min-h-10 px-5 text-sm">
            Crear mi figura
          </ButtonLink>
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <CartLink />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
