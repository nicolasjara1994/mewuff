import type { PetType, RequestFields } from "@/validations/request";

export const REQUEST_STATUSES = [
  "pending_review",
  "in_review",
  "quoted",
  "approved",
  "in_production",
  "shipped",
  "completed",
  "rejected",
  "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** Datos de la solicitud ya validados y listos para persistir. */
export interface NewCustomRequest {
  customerName: string;
  email: string;
  phone: string | null;
  petType: PetType;
  petName: string;
  comments: string | null;
  privacyConsentAt: string;
  privacyPolicyVersion: string;
}

/** Foto validada y re-codificada en el servidor (sin metadatos EXIF/GPS). */
export interface ProcessedPhoto {
  id: string;
  buffer: Buffer;
  mimeType: "image/webp";
  extension: "webp";
  width: number;
  height: number;
  sizeBytes: number;
  position: number;
}

export interface CreatedRequest {
  id: string;
  reference: string;
}

export function toNewCustomRequest(fields: RequestFields, policyVersion: string): NewCustomRequest {
  return {
    customerName: fields.customerName,
    email: fields.email,
    phone: fields.phone || null,
    petType: fields.petType,
    petName: fields.petName,
    comments: fields.comments || null,
    privacyConsentAt: new Date().toISOString(),
    privacyPolicyVersion: policyVersion,
  };
}
