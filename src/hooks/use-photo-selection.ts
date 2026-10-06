"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SIGNATURE_BYTES, detectImageType } from "@/lib/images/file-signature";
import { optimizeImageInBrowser } from "@/lib/images/optimize-in-browser";
import {
  UPLOAD_LIMITS,
  UPLOAD_MESSAGES,
  extensionMatchesMime,
  getExtension,
  isAllowedMime,
} from "@/validations/upload";

export interface SelectedPhoto {
  id: string;
  /** Archivo ya optimizado: es lo que se envía al servidor. */
  file: File;
  previewUrl: string;
  /** Nombre original, solo para mostrarlo al usuario (nunca se usa para guardar). */
  displayName: string;
  fingerprint: string;
}

const MAX_NAME_LENGTH = 40;

function shortName(name: string): string {
  return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH - 1)}…` : name;
}

async function validateOriginal(file: File): Promise<string | null> {
  const name = `«${shortName(file.name)}»`;
  const mimeOk = isAllowedMime(file.type) && extensionMatchesMime(getExtension(file.name), file.type);
  if (!mimeOk) return `${name}: ${UPLOAD_MESSAGES.invalidType}`;
  if (file.size === 0) return `${name}: ${UPLOAD_MESSAGES.empty}`;
  if (file.size > UPLOAD_LIMITS.maxOriginalBytes) {
    return `${name}: ${UPLOAD_MESSAGES.tooLarge} (máx. ${UPLOAD_LIMITS.maxOriginalBytes / 1024 / 1024} MB).`;
  }
  // Verifica la firma binaria real, no solo lo que declara el sistema operativo.
  const header = new Uint8Array(await file.slice(0, SIGNATURE_BYTES).arrayBuffer());
  if (detectImageType(header) !== file.type) return `${name}: ${UPLOAD_MESSAGES.invalidType}`;
  return null;
}

/**
 * Estado de las fotos seleccionadas: validación, optimización, previews
 * (object URLs que se liberan al eliminar o desmontar) y límites.
 */
export function usePhotoSelection() {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [processingCount, setProcessingCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const photosRef = useRef<SelectedPhoto[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Liberar memoria de todas las previews al desmontar.
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)), []);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const files = Array.from(incoming);
      if (files.length === 0) return;

      const nextErrors: string[] = [];
      const existing = new Set(photosRef.current.map((photo) => photo.fingerprint));
      const unique = files.filter((file) => !existing.has(`${file.name}:${file.size}:${file.lastModified}`));

      const available = UPLOAD_LIMITS.maxFiles - photosRef.current.length - processingCount;
      if (unique.length > available) nextErrors.push(UPLOAD_MESSAGES.tooMany);
      const accepted = unique.slice(0, Math.max(0, available));

      setProcessingCount((count) => count + accepted.length);

      for (const file of accepted) {
        try {
          const problem = await validateOriginal(file);
          if (problem) {
            nextErrors.push(problem);
            continue;
          }
          counterRef.current += 1;
          const optimized = await optimizeImageInBrowser(file, `foto-${counterRef.current}`);
          const photo: SelectedPhoto = {
            id: `${Date.now()}-${counterRef.current}`,
            file: optimized,
            previewUrl: URL.createObjectURL(optimized),
            displayName: shortName(file.name),
            fingerprint: `${file.name}:${file.size}:${file.lastModified}`,
          };
          setPhotos((current) => [...current, photo]);
        } catch {
          nextErrors.push(`«${shortName(file.name)}»: ${UPLOAD_MESSAGES.unprocessable}`);
        } finally {
          setProcessingCount((count) => count - 1);
        }
      }

      setErrors(nextErrors);
    },
    [processingCount],
  );

  const removePhoto = useCallback((id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
    setErrors([]);
  }, []);

  return {
    photos,
    errors,
    isProcessing: processingCount > 0,
    processingCount,
    canAddMore: photos.length + processingCount < UPLOAD_LIMITS.maxFiles,
    addFiles,
    removePhoto,
  };
}
