import type { FieldErrors } from "@/validations/request";

export type ApiErrorCode =
  | "VALIDATION"
  | "INVALID_FILE"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "SERVICE_UNAVAILABLE"
  | "SERVER_ERROR";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: FieldErrors;
}

export type CreateRequestResponse = { ok: true; reference: string } | { ok: false; error: ApiError };
