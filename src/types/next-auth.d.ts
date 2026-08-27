import "next-auth";

// NextAuth liefert standardmäßig kein `id` auf session.user - hier
// erweitern wir den Typ, damit TypeScript session.user.id überall kennt.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}
