import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

/**
 * ============================================================================
 * CONFIGURAÇÃO DO AUTH.JS (NEXTAUTH) - EXCLUSIVO PARA GOOGLE PROVIDER
 * ============================================================================
 * Para ativar o login social com o Google em produção, configure no seu arquivo .env:
 *
 * NEXTAUTH_URL="http://localhost:3000" (ou a URL oficial do seu domínio em produção)
 * NEXTAUTH_SECRET="gerar-chave-secreta-aleatoria-aqui"
 * GOOGLE_CLIENT_ID="seu-client-id-do-google-console.apps.googleusercontent.com"
 * GOOGLE_CLIENT_SECRET="seu-client-secret-do-google-console"
 * ============================================================================
 */

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_CLIENT_SECRET",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // O login social da Apple foi expressamente REMOVIDO por solicitação do usuário.
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session & { accessToken?: string; user?: { id?: string; name?: string | null; email?: string | null; image?: string | null } }; token: JWT & { accessToken?: string; id?: string } }) {
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
});

export { handler as GET, handler as POST };
