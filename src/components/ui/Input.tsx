import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hinweis?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hinweis, error, id, className = "", ...props }, ref) => {
    const generiert = useId();
    const inputId = id ?? generiert;
    const hinweisId = `${inputId}-hinweis`;
    const fehlerId = `${inputId}-fehler`;

    return (
      <div className="flex flex-col gap-2">
        {/* Label immer über dem Feld, nie als Platzhalter */}
        <label htmlFor={inputId} className="text-sm font-semibold text-text">
          {label}
        </label>
        {hinweis && (
          <p id={hinweisId} className="text-sm text-text-muted">
            {hinweis}
          </p>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`min-h-11 rounded-control border bg-surface px-4 text-base text-text transition-colors duration-200 ease-out placeholder:text-text-muted/70 ${
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
Input.displayName = "Input";
