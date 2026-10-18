import leia from "@/assets/pets/leia.webp";
import luke from "@/assets/pets/luke.webp";
import type { GalleryItem } from "@/types/gallery";

/**
 * Fuente de datos de la galería.
 *
 * Hoy muestra fotos de EJEMPLO (Leia y Luke) repetidas para completar la grilla.
 * Para usar fotos reales de figuras terminadas:
 *   - Opción simple: reemplazar las imágenes en `src/assets/` y los textos de abajo.
 *   - Opción dinámica: crear una tabla `gallery_items` + bucket PÚBLICO en Supabase,
 *     leerla aquí (es async a propósito) y agregar el dominio de Supabase en
 *     `images.remotePatterns` de next.config.ts.
 */
const LEIA_ALT = "Fotografía de muestra de Leia, una gata blanca de ojos color ámbar mirando hacia arriba.";
const LUKE_ALT = "Fotografía de muestra de Luke, un gato gris de ojos color ámbar con la cabeza ladeada.";

const DEMO_ITEMS: GalleryItem[] = [
  {
    id: "leia-1",
    title: "Leia, en porcelana",
    petName: "Leia",
    species: "Gato",
    finish: "Porcelana fría, acabado mate",
    alt: LEIA_ALT,
    image: leia,
    isPlaceholder: true,
  },
  {
    id: "luke-1",
    title: "Luke, en grafito",
    petName: "Luke",
    species: "Gato",
    finish: "Resina, acabado grafito satinado",
    alt: LUKE_ALT,
    image: luke,
    isPlaceholder: true,
  },
  {
    id: "leia-2",
    title: "Leia, en marfil",
    petName: "Leia",
    species: "Gato",
    finish: "Cerámica en frío, tono marfil",
    alt: LEIA_ALT,
    image: leia,
    isPlaceholder: true,
  },
  {
    id: "luke-2",
    title: "Luke, en terracota",
    petName: "Luke",
    species: "Gato",
    finish: "Resina patinada en terracota",
    alt: LUKE_ALT,
    image: luke,
    isPlaceholder: true,
  },
  {
    id: "leia-3",
    title: "Leia, en arena",
    petName: "Leia",
    species: "Gato",
    finish: "Cerámica en frío, tono arena",
    alt: LEIA_ALT,
    image: leia,
    isPlaceholder: true,
  },
  {
    id: "luke-3",
    title: "Luke, en miel",
    petName: "Luke",
    species: "Gato",
    finish: "Resina translúcida, tono miel",
    alt: LUKE_ALT,
    image: luke,
    isPlaceholder: true,
  },
];

export async function getGalleryItems(options: { limit?: number } = {}): Promise<GalleryItem[]> {
  return typeof options.limit === "number" ? DEMO_ITEMS.slice(0, options.limit) : DEMO_ITEMS;
}
