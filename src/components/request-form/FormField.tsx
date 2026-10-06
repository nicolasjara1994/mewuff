import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const inputStyles = cn(
  "block w-full rounded-xl border border-line bg-white/70 px-4 py-3 text-base text-ink placeholder:text-muted/70",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "hover:border-ink/30 focus:border-clay focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay/15",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/15",
);

interface FieldShellProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function describedBy(id: string, hint?: ReactNode, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function FieldShell({ id, label, hint, error, optional, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-error">
      <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
        <path d="M10 1.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5ZM9.25 6a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0V6ZM10 14.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
      {message}
    </p>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
};

export function TextField({ id, label, hint, error, optional, className, ...props }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputStyles, className)}
        {...props}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
};

export function TextAreaField({ id, label, hint, error, optional, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputStyles, "min-h-36 resize-y leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}
