import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig, trackingNav } from "@/lib/site";

import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-dark bg-cream">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            Figuras de mascotas modeladas y pintadas a mano, una a una, a partir de tus fotografías.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-xs font-medium tracking-[0.2em] text-ink uppercase">Explorar</h2>
          <ul className="mt-5 space-y-3">
            {[{ label: "Crear mi figura", href: "/personaliza" }, ...mainNav, trackingNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rounded-[1.75rem] bg-night p-6 sm:col-span-2 lg:col-span-1">
          <h2 className="text-xs font-medium tracking-[0.2em] text-ink uppercase">Síguenos</h2>
          <ul className="mt-5 flex items-center gap-3">
            {siteConfig.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-clay-light hover:text-clay-light"
                >
                  <SocialIcon name={item.label} className="size-5" />
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="mt-5 block text-sm break-all text-muted transition-colors hover:text-ink"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}. Hecho a mano en {siteConfig.contact.city}.
        </p>
        <Link href="/privacidad" className="transition-colors hover:text-ink">
          Política de privacidad
        </Link>
      </Container>
    </footer>
  );
}
