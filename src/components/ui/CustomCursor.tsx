"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

/** Solo dispositivos con mouse real: nunca en táctiles ni en móvil. */
const DESKTOP_POINTER = "(hover: hover) and (pointer: fine)";

/** Campos de texto: se deja el cursor nativo (I-beam), que es lo que el usuario espera al escribir. */
const TEXT_FIELD =
  'textarea, input:not([type="checkbox"], [type="radio"], [type="file"], [type="submit"], [type="button"])';
const INTERACTIVE =
  'a[href], button:not(:disabled), summary, label[for], select, [role="button"], input[type="checkbox"], input[type="radio"], input[type="file"]';

type Mode = "default" | "interactive" | "text";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(DESKTOP_POINTER).matches;
const getServerSnapshot = () => false;

/**
 * Cursor personalizado de escritorio: punto exacto + anillo con inercia que se expande
 * sobre elementos interactivos. Solo usa `transform` y `opacity` (se compone en GPU).
 * Si no hay mouse, o antes de hidratar, el sitio conserva el cursor nativo.
 */
export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled ? <CursorLayer /> : null;
}

function CursorLayer() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // El anillo persigue al puntero con un resorte; con "reducir movimiento" lo sigue sin retardo.
  const ringX = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    let first = true;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      if (first) {
        // Evita que el anillo "vuele" desde la esquina en el primer movimiento.
        ringX.jump(event.clientX);
        ringY.jump(event.clientY);
        first = false;
      }
      const target = event.target instanceof Element ? event.target : null;
      setMode(target?.closest(TEXT_FIELD) ? "text" : target?.closest(INTERACTIVE) ? "interactive" : "default");
      setVisible(true);
    };
    const onDown = (event: PointerEvent) => event.pointerType === "mouse" && setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, ringX, ringY]);

  const shown = visible && mode !== "text";
  const interactive = mode === "interactive";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference">
      <m.div
        style={{ x: reduceMotion ? x : ringX, y: reduceMotion ? y : ringY }}
        className="absolute top-0 left-0 -mt-5 -ml-5 size-10 will-change-transform"
      >
        <m.div
          animate={{ scale: pressed ? 0.8 : interactive ? 1.7 : 1, opacity: shown ? 1 : 0 }}
          transition={{
            scale: { type: "spring", stiffness: 320, damping: 22 },
            opacity: { duration: 0.2 },
          }}
          className={cn(
            "size-full rounded-full border transition-[background-color,border-color] duration-300",
            interactive ? "border-white bg-white/25" : "border-white/80 bg-transparent",
          )}
        />
      </m.div>

      <m.div style={{ x, y }} className="absolute top-0 left-0 -mt-1 -ml-1 size-2 will-change-transform">
        <m.div
          animate={{ scale: interactive || pressed ? 0 : 1, opacity: shown ? 1 : 0 }}
          transition={{ scale: { duration: 0.25 }, opacity: { duration: 0.2 } }}
          className="size-full rounded-full bg-white"
        />
      </m.div>
    </div>
  );
}
