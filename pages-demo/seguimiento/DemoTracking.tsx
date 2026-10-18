"use client";

import { useState, type FormEvent } from "react";

import { TextField } from "@/components/request-form/FormField";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { ButtonLink, buttonStyles } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { STATUS_COPY, buildStageViews } from "@/content/tracking";
import { LOOKUP_ERROR_MESSAGES } from "@/components/tracking/TrackingLookupForm";
import type { TrackingView } from "@/types/tracking";
import { normalizeReference } from "@/validations/tracking";

/**
 * Versión de demostración para GitHub Pages (sin servidor ni base de datos):
 * cualquier código con formato válido muestra el mismo pedido ficticio.
 * El workflow de Pages reemplaza `src/app/seguimiento` por esta carpeta.
 */
function demoTracking(reference: string): TrackingView {
  return {
    reference,
    petName: "Luna",
    status: "in_production",
    createdAt: "2026-09-28T15:00:00Z",
    events: [
      { status: "pending_review", at: "2026-09-28T15:00:00Z" },
      { status: "in_review", at: "2026-09-30T15:00:00Z" },
      { status: "approved", at: "2026-10-03T15:00:00Z" },
      { status: "in_production", at: "2026-10-08T15:00:00Z" },
    ],
    estimatedDelivery: null,
    carrier: null,
    carrierTrackingCode: null,
  };
}

export function DemoTracking() {
  const [tracking, setTracking] = useState<TrackingView | null>(null);
  const [error, setError] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget).get("codigo");
    const reference = normalizeReference(raw);
    setError(!reference);
    setTracking(reference ? demoTracking(reference) : null);
  }

  if (tracking) {
    const copy = STATUS_COPY[tracking.status];
    return (
      <>
        <PageHeader
          eyebrow={`Seguimiento · ${tracking.reference}`}
          title={copy.title.replace("{pet}", () => tracking.petName)}
          description={copy.message}
        />
        <section aria-labelledby="timeline-title" className="pb-20 sm:pb-24">
          <Container>
            <h2 id="timeline-title" className="sr-only">
              Etapas de tu figura
            </h2>
            <p className="mb-10 max-w-xl rounded-[1.25rem] border border-line bg-linen/50 px-5 py-4 text-sm leading-relaxed text-muted">
              Esto es una demostración con datos ficticios: el sitio publicado aquí no está conectado a pedidos reales.
            </p>
            <TrackingTimeline stages={buildStageViews(tracking)} />
            <div className="mt-12">
              <button type="button" onClick={() => setTracking(null)} className={buttonStyles("secondary")}>
                Consultar otro código
              </button>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Seguimiento"
        title="¿CÓMO VA LA FIGURA DE TU MASCOTA?"
        description="Ingresa el código que recibiste al enviar tu solicitud y te mostramos en qué etapa está."
      />
      <section aria-labelledby="lookup-title" className="pb-24">
        <Container>
          <div className="max-w-2xl rounded-[2rem] border border-line bg-linen/50 p-6 sm:p-10">
            <h2 id="lookup-title" className="mb-2 font-display text-2xl text-ink">
              Consulta tu pedido
            </h2>
            <p className="mb-6 text-sm text-muted">Demostración: prueba con MW-DEMO01 o cualquier código válido.</p>
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <TextField
                id="codigo"
                name="codigo"
                label="Código de seguimiento"
                hint="Se ve así: MW-7KD3QX."
                error={error ? LOOKUP_ERROR_MESSAGES.invalid : undefined}
                placeholder="MW-7KD3QX"
                required
                maxLength={24}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="font-mono tracking-widest uppercase placeholder:normal-case"
              />
              <button type="submit" className={buttonStyles("primary", "w-full sm:w-auto")}>
                Ver el estado de mi figura
              </button>
            </form>
          </div>
          <div className="mt-8">
            <ButtonLink href="/" variant="secondary">
              Volver al inicio
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
