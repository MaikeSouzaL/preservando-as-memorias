import { NextResponse } from "next/server";
import { getAuthSession, type AuthSession } from "@/src/lib/auth-session";

type AdminGuard =
  | { session: AuthSession; response: null }
  | { session: null; response: NextResponse };

export async function requireAdminSession(): Promise<AdminGuard> {
  const session = await getAuthSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 }),
    };
  }

  if (!session.isAdmin) {
    return {
      session: null,
      response: NextResponse.json({ error: "Acesso administrativo obrigatório." }, { status: 403 }),
    };
  }

  return { session, response: null };
}
