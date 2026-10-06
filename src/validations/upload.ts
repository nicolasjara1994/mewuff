/**
 * Límites de subida compartidos entre cliente y servidor.
 *
 * El cliente optimiza cada foto antes de enviarla (máx. 2048 px, WebP/JPEG),
 * lo que permite aceptar originales grandes sin superar el límite de
 * ~4.5 MB por request de las funciones serverless de Vercel.
 */
export const UPLOAD_LIMITS = {
  minFiles: 1,
  maxFiles: 5,
  /** Tamaño máximo del archivo ORIGINAL que el usuario selecciona. */
  maxOriginalBytes: 15 * 1024 * 1024,
  /** Tamaño máximo por archivo que acepta el servidor (ya optimizado). */
  maxUploadBytes: 4 * 1024 * 1024,
  /** Tamaño máximo del cuerpo completo del request multipart. */
  maxRequestBytes: 4_400_000,
  /** Lado mayor máximo tras optimizar en el cliente. */
  maxDimension: 2048,
  /** Tamaño objetivo por foto tras optimizar (para que 5 fotos quepan en un request). */
  targetBytes: 780 * 1024,
  /** Protección contra "decompression bombs" en el servidor. */
  maxInputPixels: 50_000_000,
} as const;

export const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
} as const;

export type AllowedImageMime = keyof typeof ALLOWED_IMAGE_TYPES;

export const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const UPLOAD_HELP_TEXT = `JPG, PNG o WebP · hasta ${UPLOAD_LIMITS.maxOriginalBytes / 1024 / 1024} MB por foto · máximo ${UPLOAD_LIMITS.maxFiles} fotos`;

export function isAllowedMime(value: string): value is AllowedImageMime {
  return Object.hasOwn(ALLOWED_IMAGE_TYPES, value);
}

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot + 1).toLowerCase();
}

export function extensionMatchesMime(extension: string, mime: AllowedImageMime): boolean {
  return (ALLOWED_IMAGE_TYPES[mime] as readonly string[]).includes(extension);
}

export const UPLOAD_MESSAGES = {
  required: "Sube al menos una fotografía de tu mascota.",
  tooMany: `Puedes subir un máximo de ${UPLOAD_LIMITS.maxFiles} fotografías.`,
  tooLarge: "La imagen supera el tamaño máximo permitido.",
  invalidType: "Formato no permitido. Usa imágenes JPG, PNG o WebP.",
  empty: "Una de las fotografías está vacía o dañada.",
  unprocessable: "No pudimos procesar una de las imágenes. Asegúrate de que no esté dañada e inténtalo con otra.",
} as const;
