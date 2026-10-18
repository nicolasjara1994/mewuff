import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70dvh] flex-col items-start justify-center pt-32 pb-16">
      <p className="text-xs font-medium tracking-[0.22em] text-clay uppercase">Error 404</p>
      <h1 className="mt-4 font-display text-5xl text-ink">Esta página se escapó.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        Como un gato curioso, la página que buscas no está donde esperabas. Volvamos a un lugar conocido.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/personaliza" variant="secondary">
          Crear mi figura
        </ButtonLink>
      </div>
    </Container>
  );
}
