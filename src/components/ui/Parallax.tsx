"use client";

import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Desplazamiento máximo en px. Mantenerlo bajo para un efecto sutil. */
  offset?: number;
}

/**
 * Parallax ligero basado en el scroll NATIVO del navegador (no lo reemplaza ni bloquea).
 * Un resorte suave le da "inercia" al movimiento de la imagen sin tocar el scroll de la página.
 * Usa solo `transform`, que se compone en GPU. Se desactiva con `prefers-reduced-motion`.
 */
export function Parallax({ children, className, offset = 32 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.7, restDelta: 0.0005 });
  const y = useTransform(smooth, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <m.div style={reduceMotion ? undefined : { y }} className="h-full w-full will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
