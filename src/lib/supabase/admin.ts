import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase con la clave `service_role` (o "secret key").
 * SOLO para uso en el servidor: ignora RLS, por lo que nunca debe exponerse.
 */
let client: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  const { supabase } = getServerEnv();
  if (!supabase) return null;

  client ??= createClient<Database>(supabase.url, supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "x-application-name": "mewuff-studio-web" } },
  });
  return client;
}

export function getStorageBucket(): string {
  return getServerEnv().supabase?.bucket ?? "pet-photos";
}
