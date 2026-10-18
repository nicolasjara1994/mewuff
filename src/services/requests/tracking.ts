import "server-only";

import type { TrackingView } from "@/types/tracking";

import { getRequestStore } from "./store";

/** Caso de uso: obtener el seguimiento público de un pedido a partir de su código ya normalizado. */
export async function getTracking(reference: string): Promise<TrackingView | null> {
  const store = await getRequestStore();
  return store.findTracking(reference);
}
