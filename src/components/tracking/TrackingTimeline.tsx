"use client";

import { m } from "framer-motion";

import type { StageView } from "@/content/tracking";
import { cn } from "@/lib/cn";

import { StageIcon } from "./StageIcon";

const STATE_LABEL = { done: "Completada", current: "En curso", upcoming: "Pendiente" } as const;

/**
 * Línea de tiempo del pedido: vertical en móvil, horizontal desde `lg`.
 * Cada etapa tiene su ícono; solo el de la etapa en curso está animado (p. ej. el perro
 * trotando hacia la casa en "En camino"). Los tramos completados se "llenan" en secuencia.
 * Anima solo transform/opacity y respeta `prefers-reduced-motion` (MotionProvider).
 * Sin JavaScript, `[data-reveal]` mantiene todo visible (ver layout).
 */
export function TrackingTimeline({ stages }: { stages: StageView[] }) {
  return (
    <ol className="grid gap-8 lg:grid-cols-6 lg:gap-4">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const filled = stage.state === "done" && !isLast;
        const delay = 0.15 + index * 0.35;
        const current = stage.state === "current";

        return (
          <m.li
            key={stage.key}
            data-reveal
            aria-current={current ? "step" : undefined}
            className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-5 lg:text-center"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {!isLast && (
              <>
                {/* Pista y relleno: vertical (móvil) */}
                <span aria-hidden="true" className="absolute top-20 -bottom-8 left-10 w-px bg-line lg:hidden" />
                {filled && (
                  <m.span
                    data-reveal
                    aria-hidden="true"
                    className="absolute top-20 -bottom-8 left-10 w-px origin-top bg-clay lg:hidden"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay, ease: "easeInOut" }}
                  />
                )}
                {/* Pista y relleno: horizontal (escritorio). Cruza el hueco entre columnas. */}
                <span
                  aria-hidden="true"
                  className="absolute top-10 left-1/2 hidden h-px w-[calc(100%+1rem)] bg-line lg:block"
                />
                {filled && (
                  <m.span
                    data-reveal
                    aria-hidden="true"
                    className="absolute top-10 left-1/2 hidden h-px w-[calc(100%+1rem)] origin-left bg-clay lg:block"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay, ease: "easeInOut" }}
                  />
                )}
              </>
            )}

            <span className="relative z-10 shrink-0">
              {current && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-ink/40 [animation-duration:2.2s] motion-safe:animate-ping"
                />
              )}
              <span
                className={cn(
                  "relative block size-20 overflow-hidden rounded-full border-2 transition-colors",
                  stage.state === "done" && "border-clay bg-linen",
                  current && "border-ink bg-cream shadow-[0_10px_28px_-12px_rgb(47_25_12/0.55)]",
                  stage.state === "upcoming" && "border-line bg-cream/60 opacity-45 grayscale",
                )}
              >
                <StageIcon stage={stage.key} active={current} />
              </span>
              {stage.state === "done" && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 grid size-6 place-items-center rounded-full bg-clay text-cream ring-2 ring-cream"
                >
                  <svg viewBox="0 0 20 20" className="size-3.5" fill="none">
                    <path
                      d="m4.5 10.5 3.5 3.5 7.5-8"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </span>

            <div className="min-w-0 self-center pb-1 lg:self-auto">
              <h3
                className={cn(
                  "font-display text-lg leading-snug",
                  stage.state === "upcoming" ? "text-muted" : "text-ink",
                )}
              >
                {stage.label}
                <span className="sr-only"> — {STATE_LABEL[stage.state]}</span>
              </h3>
              {current && (
                <p className="mt-1 inline-block rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium tracking-wide text-cream">
                  Estado actual
                </p>
              )}
              {stage.date && <p className="mt-1 text-sm font-medium text-clay">{stage.date}</p>}
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{stage.description}</p>
            </div>
          </m.li>
        );
      })}
    </ol>
  );
}
