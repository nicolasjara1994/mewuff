import Image from "next/image";

import { cn } from "@/lib/cn";

// Con export estático (GitHub Pages) next/image no antepone el basePath a imágenes sin optimizar.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const PHOTOS = {
  leia: { src: `${BASE_PATH}/leiaimage.jpeg`, position: "40% 40%" },
  luke: { src: `${BASE_PATH}/lukeimage.jpeg`, position: "50% 35%" },
} as const;

export type BackdropPhoto = keyof typeof PHOTOS;

/**
 * Fondo fotográfico de sección: foto a sangre, velo oscuro para que el texto
 * se lea y una capa de grano tipo película. Es decorativo (aria-hidden, alt vacío).
 * La sección que lo usa debe llevar la clase `on-photo`, que invierte la paleta
 * a tonos claros (ver globals.css).
 */
export function SectionBackdrop({
  photo,
  preload = false,
  className,
}: {
  photo: BackdropPhoto;
  /** Solo para la sección visible al cargar (el hero). */
  preload?: boolean;
  className?: string;
}) {
  const { src, position } = PHOTOS[photo];

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}>
      <Image
        src={src}
        alt=""
        fill
        preload={preload}
        sizes="100vw"
        className="object-cover grayscale-[35%]"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_13_11/0.8)_0%,rgb(31_19_12/0.74)_50%,rgb(15_13_11/0.86)_100%)]" />
      <div className="photo-grain absolute inset-0" />
    </div>
  );
}
