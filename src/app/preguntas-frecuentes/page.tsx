import type { Metadata } from "next";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqList } from "@/components/sections/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqs, type Faq } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resolvemos tus dudas sobre figuras personalizadas de mascotas: fotografías necesarias, tiempos, materiales, envío y cuidados.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

function groupByCategory(items: Faq[]): Array<[Faq["category"], Faq[]]> {
  const groups = new Map<Faq["category"], Faq[]>();
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  return [...groups.entries()];
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Preguntas frecuentes"
        title="TODO LO QUE QUIERES SABER ANTES DE ENCARGAR"
        description="Si no encuentras tu respuesta, escríbenos: te respondemos personalmente."
      />
      <Container className="space-y-16 pb-12">
        {groupByCategory(faqs).map(([category, items]) => (
          <section
            key={category}
            aria-labelledby={`faq-${category}`}
            className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-16"
          >
            <h2 id={`faq-${category}`} className="text-xs font-medium tracking-[0.22em] text-clay uppercase lg:pt-6">
              {category}
            </h2>
            <FaqList items={items} />
          </section>
        ))}
      </Container>
      <CtaBanner />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
