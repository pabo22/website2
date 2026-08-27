import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { loginSchema } from "./validations/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "E-Mail und Passwort",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Bitte E-Mail und Passwort korrekt angeben.");
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        // Bewusst dieselbe generische Fehlermeldung für "User existiert
        // nicht" und "Passwort falsch" - verhindert, dass Angreifer
        // registrierte E-Mail-Adressen erraten können.
        if (!user) {
          throw new Error("E-Mail oder Passwort ist falsch.");
        }

        const passwortKorrekt = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwortKorrekt) {
          throw new Error("E-Mail oder Passwort ist falsch.");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
