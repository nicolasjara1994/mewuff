import { TextField } from "@/components/request-form/FormField";
import { buttonStyles } from "@/components/ui/ButtonLink";

export type LookupError = "invalid" | "not-found" | "rate";

export const LOOKUP_ERROR_MESSAGES: Record<LookupError, string> = {
  invalid: "Revisa el código: empieza con MW- y tiene 6 letras o números, por ejemplo MW-7KD3QX.",
  "not-found": "No encontramos un pedido con ese código. Revisa que esté bien escrito.",
  rate: "Hiciste demasiadas consultas seguidas. Espera unos minutos e inténtalo nuevamente.",
};

/**
 * Formulario GET sin JavaScript: envía a /seguimiento?codigo=..., que valida y
 * redirige a /seguimiento/<código>. Así funciona igual aunque falle la hidratación.
 */
export function TrackingLookupForm({ error }: { error?: LookupError }) {
  return (
    <form action="/seguimiento" method="get" className="space-y-5" noValidate>
      <TextField
        id="codigo"
        name="codigo"
        label="Código de seguimiento"
        hint="Lo recibiste al enviar tu solicitud. Se ve así: MW-7KD3QX."
        error={error ? LOOKUP_ERROR_MESSAGES[error] : undefined}
        placeholder="MW-7KD3QX"
        required
        maxLength={24}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="font-mono tracking-widest uppercase placeholder:normal-case"
      />
      <button type="submit" className={buttonStyles("primary", "w-full sm:w-auto")}>
        Ver el estado de mi figura
      </button>
    </form>
  );
}
