import "server-only";

/**
 * Variables de entorno de SERVIDOR. Este módulo nunca llega al bundle del
 * cliente (`server-only` hace fallar el build si se importa desde un Client Component).
 */
export interface ServerEnv {
  supabase: { url: string; serviceRoleKey: string; bucket: string } | null;
  rateLimitSalt: string;
  isProduction: boolean;
}

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (url && !/^https:\/\/|^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) {
    throw new Error("SUPABASE_URL debe ser una URL https válida.");
  }

  cached = {
    supabase:
      url && serviceRoleKey
        ? { url, serviceRoleKey, bucket: process.env.SUPABASE_STORAGE_BUCKET?.trim() || "pet-photos" }
        : null,
    rateLimitSalt: process.env.RATE_LIMIT_SALT?.trim() || "huella-dev-salt",
    isProduction,
  };
  return cached;
}
