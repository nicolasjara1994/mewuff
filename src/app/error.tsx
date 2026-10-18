"use client";

import { buttonStyles } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

/**
 * Error inesperado al renderizar. Nunca se muestra el detalle técnico al usuario;
 * `digest` permite correlacionarlo con los logs del servidor.
 */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Container className="flex min-h-[70dvh] flex-col items-start justify-center pt-32 pb-16">
      <p className="text-xs font-medium tracking-[0.22em] text-clay uppercase">Algo salió mal</p>
      <h1 className="mt-4 font-display text-5xl text-ink">No pudimos cargar esta página.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">Por favor, inténtalo nuevamente en unos segundos.</p>
      {error.digest && <p className="mt-2 text-sm text-muted">Código de referencia: {error.digest}</p>}
      <button type="button" onClick={() => retry()} className={buttonStyles("primary", "mt-10")}>
        Reintentar
      </button>
    </Container>
  );
}
