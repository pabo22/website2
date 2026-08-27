import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Registrieren",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-text">Konto erstellen</h1>
      <p className="mt-2 text-text-muted">
        Legen Sie ein Konto an, um Anfragen zu stellen und den Überblick zu behalten.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Bereits registriert?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Jetzt anmelden
        </Link>
      </p>
    </div>
  );
}
