"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * - LazyMotion + `m`: carga solo las funciones de animación necesarias (bundle mínimo).
 * - reducedMotion="user": respeta `prefers-reduced-motion` (desactiva desplazamientos y escalas).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
