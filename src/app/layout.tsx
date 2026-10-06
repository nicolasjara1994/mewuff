import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Figuras personalizadas de mascotas hechas a mano`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "figuras personalizadas de mascotas",
    "figura de perro personalizada",
    "figura de gato personalizada",
    "escultura de mascota",
    "regalo personalizado mascota",
    "figura artesanal mascota",
    "recuerdo de mascota",
    "Chile",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} · Tu mascota, convertida en una pieza única`,
    description: siteConfig.description,
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Figura artesanal de un perro sobre una base de madera" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · Tu mascota, convertida en una pieza única`,
    description: siteConfig.description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.svg`,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  sameAs: siteConfig.social.map((item) => item.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-dvh">
        {/* Sin JavaScript, el contenido animado debe verse igual. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#contenido"
          className="fixed top-4 left-4 z-50 -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
        </MotionProvider>
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
