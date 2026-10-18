import type { Metadata } from "next";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Conoce el proceso para crear la figura personalizada de tu mascota: envías tus fotos, revisamos los detalles, diseñamos la pieza y la creamos a mano.",
  alternates: { canonical: "/como-funciona" },
};

const PHOTO_TIPS = [
  { title: "Luz natural", text: "Cerca de una ventana y sin flash: así vemos el color real del pelaje." },
  { title: "A su altura", text: "Agáchate para fotografiarla a la altura de sus ojos, no desde arriba." },
  {
    title: "Varios ángulos",
    text: "Frente, perfil y cuerpo completo. Si tiene una mancha especial, muéstrala de cerca.",
  },
  { title: "Nítidas", text: "Mejor pocas fotos enfocadas que muchas movidas o con filtros." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cómo funciona"
        title="UN PROCESO CERCANO DE PRINCIPIO A FIN"
        description="Cada figura es un encargo único. Así trabajamos para que la pieza que recibas se sienta como tu mascota."
      />

      <section aria-label="Pasos del proceso" className="pb-24">
        <Container>
          <ProcessSteps detailed />
          <p className="mt-6 text-sm text-muted">
            Los plazos son aproximados y te los confirmamos en la propuesta antes de comenzar.
          </p>
        </Container>
      </section>

      <section aria-labelledby="tips-title" className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              id="tips-title"
              eyebrow="Antes de enviar"
              title="CÓMO TOMAR LAS MEJORES FOTOS DE TU MASCOTA"
              description="No necesitas una cámara profesional: un celular y un poco de paciencia son suficientes."
            />
          </Reveal>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PHOTO_TIPS.map((tip, index) => (
              <Reveal
                as="li"
                key={tip.title}
                delay={index * 0.07}
                className="rounded-[1.5rem] border border-line bg-cream p-7 transition-transform duration-500 hover:-translate-y-1"
              >
                <h3 className="font-display text-xl text-ink">{tip.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{tip.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
