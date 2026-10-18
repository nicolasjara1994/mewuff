/** Formato del código de seguimiento: "MW-" + 6 caracteres (ver `generateRequestReference`). */
const REFERENCE_PATTERN = /^MW-[0-9A-Z]{6}$/;

/**
 * Normaliza lo que escribe la persona ("mw 7kd3qx", " MW-7KD3QX ", "7kd3qx") al
 * formato canónico. Devuelve `null` si no tiene forma de código válido.
 * Acepta como máximo 24 caracteres de entrada para no procesar basura.
 */
export function normalizeReference(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 24) return null;

  const compact = raw
    .normalize("NFKC")
    .toUpperCase()
    .replace(/[\s_-]+/g, "");
  // Sin prefijo (6 caracteres) se asume solo el cuerpo; el cuerpo puede empezar con "MW".
  const body = compact.length > 6 && compact.startsWith("MW") ? compact.slice(2) : compact;
  const candidate = `MW-${body}`;

  return REFERENCE_PATTERN.test(candidate) ? candidate : null;
}
