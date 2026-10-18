import { Container } from "@/components/ui/Container";

/** Esqueleto mientras se consulta el pedido (solo transform/opacity, sin saltos de layout). */
export default function TrackingLoading() {
  return (
    <Container className="pt-32 pb-24 sm:pt-40">
      <p className="sr-only" role="status">
        Buscando tu pedido…
      </p>
      <div aria-hidden="true" className="space-y-6">
        <div className="h-4 w-40 rounded-full bg-line/70 motion-safe:animate-pulse" />
        <div className="h-12 w-full max-w-xl rounded-2xl bg-line/70 motion-safe:animate-pulse" />
        <div className="mt-10 aspect-[640/240] w-full rounded-[2rem] bg-linen motion-safe:animate-pulse" />
      </div>
    </Container>
  );
}
