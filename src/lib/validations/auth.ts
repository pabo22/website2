import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Bitte Name mit mindestens 2 Zeichen angeben."),
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse angeben."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail-Adresse angeben."),
  password: z.string().min(1, "Bitte Passwort eingeben."),
});

export type LoginInput = z.infer<typeof loginSchema>;
