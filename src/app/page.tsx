import { CtaBanner } from "@/components/sections/CtaBanner";
import { Craft } from "@/components/sections/Craft";
import { FaqList } from "@/components/sections/FaqList";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Hero } from "@/components/sections/Hero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ArrowIcon, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/content/faqs";
import { getGalleryItems } from "@/services/gallery/gallery";

export default async function HomePage() {
  const galleryItems = await getGalleryItems({ limit: 3 });

  return (
    <>
      <Hero />

      <Craft />

      <section id="proceso" aria-labelledby="process-title" className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeading
                id="process-title"
                eyebrow="Cómo funciona"
                title="De tus fotos a una pieza única, en cinco pasos."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/como-funciona" variant="ghost">
                Ver el proceso en detalle
                <ArrowIcon />
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14">
            <ProcessSteps />
          </div>
        </Container>
      </section>

      <section aria-labelledby="gallery-title" className="theme-dark py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <Reveal>
              <SectionHeading id="gallery-title" eyebrow="Galería" title="Cada figura cuenta una historia distinta." />
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/galeria" variant="ghost">
                Ver galería completa
                <ArrowIcon />
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14 lg:pb-12">
            <GalleryGrid items={galleryItems} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              id="faq-title"
              eyebrow="Preguntas frecuentes"
              title="Lo que suelen preguntarnos."
              description={
                <ButtonLink href="/preguntas-frecuentes" variant="ghost" className="mt-2 text-base">
                  Ver todas las preguntas
                  <ArrowIcon />
                </ButtonLink>
              }
            />
          </Reveal>
          <Reveal delay={0.1}>
            <FaqList items={faqs.slice(0, 4)} />
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
