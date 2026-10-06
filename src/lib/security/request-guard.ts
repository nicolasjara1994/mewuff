import "server-only";

import { createHash } from "node:crypto";

import { getServerEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site";

/**
 * Protección CSRF para endpoints que modifican estado.
 *
 * La API no usa cookies de sesión, pero igualmente exigimos que la petición
 * provenga de nuestro propio origen para impedir envíos desde sitios de terceros.
 */
export function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowed = new Set([new URL(request.url).origin, new URL(siteConfig.url).origin]);
  return allowed.has(origin);
}

/**
 * IP del cliente. En Vercel `x-forwarded-for` lo define la plataforma y es confiable.
 * Si se despliega detrás de otro proxy, revisar qué cabecera es confiable.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Nunca almacenamos IPs en claro: solo un hash con "salt" para el rate limiting. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(`${getServerEnv().rateLimitSalt}:${value}`).digest("hex").slice(0, 32);
}
