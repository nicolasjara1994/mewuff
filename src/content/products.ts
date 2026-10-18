import type { StaticImageData } from "next/image";

import heroSculpture from "@/assets/figures/hero-sculpture.png";
import leia from "@/assets/pets/leia.webp";
import luke from "@/assets/pets/luke.webp";

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Precio unitario en pesos chilenos (enteros, sin decimales). */
  priceClp: number;
  image: StaticImageData;
  imageAlt: string;
}

/**
 * Catálogo de ejemplo para la demo del carro. Es la única fuente de verdad de
 * los precios: el carro solo guarda ids y cantidades, nunca precios.
 */
export const products: readonly Product[] = [
  {
    id: "figura-mini",
    name: "Figura mini",
    description: "Pieza de 8 cm, ideal para escritorio o repisa. Modelada y pintada a mano.",
    priceClp: 29900,
    image: leia,
    imageAlt: "Fotografía de muestra de una mascota para una figura mini.",
  },
  {
    id: "figura-clasica",
    name: "Figura clásica",
    description: "Pieza de 15 cm con base de madera y mayor detalle en pelaje y gestos.",
    priceClp: 49900,
    image: luke,
    imageAlt: "Fotografía de muestra de un gato para una figura clásica.",
  },
  {
    id: "figura-grande",
    name: "Figura grande",
    description: "Pieza de 25 cm, la más detallada. Incluye certificado de pieza única.",
    priceClp: 79900,
    image: heroSculpture,
    imageAlt: "Escultura de mascota de gran tamaño sobre una base.",
  },
];

const productsById = new Map(products.map((product) => [product.id, product]));

export function getProduct(id: string): Product | undefined {
  return productsById.get(id);
}
