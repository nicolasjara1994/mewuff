import { apiError, apiSuccess } from "@/lib/api-response";
import { ServiceUnavailableError, UserFacingError, describeError } from "@/lib/errors";
import { REQUEST_SUBMISSION_LIMIT, consumeRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIdentifier, isSameOriginRequest } from "@/lib/security/request-guard";
import { createCustomRequest } from "@/services/requests/create-request";
import { generateRequestReference } from "@/services/requests/reference";
import { REQUEST_FIELD_NAMES, type RequestFieldName, validateRequestFields } from "@/validations/request";
import { UPLOAD_LIMITS, UPLOAD_MESSAGES } from "@/validations/upload";

// sharp requiere el runtime de Node.js.
export const runtime = "nodejs";
export const maxDuration = 30;

/** Tiempo mínimo razonable para completar el formulario (filtro anti-bots básico). */
const MIN_FILL_TIME_MS = 3000;

/**
 * POST /api/requests — recibe una solicitud de figura personalizada (multipart/form-data).
 *
 * Orden de controles: del más barato al más caro, para descartar abuso pronto.
 */
export async function POST(request: Request) {
  try {
    // 1. CSRF: solo aceptamos peticiones desde nuestro propio origen.
    if (!isSameOriginRequest(request)) {
      return apiError(403, "FORBIDDEN", "Solicitud no permitida.");
    }

    // 2. Tipo de contenido y tamaño declarado.
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
      return apiError(415, "UNSUPPORTED_MEDIA_TYPE", "Formato de envío no soportado.");
    }
    const contentLength = Number(request.headers.get("content-length"));
    if (!Number.isFinite(contentLength) || contentLength <= 0) {
      return apiError(411, "BAD_REQUEST", "No pudimos procesar el envío.");
    }
    if (contentLength > UPLOAD_LIMITS.maxRequestBytes) {
      return apiError(413, "PAYLOAD_TOO_LARGE", "El envío es demasiado grande. Intenta con menos fotografías.");
    }

    // 3. Rate limiting por IP (hasheada).
    const ipKey = `request-submit:${hashIdentifier(getClientIp(request.headers))}`;
    if (!(await consumeRateLimit(ipKey, REQUEST_SUBMISSION_LIMIT))) {
      return apiError(
        429,
        "RATE_LIMITED",
        "Has enviado varias solicitudes seguidas. Espera unos minutos e inténtalo nuevamente.",
        { headers: { "Retry-After": String(REQUEST_SUBMISSION_LIMIT.windowSeconds) } },
      );
    }

    // 4. Parseo del formulario.
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return apiError(400, "BAD_REQUEST", "No pudimos procesar el envío.");
    }

    // 5. Anti-spam silencioso: honeypot y tiempo mínimo de llenado.
    //    Respondemos "éxito" para no dar pistas a los bots, pero no guardamos nada.
    const honeypot = form.get("website");
    const startedAt = Number(form.get("startedAt"));
    const filledTooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_TIME_MS;
    if ((typeof honeypot === "string" && honeypot.trim() !== "") || filledTooFast) {
      return apiSuccess({ ok: true, reference: generateRequestReference() });
    }

    // 6. Validación de campos (fuente de verdad: el servidor).
    const rawFields = Object.fromEntries(
      REQUEST_FIELD_NAMES.map((name) => {
        const value = form.get(name);
        return [name, typeof value === "string" ? value : ""];
      }),
    ) as Record<RequestFieldName, string>;

    const validation = validateRequestFields(rawFields);
    if (!validation.success) {
      return apiError(422, "VALIDATION", "Revisa los campos marcados.", { fieldErrors: validation.fieldErrors });
    }

    // 7. Fotos: solo se aceptan entradas de tipo archivo.
    const photoEntries = form.getAll("photos");
    const files = photoEntries.filter((entry): entry is File => entry instanceof File);
    if (files.length !== photoEntries.length) {
      return apiError(400, "BAD_REQUEST", "No pudimos procesar el envío.");
    }
    if (files.length === 0) {
      return apiError(422, "INVALID_FILE", UPLOAD_MESSAGES.required, {
        fieldErrors: { photos: UPLOAD_MESSAGES.required },
      });
    }

    // 8. Procesamiento y persistencia.
    const created = await createCustomRequest(validation.data, files);
    return apiSuccess({ ok: true, reference: created.reference });
  } catch (error) {
    if (error instanceof UserFacingError) {
      return apiError(422, error.code, error.message, { fieldErrors: { photos: error.message } });
    }
    if (error instanceof ServiceUnavailableError) {
      console.error("[api/requests] servicio no disponible:", error.message);
      return apiError(
        503,
        "SERVICE_UNAVAILABLE",
        "Nuestro sistema no está disponible en este momento. Inténtalo más tarde.",
      );
    }
    // Nunca exponer detalles internos ni stack traces al cliente.
    console.error("[api/requests] error inesperado:", describeError(error));
    return apiError(500, "SERVER_ERROR", "Ocurrió un error inesperado. Por favor, inténtalo nuevamente.");
  }
}
