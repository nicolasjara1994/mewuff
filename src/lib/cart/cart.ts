import { z } from "zod";

import { getProduct, type Product } from "@/content/products";

/** Máximo por línea: evita cantidades absurdas y mantiene la demo acotada. */
export const MAX_QUANTITY = 10;

export const STORAGE_KEY = "mewuff-cart-v1";

/** Lo único que se persiste: ids y cantidades. Los precios siempre salen del catálogo. */
export const cartItemSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export const storedCartSchema = z.array(cartItemSchema).max(50);

export type CartItem = z.infer<typeof cartItemSchema>;

export interface CartLine {
  product: Product;
  quantity: number;
  /** Subtotal de la línea en CLP. */
  total: number;
}

export interface CartSummary {
  lines: CartLine[];
  /** Total de unidades (para el contador del encabezado). */
  count: number;
  /** Total en CLP. */
  total: number;
}

const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(quantity)));

/** Funciones puras e inmutables: cada una devuelve un carro nuevo. */
export function addItem(items: readonly CartItem[], productId: string, quantity = 1): readonly CartItem[] {
  if (!getProduct(productId)) return items;
  const existing = items.find((item) => item.productId === productId);
  if (!existing) {
    const initial = clampQuantity(quantity);
    return initial > 0 ? [...items, { productId, quantity: initial }] : items;
  }
  return setQuantity(items, productId, existing.quantity + quantity);
}

/** Una cantidad menor o igual a 0 elimina la línea. */
export function setQuantity(items: readonly CartItem[], productId: string, quantity: number): readonly CartItem[] {
  const next = clampQuantity(quantity);
  if (next === 0) return removeItem(items, productId);
  return items.map((item) => (item.productId === productId ? { ...item, quantity: next } : item));
}

export function removeItem(items: readonly CartItem[], productId: string): readonly CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

/** Resuelve precios desde el catálogo; descarta ids que ya no existen. */
export function summarize(items: readonly CartItem[]): CartSummary {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.productId);
    if (!product) continue;
    lines.push({ product, quantity: item.quantity, total: product.priceClp * item.quantity });
  }
  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + line.total, 0),
  };
}

/** Lee JSON de almacenamiento no confiable: ante cualquier problema, carro vacío. */
export function parseStoredCart(raw: string | null): readonly CartItem[] {
  if (!raw) return [];
  try {
    const parsed = storedCartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.filter((item) => getProduct(item.productId)) : [];
  } catch {
    return [];
  }
}

const clpFormatter = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export function formatClp(amount: number): string {
  return clpFormatter.format(amount);
}
