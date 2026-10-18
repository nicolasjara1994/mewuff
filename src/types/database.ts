/**
 * Tipos de la base de datos de Supabase (escritos a mano para el MVP).
 * Pueden regenerarse con: npx supabase gen types typescript --project-id <id>
 */
import type { PetType } from "@/validations/request";
import type { RequestStatus } from "./requests";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      custom_requests: {
        Row: {
          id: string;
          reference: string;
          created_at: string;
          updated_at: string;
          customer_name: string;
          email: string;
          phone: string | null;
          pet_type: PetType;
          pet_name: string;
          comments: string | null;
          status: RequestStatus;
          privacy_consent_at: string;
          privacy_policy_version: string;
          ai_analysis: Json | null;
          ai_analyzed_at: string | null;
          estimated_delivery: string | null;
          carrier: string | null;
          carrier_tracking_code: string | null;
        };
        Insert: {
          reference: string;
          customer_name: string;
          email: string;
          phone?: string | null;
          pet_type: PetType;
          pet_name: string;
          comments?: string | null;
          status?: RequestStatus;
          privacy_consent_at: string;
          privacy_policy_version: string;
        };
        Update: {
          status?: RequestStatus;
          ai_analysis?: Json | null;
          ai_analyzed_at?: string | null;
          estimated_delivery?: string | null;
          carrier?: string | null;
          carrier_tracking_code?: string | null;
        };
        Relationships: [];
      };
      request_status_events: {
        Row: {
          id: number;
          request_id: string;
          status: RequestStatus;
          created_at: string;
        };
        Insert: {
          request_id: string;
          status: RequestStatus;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "request_status_events_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "custom_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      request_photos: {
        Row: {
          id: string;
          request_id: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          width: number;
          height: number;
          position: number;
          created_at: string;
        };
        Insert: {
          id: string;
          request_id: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          width: number;
          height: number;
          position: number;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "request_photos_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "custom_requests";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
    };
    Enums: {
      pet_type: PetType;
      request_status: RequestStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

export type { Json };
