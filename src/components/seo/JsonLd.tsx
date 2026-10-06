/**
 * Datos estructurados (schema.org). Se escapa "<" para que ningún contenido
 * pueda cerrar la etiqueta <script> (prevención de XSS).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
