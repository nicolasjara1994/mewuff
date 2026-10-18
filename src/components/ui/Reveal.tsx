"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos (útil para escalonar elementos de una lista). */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  as?: "div" | "li" | "article" | "figure";
}

/**
 * Aparición suave al entrar en el viewport (una sola vez).
 * Solo anima `opacity` y `transform` (propiedades baratas, sin layout shift).
 */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
