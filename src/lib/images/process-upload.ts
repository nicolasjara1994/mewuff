import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";

import { UserFacingError } from "@/lib/errors";
import type { ProcessedPhoto } from "@/types/requests";
import {
  UPLOAD_LIMITS,
  UPLOAD_MESSAGES,
  extensionMatchesMime,
  getExtension,
  isAllowedMime,
} from "@/validations/upload";

import { detectImageType } from "./file-signature";

const OUTPUT_MAX_DIMENSION = 2400;
const OUTPUT_QUALITY = 86;

/**
 * Valida y re-codifica las fotos subidas.
 *
 * - Verifica cantidad, tamaño, extensión, MIME declarado y firma binaria real.
 * - Decodifica con sharp (si no es una imagen válida, se rechaza).
 * - Re-codifica a WebP: elimina EXIF/GPS y cualquier contenido embebido
 *   (archivos "políglotas"), normaliza la orientación y limita la resolución.
 * - Asigna un nombre aleatorio: el nombre del usuario nunca se usa.
 */
export async function processUploadedPhotos(files: File[]): Promise<ProcessedPhoto[]> {
  if (files.length < UPLOAD_LIMITS.minFiles) throw new UserFacingError(UPLOAD_MESSAGES.required, "INVALID_FILE");
  if (files.length > UPLOAD_LIMITS.maxFiles) throw new UserFacingError(UPLOAD_MESSAGES.tooMany, "INVALID_FILE");

  // Validaciones baratas primero, antes de leer o decodificar nada.
  for (const file of files) {
    if (file.size === 0) throw new UserFacingError(UPLOAD_MESSAGES.empty, "INVALID_FILE");
    if (file.size > UPLOAD_LIMITS.maxUploadBytes) throw new UserFacingError(UPLOAD_MESSAGES.tooLarge, "INVALID_FILE");
    if (!isAllowedMime(file.type)) throw new UserFacingError(UPLOAD_MESSAGES.invalidType, "INVALID_FILE");
    if (!extensionMatchesMime(getExtension(file.name), file.type)) {
      throw new UserFacingError(UPLOAD_MESSAGES.invalidType, "INVALID_FILE");
    }
  }

  const processed: ProcessedPhoto[] = [];
  // Secuencial a propósito: limita el uso de memoria en funciones serverless.
  for (const [index, file] of files.entries()) {
    const input = Buffer.from(await file.arrayBuffer());

    const detected = detectImageType(input);
    if (!detected || detected !== file.type) {
      throw new UserFacingError(UPLOAD_MESSAGES.invalidType, "INVALID_FILE");
    }

    processed.push(await reencode(input, index));
  }
  return processed;
}

async function reencode(input: Buffer, position: number): Promise<ProcessedPhoto> {
  try {
    const pipeline = sharp(input, {
      limitInputPixels: UPLOAD_LIMITS.maxInputPixels,
      failOn: "error",
      animated: false,
    });

    const metadata = await pipeline.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
      throw new UserFacingError(UPLOAD_MESSAGES.invalidType, "INVALID_FILE");
    }

    const { data, info } = await pipeline
      .rotate() // aplica la orientación EXIF antes de descartar los metadatos
      .resize({
        width: OUTPUT_MAX_DIMENSION,
        height: OUTPUT_MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: OUTPUT_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    return {
      id: randomUUID(),
      buffer: data,
      mimeType: "image/webp",
      extension: "webp",
      width: info.width,
      height: info.height,
      sizeBytes: info.size,
      position,
    };
  } catch (error) {
    if (error instanceof UserFacingError) throw error;
    throw new UserFacingError(UPLOAD_MESSAGES.unprocessable, "INVALID_FILE");
  }
}
