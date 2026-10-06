import "server-only";

import { describeError } from "@/lib/errors";
import { getStorageBucket, getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

import { generateRequestReference } from "./reference";
import type { RequestStore } from "./store";

const UNIQUE_VIOLATION = "23505";
const MAX_REFERENCE_ATTEMPTS = 3;

export function createSupabaseRequestStore(): RequestStore {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase no configurado");
  const bucket = getStorageBucket();

  return {
    async createRequest(input, photos) {
      // 1. Crear la solicitud (reintenta si la referencia aleatoria colisiona).
      let created: { id: string; reference: string } | null = null;
      for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS && !created; attempt += 1) {
        const { data, error } = await supabase
          .from("custom_requests")
          .insert({
            reference: generateRequestReference(),
            customer_name: input.customerName,
            email: input.email,
            phone: input.phone,
            pet_type: input.petType,
            pet_name: input.petName,
            comments: input.comments,
            privacy_consent_at: input.privacyConsentAt,
            privacy_policy_version: input.privacyPolicyVersion,
          })
          .select("id, reference")
          .single();

        if (data) created = data;
        else if (error?.code !== UNIQUE_VIOLATION) throw new Error(`insert custom_requests: ${describeError(error)}`);
      }
      if (!created) throw new Error("No fue posible generar una referencia única");
      const requestId = created.id;

      // 2. Subir fotos al bucket PRIVADO con nombres generados por el servidor.
      const uploadedPaths: string[] = [];
      try {
        for (const photo of photos) {
          const storagePath = `${requestId}/${photo.id}.${photo.extension}`;
          const { error } = await supabase.storage.from(bucket).upload(storagePath, photo.buffer, {
            contentType: photo.mimeType,
            cacheControl: "0",
            upsert: false,
          });
          if (error) throw new Error(`upload: ${describeError(error)}`);
          uploadedPaths.push(storagePath);
        }

        // 3. Registrar metadatos de las fotos.
        const { error } = await supabase.from("request_photos").insert(
          photos.map((photo, index) => ({
            id: photo.id,
            request_id: requestId,
            storage_path: uploadedPaths[index] ?? "",
            mime_type: photo.mimeType,
            size_bytes: photo.sizeBytes,
            width: photo.width,
            height: photo.height,
            position: photo.position,
          })),
        );
        if (error) throw new Error(`insert request_photos: ${describeError(error)}`);
      } catch (error) {
        // Rollback best-effort: no dejar archivos ni filas huérfanas.
        if (uploadedPaths.length > 0) await supabase.storage.from(bucket).remove(uploadedPaths);
        await supabase.from("custom_requests").delete().eq("id", requestId);
        throw error;
      }

      return created;
    },

    async deleteRequest(requestId) {
      const { data: photos, error } = await supabase
        .from("request_photos")
        .select("storage_path")
        .eq("request_id", requestId);
      if (error) throw new Error(`select request_photos: ${describeError(error)}`);

      if (photos.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(bucket)
          .remove(photos.map((photo) => photo.storage_path));
        if (removeError) throw new Error(`remove photos: ${describeError(removeError)}`);
      }

      // Las filas de `request_photos` se eliminan en cascada.
      const { error: deleteError } = await supabase.from("custom_requests").delete().eq("id", requestId);
      if (deleteError) throw new Error(`delete custom_requests: ${describeError(deleteError)}`);
    },

    async saveAnalysis(requestId, analysis) {
      const { error } = await supabase
        .from("custom_requests")
        .update({ ai_analysis: analysis as unknown as Json, ai_analyzed_at: new Date().toISOString() })
        .eq("id", requestId);
      if (error) throw new Error(`update ai_analysis: ${describeError(error)}`);
    },
  };
}

/**
 * URL temporal (firmada) para que un administrador vea una foto privada.
 * Preparado para el futuro panel de administración, que debe autenticar antes de llamarla.
 */
export async function createSignedPhotoUrl(storagePath: string, expiresInSeconds = 300): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(getStorageBucket())
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) {
    console.error("[storage] signed url:", describeError(error));
    return null;
  }
  return data.signedUrl;
}
