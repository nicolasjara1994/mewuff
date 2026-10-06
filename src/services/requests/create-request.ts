import "server-only";

import { after } from "next/server";

import { processUploadedPhotos } from "@/lib/images/process-upload";
import { describeError } from "@/lib/errors";
import { PRIVACY_POLICY_VERSION } from "@/lib/site";
import { getPetPhotoAnalyzer } from "@/services/ai/analyzer";
import type { CreatedRequest } from "@/types/requests";
import { toNewCustomRequest } from "@/types/requests";
import type { RequestFields } from "@/validations/request";

import { getRequestStore } from "./store";

/**
 * Caso de uso: registrar una solicitud de figura personalizada.
 * Los campos ya vienen validados; las fotos se validan y re-codifican aquí.
 */
export async function createCustomRequest(fields: RequestFields, files: File[]): Promise<CreatedRequest> {
  // Primero el store: si el backend no está disponible, falla antes de gastar CPU en imágenes.
  const store = await getRequestStore();
  const photos = await processUploadedPhotos(files);
  const input = toNewCustomRequest(fields, PRIVACY_POLICY_VERSION);
  const created = await store.createRequest(input, photos);

  // Análisis de IA opcional, ejecutado DESPUÉS de responder al cliente.
  const analyzer = await getPetPhotoAnalyzer();
  if (analyzer) {
    after(async () => {
      try {
        const analysis = await analyzer.analyze(
          photos.map((photo) => ({ data: photo.buffer, mimeType: photo.mimeType })),
          { petType: input.petType, petName: input.petName, customerComments: input.comments },
        );
        await store.saveAnalysis(created.id, analysis);
      } catch (error) {
        console.error(`[ai] análisis fallido (${analyzer.name}):`, describeError(error));
      }
    });
  }

  return created;
}
