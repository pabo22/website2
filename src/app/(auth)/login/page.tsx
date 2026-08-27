import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Anmelden",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-text">Anmelden</h1>
      <p className="mt-2 text-text-muted">Melden Sie sich an, um Ihre Anfragen zu verwalten.</p>

      <div className="mt-8">
        {/* useSearchParams() in LoginForm erfordert laut Next.js eine
            Suspense-Grenze, damit die Seite weiterhin statisch vorgerendert
            werden kann. */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Noch kein Konto?{" "}
        <Link href="/registrieren" className="font-medium text-accent hover:text-accent-hover">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
