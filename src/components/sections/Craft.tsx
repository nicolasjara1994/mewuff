import Image from "next/image";

import atelierImage from "@/assets/placeholders/atelier.webp";
import { Container } from "@/components/ui/Container";
import { Parallax } from "@/components/ui/Parallax";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    title: "Hecha a mano, de principio a fin",
    text: "Sin moldes genéricos: cada figura se esculpe, se lija y se pinta a mano en nuestro taller.",
  },
  {
    title: "Fiel a lo que la hace única",
    text: "Las manchas, la forma de las orejas, el color de sus ojos. Estudiamos tus fotos con calma.",
  },
  {
    title: "Una pieza para toda la vida",
    text: "Materiales nobles y sellado protector, en una pieza firmada y numerada que no se repite.",
  },
];

export function Craft() {
  return (
    <section aria-labelledby="craft-title" className="py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <Parallax offset={20} className="aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand">
              <Image
                src={atelierImage}
                alt="Figura de muestra de un gato color terracota sobre una base de madera."
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="h-full w-full scale-[1.05] object-cover"
              />
            </Parallax>
            <PlaceholderBadge className="absolute top-4 left-4" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionHeading
              id="craft-title"
              eyebrow="Nuestro oficio"
              title="No hacemos figuras en serie. Hacemos retratos que se pueden tocar."
            />
          </Reveal>
          <ul className="mt-12 space-y-8">
            {PILLARS.map((pillar, index) => (
              <Reveal as="li" key={pillar.title} delay={index * 0.08} className="border-t border-line pt-6">
                <h3 className="font-serif text-xl text-ink">{pillar.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{pillar.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
