/** Error con mensaje seguro para mostrar al usuario (sin detalles internos). */
export class UserFacingError extends Error {
  constructor(
    message: string,
    readonly code: "INVALID_FILE" | "VALIDATION",
  ) {
    super(message);
    this.name = "UserFacingError";
  }
}

/** El backend de persistencia no está configurado o no responde. */
export class ServiceUnavailableError extends Error {
  constructor(message = "Servicio no disponible") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}

/** Devuelve un resumen del error apto para logs (sin datos personales). */
export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message, code } = error as { message?: unknown; code?: unknown };
    return `${String(code ?? "error")}: ${String(message)}`;
  }
  return "Unknown error";
}
