"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";

import type { SelectedPhoto } from "@/hooks/use-photo-selection";
import { cn } from "@/lib/cn";
import { ACCEPT_ATTRIBUTE, UPLOAD_HELP_TEXT, UPLOAD_LIMITS } from "@/validations/upload";

import { FieldError } from "./FormField";

interface PhotoUploaderProps {
  photos: SelectedPhoto[];
  errors: string[];
  fieldError?: string;
  processingCount: number;
  canAddMore: boolean;
  disabled: boolean;
  onAddFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}

const INPUT_ID = "field-photos";

export function PhotoUploader({
  photos,
  errors,
  fieldError,
  processingCount,
  canAddMore,
  disabled,
  onAddFiles,
  onRemove,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLLabelElement>(null);
  const inputDisabled = disabled || !canAddMore;

  // Evita que el navegador abra el archivo si se suelta fuera de la zona de carga.
  useEffect(() => {
    const prevent = (event: globalThis.DragEvent) => {
      if (!dropzoneRef.current?.contains(event.target as Node)) event.preventDefault();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!inputDisabled && event.dataTransfer.files.length > 0) onAddFiles(event.dataTransfer.files);
  };

  const describedBy = [`${INPUT_ID}-hint`, fieldError ? `${INPUT_ID}-error` : null].filter(Boolean).join(" ");

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink" id={`${INPUT_ID}-label`}>
          Fotografías de tu mascota
        </p>
        <p className="text-xs text-muted" aria-live="polite">
          {photos.length} de {UPLOAD_LIMITS.maxFiles} fotos
        </p>
      </div>
      <p id={`${INPUT_ID}-hint`} className="mt-1 text-sm text-muted">
        {UPLOAD_HELP_TEXT}
      </p>

      <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Fotografías seleccionadas">
        {photos.map((photo, index) => (
          <li key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-line">
            {/* Previews locales (blob:) — next/image no aplica a object URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.previewUrl}
              alt={`Foto ${index + 1}: ${photo.displayName}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              disabled={disabled}
              className="absolute top-1.5 right-1.5 grid size-9 place-items-center rounded-full bg-ink/75 text-cream backdrop-blur-sm transition-[background-color,transform] hover:scale-105 hover:bg-ink disabled:opacity-50"
            >
              <span className="sr-only">
                Eliminar foto {index + 1} ({photo.displayName})
              </span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                <path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}

        {Array.from({ length: processingCount }, (_, index) => (
          <li
            key={`processing-${index}`}
            className="grid aspect-square place-items-center rounded-xl bg-linen"
            aria-hidden="true"
          >
            <span className="size-6 animate-spin rounded-full border-2 border-line border-t-clay" />
          </li>
        ))}
      </ul>

      {canAddMore && (
        <div className={cn(photos.length + processingCount > 0 && "mt-3")}>
          <input
            id={INPUT_ID}
            data-field="photos"
            type="file"
            multiple
            accept={ACCEPT_ATTRIBUTE}
            disabled={inputDisabled}
            aria-labelledby={`${INPUT_ID}-label ${INPUT_ID}-action`}
            aria-describedby={describedBy}
            aria-invalid={fieldError ? true : undefined}
            className="peer sr-only"
            onChange={(event) => {
              if (event.target.files) onAddFiles(event.target.files);
              event.target.value = ""; // permite volver a elegir el mismo archivo
            }}
          />
          <label
            ref={dropzoneRef}
            htmlFor={INPUT_ID}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 text-center transition-colors duration-200",
              "peer-focus-visible:border-clay peer-focus-visible:ring-4 peer-focus-visible:ring-clay/15",
              photos.length + processingCount > 0 ? "py-6" : "py-12",
              isDragging ? "border-clay bg-clay/5" : "border-line bg-white/50 hover:border-ink/30 hover:bg-white/80",
              fieldError && !isDragging && "border-error/60",
            )}
          >
            <span className="grid size-12 place-items-center rounded-full bg-linen text-clay" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-6" fill="none">
                <path
                  d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span id={`${INPUT_ID}-action`} className="text-base font-medium text-ink">
              {photos.length > 0 ? "Agregar más fotografías" : "Selecciona tus fotografías"}
            </span>
            <span className="text-sm text-muted">
              <span className="hidden sm:inline">o arrástralas aquí · </span>
              {UPLOAD_LIMITS.maxFiles - photos.length - processingCount} disponibles
            </span>
          </label>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {processingCount > 0 ? `Preparando ${processingCount} ${processingCount === 1 ? "foto" : "fotos"}…` : ""}
      </p>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1">
          {errors.map((message, index) => (
            <li key={message}>
              <FieldError id={`${INPUT_ID}-issue-${index}`} message={message} />
            </li>
          ))}
        </ul>
      )}
      <FieldError id={`${INPUT_ID}-error`} message={fieldError} />
    </div>
  );
}
