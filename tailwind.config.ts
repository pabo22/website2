import type { Config } from "tailwindcss";

/**
 * Alle Farben zeigen auf CSS-Variablen aus src/styles/design-tokens.css.
 * Dadurch lässt sich die komplette Farbwelt für ein neues Kundenprojekt an
 * genau einer Stelle tauschen, ohne eine einzige Klasse im Code anzufassen.
 */
const config: Config = {
  darkMode: "class",
  future: {
    // Bindet ALLE hover:-Klassen an @media (hover: hover). Ohne das bleibt auf
    // Touchgeräten nach einem Tap der Hover-Zustand hängen, und Karten sehen
    // aus, als wären sie ausgewählt.
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-sunken": "var(--color-surface-sunken)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-contrast": "var(--color-accent-contrast)",
        "accent-soft": "var(--color-accent-soft)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        "ink-text": "var(--color-ink-text)",
        "ink-muted": "var(--color-ink-muted)",
        "ink-border": "var(--color-ink-border)",
      },
      fontFamily: {
        // Native System-Font-Stack: moderne Grotesk-Anmutung auf jedem OS,
        // kein Webfont-Download, kein externer Build-Abhängigkeit.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        // Basisgröße 18px laut Designvorgabe
        base: ["1.125rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.55" }],
        hero: ["2.75rem", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "hero-md": ["3.75rem", { lineHeight: "1.03", letterSpacing: "-0.025em" }],
        "hero-lg": ["4.5rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        section: ["2rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "section-lg": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      // 8px-Grundraster als benannte Schritte
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
      borderRadius: {
        // EIN Radius-System: Flächen 16px, Bedienelemente 10px
        card: "1rem",
        control: "0.625rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(10, 15, 82, 0.04), 0 4px 14px rgba(10, 15, 82, 0.05)",
        raised: "0 2px 4px rgba(10, 15, 82, 0.05), 0 14px 30px rgba(10, 15, 82, 0.08)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        smooth: "var(--ease-in-out)",
      },
      maxWidth: {
        shell: "76rem",
      },
    },
  },
  plugins: [],
};

export default config;
