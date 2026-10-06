import "server-only";

import { NextResponse } from "next/server";

import type { ApiErrorCode, CreateRequestResponse } from "@/types/api";
import type { FieldErrors } from "@/validations/request";

const NO_STORE = { "Cache-Control": "no-store" };

export function apiSuccess(body: Extract<CreateRequestResponse, { ok: true }>, status = 201) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  options: { fieldErrors?: FieldErrors; headers?: Record<string, string> } = {},
) {
  const body: CreateRequestResponse = {
    ok: false,
    error: { code, message, ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}) },
  };
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...options.headers } });
}
