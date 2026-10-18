"use client";

import { useEffect } from "react";

/**
 * Marca en <html> el estado de scroll del header (ver globals.css):
 * - `data-scrolled`: la página no está arriba del todo.
 * - `data-header-hidden`: se está bajando; reaparece al subir.
 */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y > 8) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");

      // Umbral pequeño para ignorar micro-movimientos; arriba del todo siempre visible.
      if (y <= 80 || delta < -4) root.removeAttribute("data-header-hidden");
      else if (delta > 4 && !root.hasAttribute("data-menu-open")) root.setAttribute("data-header-hidden", "");

      if (Math.abs(delta) > 4) lastY = y;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.removeAttribute("data-scrolled");
      root.removeAttribute("data-header-hidden");
    };
  }, []);

  return null;
}
