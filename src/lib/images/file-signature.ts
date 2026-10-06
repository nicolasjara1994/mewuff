import type { AllowedImageMime } from "@/validations/upload";

/**
 * Detecta el tipo REAL de una imagen leyendo sus primeros bytes ("magic numbers"),
 * sin confiar en la extensión ni en el MIME declarado por el navegador.
 * Funciona en navegador y en Node (solo usa Uint8Array).
 */
export const SIGNATURE_BYTES = 12;

export function detectImageType(bytes: Uint8Array): AllowedImageMime | null {
  if (bytes.length < SIGNATURE_BYTES) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((byte, i) => bytes[i] === byte)) return "image/png";

  // WebP: "RIFF" .... "WEBP"
  const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (isRiff && isWebp) return "image/webp";

  return null;
}
