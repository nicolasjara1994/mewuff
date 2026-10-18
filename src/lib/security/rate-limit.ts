import "server-only";

import { describeError } from "@/lib/errors";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RateLimitRule {
  limit: number;
  windowSeconds: number;
}

/** Límite para el envío de solicitudes de figura (por IP). */
export const REQUEST_SUBMISSION_LIMIT: RateLimitRule = { limit: 6, windowSeconds: 15 * 60 };

/**
 * Consultas de seguimiento (por IP). El código tiene ~887 millones de combinaciones;
 * este límite hace inviable adivinarlos por fuerza bruta.
 */
export const TRACKING_LOOKUP_LIMIT: RateLimitRule = { limit: 20, windowSeconds: 10 * 60 };

/**
 * Rate limiting de ventana fija.
 *
 * - Con Supabase: contador atómico en Postgres (función `consume_rate_limit`),
 *   compartido entre todas las instancias serverless.
 * - Sin Supabase (solo desarrollo local): contador en memoria.
 */
export async function consumeRateLimit(key: string, rule: RateLimitRule): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return consumeInMemory(key, rule);

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key: key,
    p_limit: rule.limit,
    p_window_seconds: rule.windowSeconds,
  });

  if (error) {
    // Fail-open: un fallo del limitador no debe bloquear a clientes legítimos.
    // El resto de controles (validación, límites de tamaño) siguen activos.
    console.error("[rate-limit] error consultando límite:", describeError(error));
    return true;
  }
  return data === true;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function consumeInMemory(key: string, { limit, windowSeconds }: RateLimitRule): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
