import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrackingLookupForm, type LookupError } from "@/components/tracking/TrackingLookupForm";
import { normalizeReference } from "@/validations/tracking";

export const metadata: Metadata = {
  title: "Seguimiento de tu figura",
  description: "Ingresa tu código de seguimiento para ver en qué etapa está la figura de tu mascota.",
  alternates: { canonical: "/seguimiento" },
};

const TIPS = [
  "Está en el mensaje de confirmación que viste al enviar tu solicitud.",
  "Empieza con MW- y tiene 6 letras o números.",
  "No distinguimos mayúsculas de minúsculas, ni importan los espacios.",
];

function toLookupError(value: string | string[] | undefined): LookupError | undefined {
  return value === "invalid" || value === "not-found" || value === "rate" ? value : undefined;
}

export default async function TrackingLookupPage({ searchParams }: PageProps<"/seguimiento">) {
  const { codigo, error } = await searchParams;

  // Envío del formulario (GET): valida y lleva a la URL propia del pedido.
  if (codigo !== undefined) {
    const reference = typeof codigo === "string" ? normalizeReference(codigo) : null;
    redirect(reference ? `/seguimiento/${reference}` : "/seguimiento?error=invalid");
  }

  return (
    <>
      <PageHeader
        eyebrow="Seguimiento"
        title="¿CÓMO VA LA FIGURA DE TU MASCOTA?"
        description="Ingresa el código que recibiste al enviar tu solicitud y te mostramos en qué etapa está."
      />

      <section aria-labelledby="lookup-title" className="pb-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <Reveal className="rounded-[2rem] border border-line bg-linen/50 p-6 sm:p-10">
            <h2 id="lookup-title" className="mb-6 font-display text-2xl text-ink">
              Consulta tu pedido
            </h2>
            <TrackingLookupForm error={toLookupError(error)} />
          </Reveal>

          <aside aria-labelledby="where-title">
            <h2 id="where-title" className="font-display text-2xl text-ink">
              ¿Dónde encuentro mi código?
            </h2>
            <ul className="mt-6 space-y-4">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 leading-relaxed text-muted">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-clay" fill="none">
                    <path
                      d="m4.5 10.5 3.5 3.5 7.5-8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>
    </>
  );
}
