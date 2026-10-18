import type { RequestStatus } from "@/types/requests";
import type { TrackingView } from "@/types/tracking";

export interface TrackingStage {
  key: "received" | "review" | "approved" | "production" | "shipped" | "delivered";
  label: string;
  description: string;
  /** Estados internos que corresponden a esta etapa visible para el cliente. */
  statuses: readonly RequestStatus[];
}

/** Etapas visibles de la línea de tiempo (los estados internos se agrupan en 6 etapas). */
export const TRACKING_STAGES: readonly TrackingStage[] = [
  {
    key: "received",
    label: "Recibida",
    description: "Tu solicitud llegó al taller.",
    statuses: ["pending_review"],
  },
  {
    key: "review",
    label: "En revisión",
    description: "Estudiamos tus fotos y preparamos la propuesta.",
    statuses: ["in_review", "quoted"],
  },
  {
    key: "approved",
    label: "Aprobada",
    description: "Todo confirmado: la figura entra en la fila del taller.",
    statuses: ["approved"],
  },
  {
    key: "production",
    label: "En producción",
    description: "Esculpimos y pintamos tu figura a mano.",
    statuses: ["in_production"],
  },
  {
    key: "shipped",
    label: "En camino",
    description: "Tu figura salió del taller rumbo a casa.",
    statuses: ["shipped"],
  },
  {
    key: "delivered",
    label: "Entregada",
    description: "Tu figura ya está en casa.",
    statuses: ["completed"],
  },
];

export function isClosedStatus(status: RequestStatus): boolean {
  return status === "rejected" || status === "cancelled";
}

export function stageIndexOf(status: RequestStatus): number {
  return TRACKING_STAGES.findIndex((stage) => stage.statuses.includes(status));
}

export interface StatusCopy {
  /** Frase para el <h1>. `{pet}` se reemplaza por el nombre de la mascota. */
  title: string;
  message: string;
}

export const STATUS_COPY: Record<RequestStatus, StatusCopy> = {
  pending_review: {
    title: "Recibimos la solicitud de {pet}.",
    message: "Ya está en nuestro taller. En 1 a 2 días hábiles revisamos tus fotos y te escribimos con una propuesta.",
  },
  in_review: {
    title: "Estamos revisando a {pet}.",
    message: "Estudiamos sus proporciones, colores y gestos. Si necesitamos algo más, te escribiremos por email.",
  },
  quoted: {
    title: "La propuesta de {pet} está lista.",
    message: "Te enviamos el tamaño, la terminación y el valor por email. Cuando la apruebes, comenzamos.",
  },
  approved: {
    title: "La figura de {pet} fue aprobada.",
    message: "Todo quedó confirmado. Muy pronto comenzamos a modelar la pieza.",
  },
  in_production: {
    title: "La figura de {pet} está en el taller.",
    message: "La estamos esculpiendo y pintando a mano, capa por capa. Este es el paso que más tiempo se lleva.",
  },
  shipped: {
    title: "La figura de {pet} va en camino.",
    message: "Salió de nuestro taller, protegida en una caja rígida, y viaja hacia tu casa.",
  },
  completed: {
    title: "¡{pet} ya está en su dirección de destino!",
    message: "Tu figura fue entregada. Esperamos que te encante!",
  },
  rejected: {
    title: "No pudimos continuar con la solicitud de {pet}.",
    message: "Te escribimos por email con los motivos. Si tienes dudas, contáctanos y lo revisamos juntos.",
  },
  cancelled: {
    title: "La solicitud de {pet} fue cancelada.",
    message: "Si fue un error o quieres retomarla, escríbenos indicando tu código y lo vemos.",
  },
};

export type StageState = "done" | "current" | "upcoming";

export interface StageView {
  key: TrackingStage["key"];
  label: string;
  description: string;
  state: StageState;
  /** Fecha ya formateada (zona horaria de Chile) o `null` si aún no ocurre. */
  date: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Santiago",
});

export function formatTrackingDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

/** Calcula el estado de cada etapa y su fecha a partir del historial. Pura y sin acceso a datos. */
export function buildStageViews(tracking: TrackingView): StageView[] {
  const currentIndex = stageIndexOf(tracking.status);

  return TRACKING_STAGES.map((stage, index) => {
    const event = tracking.events.find((item) => stage.statuses.includes(item.status));
    const state: StageState = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
    return {
      key: stage.key,
      label: stage.label,
      description: stage.description,
      state,
      date: event && state !== "upcoming" ? formatTrackingDate(event.at) : null,
    };
  });
}
