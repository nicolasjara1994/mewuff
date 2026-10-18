import type { Faq } from "@/content/faqs";

/**
 * Acordeón con <details>/<summary> nativos: accesible con teclado y
 * lector de pantalla sin JavaScript adicional.
 */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((faq) => (
        <details key={faq.question} className="group">
          <summary className="flex min-h-16 items-center justify-between gap-6 py-5 text-left font-display text-lg leading-snug text-ink transition-colors hover:text-clay sm:text-xl">
            {faq.question}
            <span
              aria-hidden="true"
              className="relative grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 group-open:rotate-45"
            >
              <span className="absolute h-px w-3 bg-current" />
              <span className="absolute h-3 w-px bg-current" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
