import { TextareaHTMLAttributes, forwardRef, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hinweis?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hinweis, error, id, className = "", ...props }, ref) => {
    const generiert = useId();
    const feldId = id ?? generiert;
    const hinweisId = `${feldId}-hinweis`;
    const fehlerId = `${feldId}-fehler`;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={feldId} className="text-sm font-semibold text-text">
          {label}
        </label>
        {hinweis && (
          <p id={hinweisId} className="text-sm text-text-muted">
            {hinweis}
          </p>
        )}
        <textarea
          ref={ref}
          id={feldId}
          rows={6}
          className={`rounded-control border bg-surface px-4 py-3 text-base text-text transition-colors duration-200 ease-out placeholder:text-text-muted/70 ${
            error ? "border-red-600" : "border-border hover:border-text-muted"
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={[hinweis ? hinweisId : null, error ? fehlerId : null]
            .filter(Boolean)
            .join(" ") || undefined}
          {...props}
        />
        {error && (
          <p id={fehlerId} className="text-sm font-medium text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
