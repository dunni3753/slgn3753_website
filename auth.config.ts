import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) {
        const role = (auth?.user as { role?: string } | undefined)?.role;
        return role === "admin";
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = (user as { id: string }).id;
        token.avatarUrl = (user as { avatarUrl?: string }).avatarUrl ?? "";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (
          session.user as { role?: string; id?: string; avatarUrl?: string }
        ).role = token.role as string;
        (
          session.user as { role?: string; id?: string; avatarUrl?: string }
        ).id = token.id as string;
        (
          session.user as { role?: string; id?: string; avatarUrl?: string }
        ).avatarUrl = token.avatarUrl as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
