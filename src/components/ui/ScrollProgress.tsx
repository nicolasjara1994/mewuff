"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Línea fina de progreso de lectura en el borde superior.
 * Solo escala con `transform` (sin layout ni repintado) y sigue al scroll NATIVO:
 * el resorte suaviza la barra, no el desplazamiento de la página.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent will-change-transform"
    />
  );
}
