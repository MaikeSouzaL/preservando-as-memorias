import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_CLIENT_SECRET",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const { connectToDatabase } = await import("@/src/lib/mongodb");
        const { Curator } = await import("@/src/models/Curator");
        await connectToDatabase();

        const email = user.email.toLowerCase().trim();
        let curator = await Curator.findOne({ email });

        if (!curator) {
          const isAdmin = email.includes("admin") || email === "maikesouzaleite@gmail.com";
          curator = await Curator.create({
            name: user.name || "Curador",
            email,
            avatarUrl: user.image || "",
            isAdmin,
            bio: "Guardião das memórias da família.",
            theme: "noturno",
            privacy: "public",
            notifyVelas: true,
            notifyTributos: true,
            multiFactorEnabled: false,
            language: "pt-BR",
            timezone: "GMT-3",
            globalAudio: true,
            password: "",
          });
        }

        const { cookies } = await import("next/headers");
        const { serializeAuthSession } = await import("@/src/lib/auth-session");
        const cookieStore = await cookies();
        cookieStore.set(
          "auth_user",
          serializeAuthSession({
            email: curator.email,
            isAdmin: curator.isAdmin === true,
          }),
          {
            httpOnly: true,
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "lax",
          }
        );
      } catch (err) {
        console.error("Erro no callback signIn do NextAuth:", err);
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session & { accessToken?: string; user?: { id?: string; name?: string | null; email?: string | null; image?: string | null } };
      token: JWT & { accessToken?: string; id?: string };
    }) {
      if (token) {
        session.accessToken = token.accessToken;
        if (session.user) {
          session.user.id = token.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "chave-secreta-local-mock-seguro",
};
