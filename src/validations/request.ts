import * as z from "zod/mini";

/**
 * Esquema de la solicitud de figura personalizada.
 *
 * Se usa en el cliente (feedback inmediato) y en el servidor (fuente de verdad).
 * Se usa `zod/mini` para que el formulario cargue lo mínimo de JavaScript.
 */

export const PET_TYPES = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
] as const;

export type PetType = (typeof PET_TYPES)[number]["value"];

const PET_TYPE_VALUES = PET_TYPES.map((type) => type.value) as [PetType, ...PetType[]];

export const FIELD_LIMITS = {
  customerName: 80,
  email: 254,
  phone: 30,
  petName: 60,
  comments: 1500,
} as const;

// Caracteres de control y de override bidireccional (usados para ocultar o
// disfrazar contenido). React escapa el HTML al renderizar; esto limpia el texto
// almacenado para paneles administrativos, emails o exportaciones futuras.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g;
const LINE_BREAKS = /[\r\n\t]+/g;

function sanitizeSingleLine(value: string): string {
  return value
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(LINE_BREAKS, " ")
    .replace(/\s{2,}/g, " ");
}

function sanitizeMultiline(value: string): string {
  return value
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

const singleLine = () => z.string().check(z.overwrite(sanitizeSingleLine), z.trim());

const PHONE_PATTERN = /^\+?[0-9\s().-]{7,20}$/;

export const requestFieldsSchema = z.object({
  customerName: singleLine().check(
    z.minLength(2, "Debes ingresar tu nombre."),
    z.maxLength(FIELD_LIMITS.customerName, "El nombre es demasiado largo."),
  ),
  email: z.pipe(
    singleLine().check(
      z.toLowerCase(),
      z.minLength(1, "Ingresa tu email."),
      z.maxLength(FIELD_LIMITS.email, "Ingresa un email válido."),
    ),
    z.email("Ingresa un email válido."),
  ),
  phone: singleLine().check(
    z.maxLength(FIELD_LIMITS.phone, "Ingresa un teléfono válido."),
    z.refine(
      (value) => value === "" || PHONE_PATTERN.test(value),
      "Ingresa un teléfono válido (solo números, espacios y +).",
    ),
  ),
  petType: z.enum(PET_TYPE_VALUES, "Selecciona el tipo de mascota."),
  petName: singleLine().check(
    z.minLength(1, "Ingresa el nombre de tu mascota."),
    z.maxLength(FIELD_LIMITS.petName, "El nombre de tu mascota es demasiado largo."),
  ),
  comments: z
    .string()
    .check(
      z.overwrite(sanitizeMultiline),
      z.trim(),
      z.maxLength(FIELD_LIMITS.comments, `Los comentarios pueden tener hasta ${FIELD_LIMITS.comments} caracteres.`),
    ),
  privacyConsent: z.literal("true", "Debes aceptar la política de privacidad para continuar."),
});

export type RequestFieldsInput = z.input<typeof requestFieldsSchema>;
export type RequestFields = z.output<typeof requestFieldsSchema>;
export type RequestFieldName = keyof RequestFieldsInput;
export type FieldErrors = Partial<Record<RequestFieldName | "photos", string>>;

export const REQUEST_FIELD_NAMES = Object.keys(requestFieldsSchema.def.shape) as RequestFieldName[];

export type FieldsValidationResult =
  { success: true; data: RequestFields } | { success: false; fieldErrors: FieldErrors };

export function validateRequestFields(input: Record<RequestFieldName, unknown>): FieldsValidationResult {
  const result = requestFieldsSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key as RequestFieldName] = issue.message;
    }
  }
  return { success: false, fieldErrors };
}
