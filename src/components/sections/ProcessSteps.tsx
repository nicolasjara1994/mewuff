import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/cn";

/**
 * Proceso en 5 pasos como lista ordenada (<ol>), lo que comunica el orden
 * también a lectores de pantalla.
 */
export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol
      className={cn(
        "grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line",
        detailed ? "lg:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-5",
      )}
    >
      {processSteps.map((step, index) => (
        <Reveal
          as="li"
          key={step.title}
          delay={index * 0.07}
          className={cn(
            "group relative bg-cream p-7 transition-colors duration-500 hover:bg-linen sm:p-8",
            detailed && "sm:grid sm:grid-cols-[8rem_1fr_12rem] sm:items-baseline sm:gap-8",
          )}
        >
          <span
            aria-hidden="true"
            className="font-serif text-5xl leading-none text-clay/80 transition-transform duration-500 group-hover:-translate-y-0.5"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={cn(!detailed && "mt-8")}>
            <h3 className="font-serif text-xl leading-snug text-ink">
              <span className="sr-only">Paso {index + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{step.summary}</p>
            {detailed && <p className="mt-3 leading-relaxed text-ink-soft">{step.detail}</p>}
          </div>
          {detailed && (
            <p className="mt-4 text-sm font-medium text-sage sm:mt-0 sm:text-right">
              <span className="sr-only">Duración aproximada: </span>
              {step.duration}
            </p>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
