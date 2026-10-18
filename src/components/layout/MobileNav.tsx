"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { ArrowIcon } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { mainNav, trackingNav } from "@/lib/site";

/** "Crear mi figura" es un ítem más del menú, apenas destacado. */
const MENU_ITEMS = [
  ...mainNav,
  trackingNav,
  { label: "Crear mi figura", href: "/personaliza", highlight: true },
] as const;

const subscribeNoop = () => () => {};

/**
 * Menú móvil a pantalla completa.
 *
 * - Se renderiza en un portal sobre <body>: el header usa `backdrop-filter`, que
 *   convertiría un `position: fixed` interno en relativo al propio header.
 * - Queda debajo del header (z-30 < z-40) para que el botón de cerrar siga visible.
 * - Mientras está abierto: el contenido de fondo queda `inert` (ni foco ni lectores
 *   de pantalla) y no se desplaza; se cierra con Escape o al navegar.
 * - Siempre está montado y se oculta con `invisible`, lo que permite animar la
 *   salida y además lo saca del orden de tabulación.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [lastPathname, setLastPathname] = useState(pathname);
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  // Cerrar al cambiar de ruta (ajuste de estado durante el render, sin efecto extra).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const background = document.querySelectorAll<HTMLElement>("main, footer");
    background.forEach((element) => (element.inert = true));
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    // Permite que el header (logo) se adapte al fondo oscuro del menú (ver globals.css).
    root.dataset.menuOpen = "";
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // Si se pasa a escritorio con el menú abierto, se cierra.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = (event: MediaQueryListEvent) => event.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      background.forEach((element) => (element.inert = false));
      root.style.overflow = previousOverflow;
      delete root.dataset.menuOpen;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const panel = (
    <div
      id={panelId}
      aria-hidden={!open}
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-night px-5 pt-36 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:hidden",
        // Barrido: el panel se revela de arriba hacia abajo (clip-path) antes de que entren los textos.
        // Al abrir, `visibility` cambia al instante (así el primer enlace puede recibir el foco);
        // al cerrar, se oculta recién cuando termina el barrido.
        open
          ? "visible [clip-path:inset(0)] [transition:clip-path_700ms_var(--ease-soft),visibility_0s]"
          : "invisible [clip-path:inset(0_0_100%_0)] [transition:clip-path_600ms_var(--ease-soft),visibility_0s_600ms]",
      )}
    >
      <nav aria-label="Principal móvil" className="my-auto">
        <ul className="flex flex-col border-t border-cream/10">
          {MENU_ITEMS.map((item, index) => {
            const highlight = "highlight" in item && item.highlight;
            return (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${450 + index * 60}ms` : "0ms" }}
                className={cn(
                  "border-b border-cream/10 transition-[opacity,translate] duration-500 ease-(--ease-soft)",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "group flex min-h-[clamp(3.5rem,9dvh,5rem)] items-center justify-center gap-4 text-center font-display text-[2.5rem] leading-none transition-colors duration-300 sm:text-5xl",
                    "aria-[current=page]:italic",
                    highlight ? "text-clay-light hover:text-cream" : "text-cream hover:text-clay-light",
                  )}
                >
                  {item.label}
                  {highlight && <ArrowIcon className="size-7 shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative -mr-2 inline-flex size-11 items-center justify-center rounded-full transition-colors duration-500",
          // Vive dentro del header (.theme-dark): "ink" es el tono claro en ambos estados.
          open ? "text-ink hover:bg-ink/10" : "text-ink hover:bg-linen",
        )}
      >
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={cn(
              "absolute top-0 left-0 h-px w-5 bg-current transition-transform duration-500 ease-(--ease-soft)",
              open && "translate-y-[7px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-500 ease-(--ease-soft)",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </span>
      </button>

      {isClient && createPortal(panel, document.body)}
    </div>
  );
}
