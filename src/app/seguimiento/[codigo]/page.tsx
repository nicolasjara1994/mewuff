import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { STATUS_COPY, buildStageViews, formatTrackingDate, isClosedStatus } from "@/content/tracking";
import { ServiceUnavailableError, describeError } from "@/lib/errors";
import { TRACKING_LOOKUP_LIMIT, consumeRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, hashIdentifier } from "@/lib/security/request-guard";
import { siteConfig } from "@/lib/site";
import { getTracking } from "@/services/requests/tracking";
import type { TrackingView } from "@/types/tracking";
import { normalizeReference } from "@/validations/tracking";

// El código es un dato privado: la página no se indexa ni se guarda en cachés compartidas.
export const metadata: Metadata = {
  title: "Estado de tu figura",
  robots: { index: false, follow: false },
};

export default async function TrackingPage({ params }: PageProps<"/seguimiento/[codigo]">) {
  const { codigo } = await params;
  const reference = normalizeReference(codigo);
  // Código mal formado o inexistente: misma respuesta, para no revelar qué códigos existen.
  if (!reference) redirect("/seguimiento?error=invalid");

  const ipKey = `tracking-lookup:${hashIdentifier(getClientIp(await headers()))}`;
  if (!(await consumeRateLimit(ipKey, TRACKING_LOOKUP_LIMIT))) redirect("/seguimiento?error=rate");

  let tracking: TrackingView | null;
  try {
    tracking = await getTracking(reference);
  } catch (error) {
    if (!(error instanceof ServiceUnavailableError)) {
      console.error("[tracking] error inesperado:", describeError(error));
    }
    return <Unavailable />;
  }
  if (!tracking) redirect("/seguimiento?error=not-found");

  const copy = STATUS_COPY[tracking.status];
  const closed = isClosedStatus(tracking.status);
  const delivered = tracking.status === "completed";
  const showShipping =
    !closed && (tracking.carrier || tracking.carrierTrackingCode || (tracking.estimatedDelivery && !delivered));

  const mailSubject = encodeURIComponent(`Consulta por mi pedido ${reference}`);

  return (
    <>
      <PageHeader
        eyebrow={`Seguimiento · ${reference}`}
        title={copy.title.replace("{pet}", () => tracking.petName)}
        description={copy.message}
      />

      <section aria-labelledby="timeline-title" className="pb-20 sm:pb-24">
        <Container>
          <h2 id="timeline-title" className="sr-only">
            Etapas de tu figura
          </h2>

          {showShipping && (
            <Reveal className="mb-14 overflow-hidden rounded-[1.75rem] border border-line">
              <dl className="grid gap-px bg-line sm:grid-cols-3">
                <ShippingItem label="Empresa de transporte" value={tracking.carrier} />
                <ShippingItem label="Código del transporte" value={tracking.carrierTrackingCode} mono />
                <ShippingItem
                  label="Entrega estimada"
                  value={
                    tracking.estimatedDelivery && !delivered
                      ? formatTrackingDate(`${tracking.estimatedDelivery}T12:00:00Z`)
                      : null
                  }
                />
              </dl>
            </Reveal>
          )}

          {closed ? (
            <p className="max-w-xl rounded-[1.75rem] border border-line bg-linen/50 p-7 leading-relaxed text-muted">
              Este pedido ya no está activo, por eso no hay etapas que mostrar. Si tienes dudas, escríbenos y lo
              revisamos juntos.
            </p>
          ) : (
            <>
              <TrackingTimeline stages={buildStageViews(tracking)} />
              <p className="mt-10 text-sm text-muted">
                Los plazos son aproximados; te avisamos por email cuando tu figura cambie de etapa.
              </p>
            </>
          )}
        </Container>
      </section>

      <section aria-labelledby="help-title" className="py-20 sm:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 id="help-title" className="font-display text-3xl text-ink">
              ¿Algo no cuadra con tu pedido?
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Escríbenos indicando tu código <strong className="font-mono font-medium text-ink">{reference}</strong> y
              lo revisamos contigo. Atendemos {siteConfig.contact.hours.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`mailto:${siteConfig.contact.email}?subject=${mailSubject}`}>
              Escribir por email
            </ButtonLink>
            <ButtonLink href="/seguimiento" variant="secondary">
              Consultar otro código
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function ShippingItem({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="bg-cream/90 px-6 py-5">
      <dt className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{label}</dt>
      <dd className={mono ? "mt-1 font-mono tracking-wider text-ink" : "mt-1 font-display text-lg text-ink"}>
        {value ?? "Por confirmar"}
      </dd>
    </div>
  );
}

function Unavailable() {
  return (
    <PageHeader
      eyebrow="Seguimiento"
      title="No pudimos consultar tu pedido."
      description={
        <>
          Nuestro sistema no está disponible en este momento. Inténtalo de nuevo en unos minutos o escríbenos a{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="underline underline-offset-4">
            {siteConfig.contact.email}
          </a>
          .
        </>
      }
    />
  );
}
