"use client";

import { m } from "framer-motion";
import { useEffect, useRef } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";

interface RequestSuccessProps {
  reference: string;
  email: string;
  petName: string;
}

const NEXT_STEPS = [
  "Revisamos tus fotos y los detalles de tu mascota.",
  "Te escribimos con una propuesta de tamaño, terminación y valor.",
  "Si te gusta, comenzamos a diseñar su figura.",
];

export function RequestSuccess({ reference, email, petName }: RequestSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Mueve el foco al mensaje para que lectores de pantalla y teclado lo encuentren.
  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="py-4 text-center sm:py-8"
    >
      <span
        className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-8" fill="none">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h2 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-3xl text-ink outline-none sm:text-4xl">
        ¡Recibimos la solicitud de {petName}!
      </h2>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
        Gracias por confiarnos a tu compañero. Te escribiremos a{" "}
        <strong className="font-semibold text-ink">{email}</strong> en un plazo de 1 a 2 días hábiles.
      </p>

      <div className="mx-auto mt-8 inline-flex flex-col items-center rounded-2xl bg-linen px-6 py-4">
        <span className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Número de solicitud</span>
        <span className="mt-1 font-mono text-2xl tracking-widest text-ink">{reference}</span>
      </div>

      <ol className="mx-auto mt-10 max-w-sm space-y-4 text-left">
        {NEXT_STEPS.map((step, index) => (
          <li key={step} className="flex gap-4">
            <span className="font-serif text-lg text-clay" aria-hidden="true">
              {index + 1}.
            </span>
            <span className="leading-relaxed text-ink-soft">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/galeria" variant="secondary">
          Ver la galería
        </ButtonLink>
      </div>
    </m.div>
  );
}
