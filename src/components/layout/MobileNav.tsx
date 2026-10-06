"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";

/**
 * Menú móvil accesible (patrón "disclosure"): botón real con aria-expanded,
 * cierre con Escape, al navegar y al hacer clic fuera. No bloquea el scroll.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Cerrar al cambiar de ruta (ajuste de estado durante el render, sin efecto extra).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="relative -mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-linen"
      >
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={cn(
              "absolute top-0 left-0 h-px w-5 bg-current transition-transform duration-300",
              open && "translate-y-[7px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-cream px-5 pt-4 pb-8 shadow-[0_24px_40px_-24px_rgb(43_38_34/0.35)]"
      >
        <nav aria-label="Principal móvil">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line/70">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-14 items-center font-serif text-2xl text-ink aria-[current=page]:text-clay"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/personaliza" className={buttonStyles("primary", "mt-6 w-full")}>
          Crear mi figura
        </Link>
      </div>
    </div>
  );
}
