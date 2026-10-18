import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig, trackingNav } from "@/lib/site";

import { Logo } from "./Logo";

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

        <div>
          <h2 className="text-xs font-medium tracking-[0.2em] text-ink uppercase">Síguenos</h2>
          <ul className="mt-5 space-y-3">
            {siteConfig.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-muted transition-colors hover:text-ink">
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
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
