import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim();
        const password = credentials?.password ?? "";

        const adminEmail = process.env.ADMIN_EMAIL ?? "";
        const adminPassword = process.env.ADMIN_PASSWORD ?? "";

        // Bypass gate (dev/staging only)
        const bypassEnabled =
          (process.env.ADMIN_BYPASS_ENABLED ?? "false").toLowerCase() === "true";

        // Optional fallback (remove if you do not want any hardcoded fallback)
        const fallbackEmail =
          process.env.ADMIN_FALLBACK_EMAIL ?? "admin@maronfitness.co.zw";
        const fallbackPassword =
          process.env.ADMIN_FALLBACK_PASSWORD ?? "@Maron2026";

        // 1) Allow bypass ONLY if enabled and both fields blank
        if (!email && !password) {
          if (!bypassEnabled) return null;

          return {
            id: "admin-bypass",
            name: "Admin",
            email: adminEmail || fallbackEmail || "admin@local",
            role: "admin",
            bypass: true,
          };
        }

        // 2) Normal login requires both values
        if (!email || !password) return null;

        // 3) Primary env credentials
        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
          return { id: "admin", name: "Admin", email: adminEmail, role: "admin" };
        }

        // 4) Optional fallback credentials
        if (fallbackEmail && fallbackPassword && email === fallbackEmail && password === fallbackPassword) {
          return { id: "admin-fallback", name: "Admin", email: fallbackEmail, role: "admin" };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "admin";
        if (typeof user.bypass !== "undefined") token.bypass = user.bypass;
      }
      return token;
    },

    async session({ session, token }) {
      // session.user exists in NextAuth v4, but keep it safe:
      session.user = session.user || {};
      session.user.role = token.role;

      if (typeof token.bypass !== "undefined") {
        session.user.bypass = token.bypass;
      }

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },
};
