import type { ReactNode } from "react";

import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

/** Encabezado para páginas interiores (contiene el único <h1> de la página). */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <header className="pt-32 pb-12 sm:pt-40 sm:pb-16">
      <Container>
        <div className="motion-safe:animate-fade-up">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        </div>
      </Container>
    </header>
  );
}
