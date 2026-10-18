import type { TrackingStage } from "@/content/tracking";
import { cn } from "@/lib/cn";

/**
 * Ícono de cada etapa (viewBox 80×80, recortado en círculo por el contenedor).
 * Es SVG + animaciones CSS (clases `trk-*` en globals.css): Server Component sin JS propio.
 * Con `active` el ícono se anima; sin él queda como una ilustración fija.
 */
export function StageIcon({ stage, active }: { stage: TrackingStage["key"]; active: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className="size-full">
      {stage === "received" && <Received active={active} />}
      {stage === "review" && <Review active={active} />}
      {stage === "approved" && <Approved active={active} />}
      {stage === "production" && <Production active={active} />}
      {stage === "shipped" && <Shipped active={active} />}
      {stage === "delivered" && <Delivered active={active} />}
    </svg>
  );
}

/** Aplica la clase de animación solo cuando la etapa está en curso. */
const on = (active: boolean, className: string) => (active ? className : undefined);

function Received({ active }: { active: boolean }) {
  return (
    <>
      <rect x="14" y="58" width="52" height="6" rx="3" className="fill-sand" />
      <g className={on(active, "trk-i-drop")}>
        <rect x="16" y="26" width="48" height="32" rx="4" className="fill-cream stroke-clay" strokeWidth="2.5" />
        <path d="M18 30 L40 46 L62 30" fill="none" className="stroke-clay" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="40" cy="45" r="4" className="fill-clay" />
      </g>
    </>
  );
}

function Review({ active }: { active: boolean }) {
  return (
    <>
      <rect x="14" y="16" width="36" height="46" rx="3" className="fill-cream stroke-clay" strokeWidth="2.5" />
      <rect x="19" y="21" width="26" height="28" rx="2" className="fill-line" />
      <circle cx="32" cy="38" r="5" className="fill-clay/80" />
      <circle cx="27" cy="30" r="2.6" className="fill-clay/80" />
      <circle cx="37" cy="30" r="2.6" className="fill-clay/80" />
      <g className={on(active, "trk-i-sweep")}>
        <circle cx="46" cy="42" r="12" className="fill-cream/50 stroke-ink-soft" strokeWidth="4" />
        <path d="M55 51 L65 61" className="stroke-ink-soft" strokeWidth="5" strokeLinecap="round" />
      </g>
    </>
  );
}

function Approved({ active }: { active: boolean }) {
  return (
    <>
      {active && <circle cx="40" cy="40" r="22" className="trk-ring fill-none stroke-clay" strokeWidth="2.5" />}
      <circle cx="40" cy="40" r="22" className="fill-clay" />
      <path
        d="M29 41 L37 49 L52 32"
        fill="none"
        className={cn("stroke-cream", on(active, "trk-check"))}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />
    </>
  );
}

function Cat({ className }: { className: string }) {
  return (
    <g className={className}>
      <path d="M50 60 C63 60 64 44 56 39" fill="none" strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="40" cy="50" rx="11" ry="13" />
      <circle cx="40" cy="30" r="9" />
      <path d="M32 26 L33 14 L40 21Z M48 26 L47 14 L40 21Z" />
    </g>
  );
}

function Production({ active }: { active: boolean }) {
  return (
    <>
      <rect x="22" y="62" width="36" height="6" rx="3" className="fill-sand" />
      {/* Silueta base y, encima, la capa pintada que sube de abajo hacia arriba. */}
      <Cat className="fill-line stroke-line" />
      <g className={on(active, "trk-paint")}>
        <Cat className="fill-clay stroke-clay" />
      </g>
    </>
  );
}

/** Huellas en zigzag (pata izquierda y derecha alternadas) que avanzan hacia la derecha. */
const PAW_STEPS = [
  { x: 13, y: 47, angle: 100 },
  { x: 30, y: 33, angle: 80 },
  { x: 47, y: 47, angle: 100 },
  { x: 64, y: 33, angle: 80 },
] as const;

function Shipped({ active }: { active: boolean }) {
  return (
    <>
      {PAW_STEPS.map((step, index) => (
        // La posición va en un <g> aparte: la animación CSS reemplaza el `transform` del elemento animado.
        <g key={index} transform={`translate(${step.x} ${step.y}) rotate(${step.angle})`}>
          <g className={on(active, "trk-step")} style={active ? { animationDelay: `${index * 0.45}s` } : undefined}>
            <ellipse cx="0" cy="2.5" rx="6" ry="5" className="fill-clay" />
            <circle cx="-6.2" cy="-3.6" r="2.3" className="fill-clay" />
            <circle cx="-2.3" cy="-7.3" r="2.4" className="fill-clay" />
            <circle cx="2.3" cy="-7.3" r="2.4" className="fill-clay" />
            <circle cx="6.2" cy="-3.6" r="2.3" className="fill-clay" />
          </g>
        </g>
      ))}
    </>
  );
}

const ARCH = "M33 64 V54 a7 7 0 0 1 14 0 V64Z";

/** Llegada a casa: aterriza el paquete, se abre la puerta (luz cálida), brilla la ventana y salen corazones. */
function Delivered({ active }: { active: boolean }) {
  return (
    <>
      {/* Suelo */}
      <rect x="0" y="64" width="80" height="16" className="fill-sand/50" />
      <rect x="28" y="64" width="24" height="3" rx="1.5" className="fill-sand" />

      {/* Casa */}
      <rect x="18" y="40" width="44" height="24" className="fill-cream stroke-clay" strokeWidth="2.2" />
      <rect x="21" y="48" width="8" height="8" rx="1" className="fill-line" />
      <rect x="51" y="48" width="8" height="8" rx="1" className="fill-line" />
      <rect x="53" y="22" width="7" height="14" className="fill-ink-soft" />
      <path d="M12 43 L40 20 L68 43Z" className="fill-clay" />
      <path d="M22 38 H58 M29 31 H51" className="stroke-cream/25" strokeWidth="1.2" />
      <circle cx="40" cy="33" r="4.2" className={cn("fill-sand", on(active, "trk-glow"))} />

      {/* Puerta: luz interior y hoja que se abre sobre su bisagra izquierda */}
      <path d={ARCH} className="fill-sand" />
      <path d={ARCH} className={cn("fill-ink-soft", on(active, "trk-door"))} />

      {/* Paquete que aterriza junto a la entrada */}
      <g className={on(active, "trk-i-land")}>
        <rect x="52" y="56" width="10" height="9" rx="1" className="fill-sand stroke-ink-soft" strokeWidth="1.3" />
        <path d="M57 56 V65 M52 60.5 H62" className="stroke-clay" strokeWidth="1.6" />
      </g>

      {/* Corazones sobre el tejado y chispas alrededor */}
      {[
        { x: 34, delay: 0 },
        { x: 46, delay: 1.2 },
      ].map((heart) => (
        <g key={heart.x} transform={`translate(${heart.x} 17)`}>
          <path
            d="M0 5 C-9 -2 -5 -10 0 -5 C5 -10 9 -2 0 5Z"
            className={cn("fill-clay", on(active, "trk-i-heart"))}
            style={active ? { animationDelay: `${heart.delay}s` } : undefined}
          />
        </g>
      ))}
      <Sparkle x={13} y={26} delay={0} />
      <Sparkle x={68} y={30} delay={0.9} />
      <Sparkle x={62} y={12} delay={1.6} size={0.7} />
    </>
  );
}

function Sparkle({ x, y, delay, size = 0.9 }: { x: number; y: number; delay: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size * 0.55})`}>
      <path
        d="M0 -9 C1 -3 3 -1 9 0 C3 1 1 3 0 9 C-1 3 -3 1 -9 0 C-3 -1 -1 -3 0 -9Z"
        className="trk-sparkle fill-clay"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}
