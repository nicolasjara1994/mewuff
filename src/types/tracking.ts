import type { RequestStatus } from "./requests";

export interface TrackingEvent {
  status: RequestStatus;
  /** ISO 8601 */
  at: string;
}

/**
 * Lo único que se expone públicamente al consultar un código de seguimiento.
 * Nunca incluye nombre, email, teléfono, fotos ni comentarios del cliente.
 */
export interface TrackingView {
  reference: string;
  petName: string;
  status: RequestStatus;
  createdAt: string;
  events: TrackingEvent[];
  /** Fecha (YYYY-MM-DD) */
  estimatedDelivery: string | null;
  carrier: string | null;
  carrierTrackingCode: string | null;
}
