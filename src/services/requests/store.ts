import "server-only";

import { getServerEnv } from "@/lib/env";
import { ServiceUnavailableError } from "@/lib/errors";
import type { PetPhotoAnalysis } from "@/services/ai/types";
import type { TrackingView } from "@/types/tracking";
import type { CreatedRequest, NewCustomRequest, ProcessedPhoto } from "@/types/requests";

/**
 * Contrato de persistencia de solicitudes. Permite cambiar el backend
 * (Supabase en producción, disco local en desarrollo) sin tocar la lógica de negocio.
 */
export interface RequestStore {
  /** Crea la solicitud y guarda sus fotos. Si algo falla, no deja datos huérfanos. */
  createRequest(input: NewCustomRequest, photos: ProcessedPhoto[]): Promise<CreatedRequest>;
  /** Elimina la solicitud y TODAS sus fotos (derecho de eliminación / privacidad). */
  deleteRequest(requestId: string): Promise<void>;
  /** Guarda el resultado del análisis de IA (opcional). */
  saveAnalysis(requestId: string, analysis: PetPhotoAnalysis): Promise<void>;
  /** Datos públicos de seguimiento para un código. `null` si no existe. */
  findTracking(reference: string): Promise<TrackingView | null>;
}

export async function getRequestStore(): Promise<RequestStore> {
  const env = getServerEnv();

  if (env.supabase) {
    const { createSupabaseRequestStore } = await import("./supabase-store");
    return createSupabaseRequestStore();
  }

  if (!env.isProduction) {
    const { createLocalRequestStore } = await import("./local-store");
    return createLocalRequestStore();
  }

  // En producción nunca hay fallback silencioso: falla de forma explícita y segura.
  throw new ServiceUnavailableError("Supabase no está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
}
