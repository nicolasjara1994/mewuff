import "server-only";

import type { PetPhotoAnalyzer } from "./types";

/**
 * Devuelve el analizador configurado o `null` si la IA está desactivada.
 *
 * Para integrar un proveedor:
 *   1. Crear `services/ai/providers/<proveedor>.ts` que implemente `PetPhotoAnalyzer`
 *      (enviar las fotos en base64 al modelo de visión y validar la respuesta JSON
 *      con un esquema antes de devolverla).
 *   2. Registrar el proveedor abajo según `AI_PROVIDER`.
 *   3. Definir `AI_PROVIDER` y la API key correspondiente en el entorno del servidor.
 */
export async function getPetPhotoAnalyzer(): Promise<PetPhotoAnalyzer | null> {
  const provider = process.env.AI_PROVIDER?.trim();
  if (!provider || provider === "none") return null;

  console.warn(`[ai] AI_PROVIDER="${provider}" no está implementado todavía; se omite el análisis.`);
  return null;
}
