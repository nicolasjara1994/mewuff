import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateRequestReference } from "./reference";
import type { RequestStore } from "./store";

/**
 * Almacenamiento en disco SOLO para desarrollo local, cuando Supabase aún no
 * está configurado. Permite probar el flujo completo sin servicios externos.
 * Nunca se usa en producción (ver `getRequestStore`).
 */
const ROOT = path.join(process.cwd(), ".local-data", "requests");

function requestDir(requestId: string): string {
  // El id siempre es un UUID generado por el servidor; se valida igualmente.
  if (!/^[0-9a-f-]{36}$/.test(requestId)) throw new Error("id inválido");
  return path.join(ROOT, requestId);
}

export function createLocalRequestStore(): RequestStore {
  return {
    async createRequest(input, photos) {
      const id = randomUUID();
      const reference = generateRequestReference();
      const dir = requestDir(id);
      await mkdir(dir, { recursive: true });

      try {
        const photoRecords = [];
        for (const photo of photos) {
          const fileName = `${photo.id}.${photo.extension}`;
          await writeFile(path.join(dir, fileName), photo.buffer);
          photoRecords.push({
            id: photo.id,
            file: fileName,
            mimeType: photo.mimeType,
            sizeBytes: photo.sizeBytes,
            width: photo.width,
            height: photo.height,
            position: photo.position,
          });
        }

        const record = {
          id,
          reference,
          createdAt: new Date().toISOString(),
          status: "pending_review",
          ...input,
          photos: photoRecords,
          aiAnalysis: null,
        };
        await writeFile(path.join(dir, "request.json"), JSON.stringify(record, null, 2), "utf8");
      } catch (error) {
        await rm(dir, { recursive: true, force: true });
        throw error;
      }

      console.info(`[local-store] Solicitud ${reference} guardada en .local-data/requests/${id}`);
      return { id, reference };
    },

    async deleteRequest(requestId) {
      await rm(requestDir(requestId), { recursive: true, force: true });
    },

    async saveAnalysis(requestId, analysis) {
      const file = path.join(requestDir(requestId), "request.json");
      const record = JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
      record.aiAnalysis = analysis;
      record.aiAnalyzedAt = new Date().toISOString();
      await writeFile(file, JSON.stringify(record, null, 2), "utf8");
    },
  };
}
