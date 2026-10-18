import { ArrowIcon, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBanner() {
  return (
    <section aria-labelledby="cta-title" className="py-16 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[120%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(169_138_117/0.3),transparent)]"
          />
          <p className="relative text-xs font-medium tracking-[0.24em] text-sand uppercase">Hazlo hoy!</p>
          <h2
            id="cta-title"
            className="relative mx-auto mt-5 max-w-2xl font-display text-4xl leading-tight text-balance sm:text-5xl"
          >
            Cuéntanos sobre tu mascota. Nosotros nos encargamos del resto.
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-pretty text-sand">
            Envía tus fotos sin compromiso y recibe una propuesta personalizada en 1 a 2 días hábiles.
          </p>
          <ButtonLink href="/personaliza" className="relative mt-10 bg-cream text-ink hover:bg-sand">
            Crear mi figura
            <ArrowIcon />
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
