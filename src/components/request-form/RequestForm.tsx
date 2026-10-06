"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { buttonStyles } from "@/components/ui/ButtonLink";
import { usePhotoSelection } from "@/hooks/use-photo-selection";
import { cn } from "@/lib/cn";
import type { CreateRequestResponse } from "@/types/api";
import {
  FIELD_LIMITS,
  PET_TYPES,
  REQUEST_FIELD_NAMES,
  type FieldErrors,
  type RequestFieldName,
  type RequestFieldsInput,
  validateRequestFields,
} from "@/validations/request";
import { UPLOAD_MESSAGES } from "@/validations/upload";

import { FieldError, TextAreaField, TextField } from "./FormField";
import { PhotoUploader } from "./PhotoUploader";
import { RequestSuccess } from "./RequestSuccess";

type FormValues = Record<RequestFieldName, string>;
type Status = "idle" | "submitting" | "success";

const INITIAL_VALUES: FormValues = {
  customerName: "",
  email: "",
  phone: "",
  petType: "",
  petName: "",
  comments: "",
  privacyConsent: "",
};

/** Orden visual de los campos: se usa para enfocar el primer error. */
const FOCUS_ORDER: Array<keyof FieldErrors> = [
  "customerName",
  "email",
  "phone",
  "petType",
  "petName",
  "comments",
  "photos",
  "privacyConsent",
];

const GENERIC_ERROR = "No pudimos enviar tu solicitud. Por favor, inténtalo nuevamente.";
const NETWORK_ERROR = "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.";

function focusField(name: keyof FieldErrors) {
  requestAnimationFrame(() => {
    const element = document.querySelector<HTMLElement>(`[data-field="${name}"]`);
    element?.focus();
    element?.scrollIntoView({ block: "center" });
  });
}

export function RequestForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const startedAtRef = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const photoSelection = usePhotoSelection();
  const { photos, isProcessing } = photoSelection;

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const isSubmitting = status === "submitting";

  function errorFor(name: RequestFieldName, nextValues: FormValues): string | undefined {
    const result = validateRequestFields(nextValues as RequestFieldsInput);
    return result.success ? undefined : result.fieldErrors[name];
  }

  function updateField(name: RequestFieldName, value: string) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    // Si el campo ya mostraba un error, se re-valida en vivo para quitarlo al corregir.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: errorFor(name, nextValues) }));
  }

  function handleBlur(name: RequestFieldName) {
    // No mostrar "campo obligatorio" a quien solo pasó por el campo sin escribir.
    if (values[name] === "" && !errors[name]) return;
    setErrors((current) => ({ ...current, [name]: errorFor(name, values) }));
  }

  function handleAddFiles(files: FileList | File[]) {
    setErrors((current) => ({ ...current, photos: undefined }));
    void photoSelection.addFiles(files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return; // evita envíos duplicados (doble clic / doble Enter)
    setFormError(null);

    const validation = validateRequestFields(values as RequestFieldsInput);
    const nextErrors: FieldErrors = validation.success ? {} : { ...validation.fieldErrors };
    if (photos.length === 0) nextErrors.photos = UPLOAD_MESSAGES.required;

    const firstInvalid = FOCUS_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      setErrors(nextErrors);
      setFormError("Revisa los campos marcados para continuar.");
      focusField(firstInvalid);
      return;
    }
    if (isProcessing) {
      setFormError("Espera un momento: aún estamos preparando tus fotos.");
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setErrors({});

    const body = new FormData();
    for (const name of REQUEST_FIELD_NAMES) body.append(name, values[name]);
    body.append("website", honeypotRef.current?.value ?? "");
    body.append("startedAt", String(startedAtRef.current));
    for (const photo of photos) body.append("photos", photo.file, photo.file.name);

    try {
      const response = await fetch("/api/requests", { method: "POST", body, credentials: "same-origin" });
      const data = (await response.json().catch(() => null)) as CreateRequestResponse | null;

      if (response.ok && data?.ok) {
        setReference(data.reference);
        setStatus("success");
        return;
      }

      const apiError = data && !data.ok ? data.error : null;
      const serverFieldErrors = apiError?.fieldErrors ?? {};
      setErrors(serverFieldErrors);
      setFormError(apiError?.message ?? GENERIC_ERROR);
      const firstServerInvalid = FOCUS_ORDER.find((name) => serverFieldErrors[name]);
      if (firstServerInvalid) focusField(firstServerInvalid);
      setStatus("idle");
    } catch {
      setFormError(NETWORK_ERROR);
      setStatus("idle");
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success" && reference) {
    return <RequestSuccess reference={reference} email={values.email.trim()} petName={values.petName.trim()} />;
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-12">
      {/* Honeypot anti-spam: invisible para personas, tentador para bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="field-website">No completes este campo</label>
        <input ref={honeypotRef} id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-6" disabled={isSubmitting}>
        <legend className="mb-6 flex items-baseline gap-3 font-serif text-2xl text-ink">
          <span className="text-base text-clay">01</span> Tus datos
        </legend>
        <TextField
          id="field-customerName"
          data-field="customerName"
          label="Nombre"
          name="customerName"
          autoComplete="name"
          maxLength={FIELD_LIMITS.customerName}
          value={values.customerName}
          error={errors.customerName}
          onChange={(event) => updateField("customerName", event.target.value)}
          onBlur={() => handleBlur("customerName")}
          required
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="field-email"
            data-field="email"
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            value={values.email}
            error={errors.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            required
          />
          <TextField
            id="field-phone"
            data-field="phone"
            label="Teléfono"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            optional
            placeholder="+56 9 1234 5678"
            maxLength={FIELD_LIMITS.phone}
            value={values.phone}
            error={errors.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            onBlur={() => handleBlur("phone")}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-6" disabled={isSubmitting}>
        <legend className="mb-6 flex items-baseline gap-3 font-serif text-2xl text-ink">
          <span className="text-base text-clay">02</span> Tu mascota
        </legend>

        <fieldset aria-describedby={errors.petType ? "field-petType-error" : undefined}>
          <legend className="mb-3 text-sm font-semibold text-ink">Tipo de mascota</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PET_TYPES.map((type, index) => (
              <div key={type.value}>
                <input
                  id={`field-petType-${type.value}`}
                  data-field={index === 0 ? "petType" : undefined}
                  type="radio"
                  name="petType"
                  value={type.value}
                  checked={values.petType === type.value}
                  onChange={() => updateField("petType", type.value)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`field-petType-${type.value}`}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border bg-white/60 px-3 text-sm font-medium text-ink-soft transition-all duration-200",
                    "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream hover:border-ink/30 hover:bg-white",
                    "peer-focus-visible:ring-4 peer-focus-visible:ring-clay/25",
                    errors.petType ? "border-error/60" : "border-line",
                  )}
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
          <FieldError id="field-petType-error" message={errors.petType} />
        </fieldset>

        <TextField
          id="field-petName"
          data-field="petName"
          label="Nombre de tu mascota"
          name="petName"
          autoComplete="off"
          maxLength={FIELD_LIMITS.petName}
          value={values.petName}
          error={errors.petName}
          onChange={(event) => updateField("petName", event.target.value)}
          onBlur={() => handleBlur("petName")}
          required
        />

        <TextAreaField
          id="field-comments"
          data-field="comments"
          label="Comentarios o características importantes"
          name="comments"
          optional
          rows={5}
          maxLength={FIELD_LIMITS.comments}
          placeholder="Ej.: tiene una mancha blanca en el pecho, siempre inclina la cabeza, usa un collar rojo…"
          hint={`${values.comments.length} / ${FIELD_LIMITS.comments} caracteres`}
          value={values.comments}
          error={errors.comments}
          onChange={(event) => updateField("comments", event.target.value)}
          onBlur={() => handleBlur("comments")}
        />
      </fieldset>

      <section aria-labelledby="photos-title" className="space-y-6">
        <h3 id="photos-title" className="flex items-baseline gap-3 font-serif text-2xl text-ink">
          <span className="text-base text-clay">03</span> Fotografías
        </h3>
        <PhotoUploader
          photos={photos}
          errors={photoSelection.errors}
          fieldError={errors.photos}
          processingCount={photoSelection.processingCount}
          canAddMore={photoSelection.canAddMore}
          disabled={isSubmitting}
          onAddFiles={handleAddFiles}
          onRemove={photoSelection.removePhoto}
        />
      </section>

      <div className="space-y-6 border-t border-line pt-8">
        <div>
          <div className="flex items-start gap-3">
            <input
              id="field-privacyConsent"
              data-field="privacyConsent"
              type="checkbox"
              name="privacyConsent"
              disabled={isSubmitting}
              checked={values.privacyConsent === "true"}
              onChange={(event) => updateField("privacyConsent", event.target.checked ? "true" : "")}
              aria-invalid={errors.privacyConsent ? true : undefined}
              aria-describedby={errors.privacyConsent ? "field-privacyConsent-error" : undefined}
              className="mt-1 size-5 shrink-0 cursor-pointer rounded border-line accent-ink"
            />
            <label htmlFor="field-privacyConsent" className="cursor-pointer text-sm leading-relaxed text-ink-soft">
              Acepto que Huella Atelier use mis datos y las fotografías de mi mascota solo para evaluar y fabricar mi
              figura, según la{" "}
              <Link href="/privacidad" target="_blank" className="font-semibold text-ink underline underline-offset-4">
                política de privacidad
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </Link>
              .
            </label>
          </div>
          <FieldError id="field-privacyConsent-error" message={errors.privacyConsent} />
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm font-medium text-error"
          >
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonStyles("primary", "w-full sm:w-auto sm:min-w-64")}
        >
          {isSubmitting ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream"
              />
              Enviando solicitud…
            </>
          ) : (
            "Enviar solicitud"
          )}
        </button>
        <p className="text-sm text-muted">Enviar la solicitud no tiene costo ni te compromete a comprar.</p>
      </div>
    </form>
  );
}
