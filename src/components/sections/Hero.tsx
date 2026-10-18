import Image from "next/image";

import heroImage from "@/assets/figures/hero-sculpture.png";
import { ArrowIcon, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Parallax } from "@/components/ui/Parallax";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

const HIGHLIGHTS = ["Modelada a mano", "Pieza única", "Envíos a todo Chile"];

/**
 * Hero: la imagen es el elemento LCP, por eso se precarga y NO se anima su opacidad.
 * El texto aparece con una animación CSS (sin esperar a que cargue JavaScript).
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-photo relative overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32"
    >
      <SectionBackdrop photo="luke" preload />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-6 text-xs font-medium tracking-[0.24em] text-clay uppercase motion-safe:animate-fade-up">
            Estudio de figuras personalizadas
          </p>
          <h1
            id="hero-title"
            className="font-display text-[2.75rem] leading-[1.02] font-normal tracking-[-0.02em] text-balance text-ink motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] sm:text-6xl lg:text-7xl"
          >
            Tu mascota, convertida en una <em className="text-clay">pieza única.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-muted motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] sm:text-xl">
            Creamos figuras personalizadas a partir de tus fotografías. Cada pieza se modela y se pinta a mano para
            capturar su mirada, sus manchas y su forma de ser.
          </p>

          <div className="mt-10 flex flex-col gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="/personaliza">
              Crear mi figura
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href="#proceso" variant="secondary">
              Conocer el proceso
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted motion-safe:animate-fade-up motion-safe:[animation-delay:320ms]">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-clay-soft" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* Resplandor tras la escultura: la separa del fondo fotográfico. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[8%] bg-[radial-gradient(closest-side,rgb(169_138_117/0.34),transparent)]"
          />
          {/* PNG con fondo transparente: no lleva marco ni recorte, se apoya sobre el fondo. */}
          <Parallax offset={24} className="relative aspect-[4/5]">
            <Image
              src={heroImage}
              alt="Escultura de muestra de un gato sentado, en cerámica color marfil sobre una base de madera."
              preload
              fetchPriority="high"
              sizes="(min-width: 1024px) 46vw, (min-width: 640px) 80vw, 92vw"
              className="h-full w-full object-contain"
            />
          </Parallax>
          <PlaceholderBadge className="absolute top-4 right-4" />
          <div className="absolute -bottom-6 left-4 max-w-[15rem] rounded-2xl border border-line/70 bg-cream/90 p-4 shadow-[0_20px_40px_-24px_rgb(47_25_12/0.5)] backdrop-blur sm:left-[-1.5rem]">
            <p className="font-display text-lg leading-snug text-ink">“Hasta el último bigote.”</p>
            <p className="mt-1 text-xs text-muted">Cada detalle se revisa con tus fotos.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
