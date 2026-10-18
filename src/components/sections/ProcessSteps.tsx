import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/cn";

/**
 * Proceso como línea de tiempo vertical: una línea central con los pasos
 * numerados, y texto e imagen alternando de lado en pantallas anchas.
 * Cada número queda sobre la línea, a la altura del centro de su imagen.
 * Es una lista ordenada (<ol>), lo que comunica el orden a lectores de pantalla.
 * Con `detailed` se agrega el texto largo de cada paso.
 */
export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="relative lg:-mx-8 xl:-mx-16 2xl:-mx-24">
      {/* Línea vertical: a la izquierda en móvil, centrada en pantallas anchas. */}
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-5 w-px bg-line lg:left-1/2" />
      {processSteps.map((step, index) => {
        const reversed = index % 2 === 1;
        return (
          <li
            key={step.title}
            className="relative pb-16 pl-16 last:pb-0 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-20 lg:pb-24 lg:pl-0"
          >
            <Reveal delay={0.08} className={cn("relative mb-6 lg:mb-0", !reversed && "lg:order-2")}>
              {/* Número centrado en vertical respecto de la imagen, sobre la línea. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 -left-16 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent font-display text-sm text-white",
                  reversed ? "lg:-right-15 lg:left-auto" : "lg:-left-15",
                )}
              >
                {index + 1}
              </span>
              <div className="aspect-4/3 overflow-hidden bg-line">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 50vw, 92vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal className={cn(!reversed && "lg:order-1 lg:text-right")}>
              <h3 className="font-display text-2xl leading-snug text-ink">
                <span className="sr-only">Paso {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{step.summary}</p>
              {detailed && <p className="mt-3 leading-relaxed text-ink-soft">{step.detail}</p>}
              <p className="mt-4 text-sm font-medium text-sage">
                <span className="sr-only">Duración aproximada: </span>
                {step.duration}
              </p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
