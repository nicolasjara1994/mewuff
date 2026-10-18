import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { PRIVACY_POLICY_VERSION, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Cómo ${siteConfig.name} trata tus datos personales y las fotografías de tu mascota.`,
  alternates: { canonical: "/privacidad" },
};

/**
 * BORRADOR: este texto describe el funcionamiento técnico real del sitio, pero
 * debe ser revisado por asesoría legal antes de publicarse (p. ej. Ley 19.628
 * y la nueva Ley 21.719 de protección de datos personales en Chile).
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacidad"
        title="Política de privacidad"
        description={`Versión ${PRIVACY_POLICY_VERSION}. Documento en borrador, sujeto a revisión legal.`}
      />
      <Container className="pb-12">
        <div className="max-w-2xl space-y-10 leading-relaxed text-ink-soft [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <section>
            <h2>Qué datos recopilamos</h2>
            <ul>
              <li>Tu nombre, email y, si lo entregas, tu teléfono.</li>
              <li>El nombre y tipo de tu mascota, y los comentarios que nos escribas.</li>
              <li>Las fotografías de tu mascota que subas al formulario.</li>
            </ul>
            <p>No usamos cookies de seguimiento ni herramientas de publicidad.</p>
          </section>

          <section>
            <h2>Para qué los usamos</h2>
            <p>
              Únicamente para evaluar tu solicitud, contactarte con una propuesta y, si la aceptas, fabricar y enviar tu
              figura. No vendemos ni compartimos tus datos con terceros para fines comerciales.
            </p>
          </section>

          <section>
            <h2>Cómo protegemos tus fotografías</h2>
            <ul>
              <li>Se almacenan en un repositorio privado, sin acceso público.</li>
              <li>Antes de guardarlas eliminamos sus metadatos, incluida la ubicación GPS.</li>
              <li>Solo nuestro equipo puede verlas, mediante enlaces temporales.</li>
            </ul>
          </section>

          <section>
            <h2>Cuánto tiempo los conservamos</h2>
            <p>
              Mientras tu solicitud esté activa y durante el tiempo necesario para cumplir obligaciones legales. Si tu
              solicitud no avanza, eliminamos tus datos y fotografías en un plazo razonable.
            </p>
          </section>

          <section>
            <h2>Tus derechos</h2>
            <p>
              Puedes pedir acceso, corrección o eliminación de tus datos y fotografías en cualquier momento escribiendo
              a{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-ink underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>{" "}
              e indicando tu número de solicitud.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
