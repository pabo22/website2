"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error ?? "Registrierung ist fehlgeschlagen.");
        setIsSubmitting(false);
        return;
      }

      // Direkt nach der Registrierung anmelden, für einen reibungslosen Ablauf
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setIsSubmitting(false);

      if (signInResult?.error) {
        router.push("/login");
        return;
      }

      router.push("/konto");
      router.refresh();
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      setServerError("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input
        label="E-Mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Passwort"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError && (
        <p
          role="alert"
          className="einblenden rounded-control border border-red-600/30 bg-red-600/[0.07] px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" pending={isSubmitting} pendingLabel="Wird erstellt …">
        Konto erstellen
      </Button>
    </form>
  );
}
