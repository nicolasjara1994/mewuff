import type { Metadata } from "next";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getGalleryItems } from "@/services/gallery/gallery";

export const metadata: Metadata = {
  title: "Galería de figuras",
  description:
    "Explora figuras personalizadas de perros, gatos y otras mascotas, modeladas y pintadas a mano en nuestro taller.",
  alternates: { canonical: "/galeria" },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <section aria-label="Galería de figuras" className="theme-dark pb-16">
        <PageHeader
          eyebrow="Galería"
          title="PIEZAS ÚNICAS, HECHAS CON CARIÑO"
          description="Cada figura nace de las fotos y las historias que nos comparten. Estas son algunas de ellas."
        />
        <Container className="lg:pb-12">
          <GalleryGrid items={items} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
