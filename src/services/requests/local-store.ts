import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { REQUEST_STATUSES, type RequestStatus } from "@/types/requests";
import type { TrackingEvent } from "@/types/tracking";

import { generateRequestReference } from "./reference";
import type { RequestStore } from "./store";

interface LocalRecord {
  reference: string;
  petName: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: TrackingEvent[];
  estimatedDelivery?: string;
  carrier?: string;
  carrierTrackingCode?: string;
}

function isStatus(value: unknown): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus);
}

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

    /**
     * Solo desarrollo: para probar los estados edita `status` (y, opcionalmente,
     * `statusHistory`, `estimatedDelivery`, `carrier`, `carrierTrackingCode`)
     * en `.local-data/requests/<id>/request.json`.
     */
    async findTracking(reference) {
      let ids: string[];
      try {
        ids = await readdir(ROOT);
      } catch {
        return null;
      }

      for (const id of ids) {
        if (!/^[0-9a-f-]{36}$/.test(id)) continue;
        let record: LocalRecord;
        try {
          record = JSON.parse(await readFile(path.join(ROOT, id, "request.json"), "utf8")) as LocalRecord;
        } catch {
          continue;
        }
        if (record.reference !== reference) continue;

        const status = isStatus(record.status) ? record.status : "pending_review";
        const events: TrackingEvent[] = (record.statusHistory ?? []).filter((event) => isStatus(event.status));
        if (events.length === 0) events.push({ status: "pending_review", at: record.createdAt });
        if (events[events.length - 1]?.status !== status) {
          events.push({ status, at: record.updatedAt ?? record.createdAt });
        }

        return {
          reference,
          petName: record.petName,
          status,
          createdAt: record.createdAt,
          events,
          estimatedDelivery: record.estimatedDelivery ?? null,
          carrier: record.carrier ?? null,
          carrierTrackingCode: record.carrierTrackingCode ?? null,
        };
      }
      return null;
    },
  };
}
