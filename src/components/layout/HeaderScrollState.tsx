"use client";

import { useEffect } from "react";

/** Marca <html data-scrolled> cuando la página deja de estar arriba del todo (ver globals.css). */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      if (window.scrollY > 8) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
