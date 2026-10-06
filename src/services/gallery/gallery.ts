import copito from "@/assets/placeholders/gallery-copito.webp";
import luna from "@/assets/placeholders/gallery-luna.webp";
import mora from "@/assets/placeholders/gallery-mora.webp";
import pancho from "@/assets/placeholders/gallery-pancho.webp";
import simon from "@/assets/placeholders/gallery-simon.webp";
import tango from "@/assets/placeholders/gallery-tango.webp";
import type { GalleryItem } from "@/types/gallery";

/**
 * Fuente de datos de la galería.
 *
 * Hoy devuelve imágenes de MUESTRA locales. Para usar fotos reales:
 *   - Opción simple: reemplazar los archivos en `src/assets/` y los textos de abajo.
 *   - Opción dinámica: crear una tabla `gallery_items` + bucket PÚBLICO en Supabase,
 *     leerla aquí (es async a propósito) y agregar el dominio de Supabase en
 *     `images.remotePatterns` de next.config.ts.
 */
const DEMO_ITEMS: GalleryItem[] = [
  {
    id: "simon",
    title: "Simón, en porcelana",
    petName: "Simón",
    species: "Gato",
    finish: "Porcelana fría, acabado mate",
    alt: "Figura de muestra de un gato sentado, color marfil, sobre una base de madera.",
    image: simon,
    isPlaceholder: true,
  },
  {
    id: "luna",
    title: "Luna, en terracota",
    petName: "Luna",
    species: "Perro",
    finish: "Resina patinada en terracota",
    alt: "Figura de muestra de un perro sentado de orejas caídas, color terracota, sobre una base de madera.",
    image: luna,
    isPlaceholder: true,
  },
  {
    id: "copito",
    title: "Copito, en arena",
    petName: "Copito",
    species: "Conejo",
    finish: "Cerámica en frío, tono arena",
    alt: "Figura de muestra de un conejo con una oreja de color más oscuro, sobre una base de madera.",
    image: copito,
    isPlaceholder: true,
  },
  {
    id: "tango",
    title: "Tango, en grafito",
    petName: "Tango",
    species: "Perro",
    finish: "Resina, acabado grafito satinado",
    alt: "Figura de muestra de un perro sentado color grafito, sobre una base de madera.",
    image: tango,
    isPlaceholder: true,
  },
  {
    id: "mora",
    title: "Mora, en miel",
    petName: "Mora",
    species: "Gata",
    finish: "Resina translúcida, tono miel",
    alt: "Figura de muestra de una gata color miel con manchas más oscuras, sobre una base de madera.",
    image: mora,
    isPlaceholder: true,
  },
  {
    id: "pancho",
    title: "Pancho, en salvia",
    petName: "Pancho",
    species: "Perro",
    finish: "Cerámica en frío, verde salvia",
    alt: "Figura de muestra de un perro sentado en tono verde salvia, sobre una base de madera.",
    image: pancho,
    isPlaceholder: true,
  },
];

export async function getGalleryItems(options: { limit?: number } = {}): Promise<GalleryItem[]> {
  return typeof options.limit === "number" ? DEMO_ITEMS.slice(0, options.limit) : DEMO_ITEMS;
}
