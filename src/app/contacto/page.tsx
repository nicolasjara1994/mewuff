import type { Metadata } from "next";

import { ArrowIcon, ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos para resolver dudas sobre tu figura personalizada. Respondemos personalmente.",
  alternates: { canonical: "/contacto" },
};

const CHANNELS = [
  {
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    external: false,
  },
  {
    label: "WhatsApp",
    value: siteConfig.contact.whatsappDisplay,
    href: siteConfig.contact.whatsappUrl,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="CONVERSEMOS"
        description="¿Tienes una idea especial o una duda antes de encargar? Escríbenos y te respondemos personalmente."
      />

      <Container className="grid gap-6 pb-12 md:grid-cols-2">
        {CHANNELS.map((channel, index) => (
          <Reveal key={channel.label} delay={index * 0.08}>
            <a
              href={channel.href}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex h-full flex-col justify-between gap-10 rounded-[1.75rem] border border-line bg-white/50 p-8 transition-[transform,background-color,border-color] duration-500 hover:-translate-y-1 hover:border-ink/25 hover:bg-white"
            >
              <span className="text-xs font-medium tracking-[0.22em] text-clay uppercase">{channel.label}</span>
              <span className="flex items-center justify-between gap-4 font-display text-2xl break-all text-ink sm:text-3xl">
                {channel.value}
                <ArrowIcon className="size-5 shrink-0" />
              </span>
              {channel.external && <span className="sr-only">(se abre en una pestaña nueva)</span>}
            </a>
          </Reveal>
        ))}

        <Reveal delay={0.16} className="md:col-span-2">
          <div className="grid gap-10 rounded-[1.75rem] bg-linen/70 p-8 sm:grid-cols-3">
            <div>
              <h2 className="text-xs font-medium tracking-[0.22em] text-ink uppercase">Taller</h2>
              <p className="mt-3 text-muted">{siteConfig.contact.city}</p>
              <p className="text-muted">Atención solo con cita previa.</p>
            </div>
            <div>
              <h2 className="text-xs font-medium tracking-[0.22em] text-ink uppercase">Horario</h2>
              <p className="mt-3 text-muted">{siteConfig.contact.hours}</p>
            </div>
            <div>
              <h2 className="text-xs font-medium tracking-[0.22em] text-ink uppercase">Redes sociales</h2>
              <ul className="mt-3 space-y-1">
                {siteConfig.social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      {item.label}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 text-center md:col-span-2">
          <p className="text-muted">¿Ya tienes las fotos de tu mascota?</p>
          <ButtonLink href="/personaliza" className="mt-4">
            Crear mi figura
            <ArrowIcon />
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
