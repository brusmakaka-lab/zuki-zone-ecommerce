import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma, hasDatabase } from "@/lib/prisma";

const hasGoogleAuth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig = {
  adapter: hasDatabase() ? PrismaAdapter(getPrisma()) : undefined,
  session: { strategy: hasDatabase() ? "database" : "jwt" },
  providers: hasGoogleAuth
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !hasDatabase()) return true;
      const existing = await getPrisma().user.findUnique({ where: { email: user.email.toLowerCase() } });
      if (existing?.role === "ADMIN") return false;
      return true;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? token.sub ?? "";
        session.user.role = "USER";
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
