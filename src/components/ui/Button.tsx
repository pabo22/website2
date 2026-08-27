import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variante = "primary" | "secondary" | "ghost" | "onInk";

/**
 * min-h-11 = 44px Mindestgröße für Bedienelemente (Barrierefreiheit).
 *
 * Die Bewegung steckt in der Utility-Klasse `.press` (globals.css): Druck in
 * 140ms, Farbwechsel in 200ms. Getrennt, weil sich ein Klick sofort anfühlen
 * muss, ein Hover aber ruhig sein darf.
 */
const basis =
  "press inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-control " +
  "px-6 text-base font-semibold disabled:pointer-events-none disabled:opacity-60";

const varianten: Record<Variante, string> = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
  secondary: "border border-border bg-surface text-text hover:border-accent hover:text-accent",
  ghost: "text-accent hover:bg-accent-soft",
  onInk: "bg-ink-text text-ink hover:bg-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variante;
  /** Zeigt den Ladezustand an und sperrt den Button. */
  pending?: boolean;
  /** Beschriftung während des Ladens. */
  pendingLabel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", className = "", pending = false, pendingLabel, disabled, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      // disabled bewusst nach dem Spread setzen, damit ein durchgereichtes
      // disabled den Ladezustand nicht versehentlich aufhebt.
      {...props}
      aria-busy={pending || undefined}
      disabled={pending || disabled}
      className={`${basis} ${varianten[variant]} ${className}`}
    >
      {/*
        Beim Wechsel der Beschriftung tauschen zwei Texte die Plätze. Ohne
        Überblendung sieht man kurz beide - ein leichter Blur verbindet sie zu
        einer Bewegung statt zwei Objekten.
      */}
      <span
        className={`inline-flex items-center gap-2 transition-[filter,opacity] duration-200 ease-out ${
          pending ? "opacity-80 blur-[1.5px]" : "opacity-100 blur-0"
        }`}
      >
        {pending && (
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
        )}
        {pending && pendingLabel ? pendingLabel : children}
      </span>
    </button>
  )
);
Button.displayName = "Button";

/**
 * Optisch identisch zum Button, semantisch ein Link. Verhindert das verbreitete
 * <Link><button> - ein Button in einem Link ist ungültiges HTML und bricht die
 * Tastaturbedienung.
 */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variante;
  className?: string;
  children: React.ReactNode;
}) {
  const extern = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const klassen = `${basis} ${varianten[variant]} ${className}`;

  if (extern) {
    return (
      <a href={href} className={klassen}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={klassen}>
      {children}
    </Link>
  );
}
