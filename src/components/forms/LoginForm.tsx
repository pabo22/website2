"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setServerError("E-Mail oder Passwort ist falsch.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/konto";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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
        autoComplete="current-password"
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

      <Button type="submit" pending={isSubmitting} pendingLabel="Wird angemeldet …">
        Anmelden
      </Button>
    </form>
  );
}
