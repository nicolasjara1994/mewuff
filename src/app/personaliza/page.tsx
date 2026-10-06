import type { Metadata } from "next";

import { RequestForm } from "@/components/request-form/RequestForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { UPLOAD_LIMITS } from "@/validations/upload";

export const metadata: Metadata = {
  title: "Personaliza tu figura",
  description:
    "Envíanos fotos de tu mascota y cuéntanos qué la hace especial. Te enviaremos una propuesta para su figura personalizada hecha a mano.",
  alternates: { canonical: "/personaliza" },
};

const CHECKLIST = [
  `Entre 3 y ${UPLOAD_LIMITS.maxFiles} fotos nítidas, idealmente con luz natural.`,
  "Una de frente, una de perfil y una de cuerpo completo.",
  "Primeros planos de manchas, marcas o detalles especiales.",
  "Sus accesorios favoritos, si quieres incluirlos.",
];

export default function PersonalizePage() {
  return (
    <>
      <PageHeader
        eyebrow="Personaliza tu figura"
        title="Cuéntanos sobre tu mascota."
        description="Completa el formulario y envíanos algunas fotos. Lo revisamos con calma y te respondemos con una propuesta sin compromiso."
      />

      <Container className="grid gap-12 pb-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <section
          aria-labelledby="form-title"
          className="relative rounded-[2rem] border border-line bg-linen/50 p-6 sm:p-10"
        >
          <h2 id="form-title" className="sr-only">
            Formulario de solicitud
          </h2>
          <RequestForm />
        </section>

        <aside aria-labelledby="checklist-title" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="checklist-title" className="font-serif text-2xl text-ink">
            Qué fotos enviar
          </h2>
          <ul className="mt-6 space-y-4">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-muted">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-clay" fill="none">
                  <path
                    d="m4.5 10.5 3.5 3.5 7.5-8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-line p-5">
            <h3 className="text-sm font-semibold text-ink">Tus fotos están protegidas</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Las guardamos de forma privada, sin metadatos de ubicación, y solo nuestro equipo puede verlas. Puedes
              pedir que las eliminemos cuando quieras.
            </p>
          </div>
        </aside>
      </Container>
    </>
  );
}
