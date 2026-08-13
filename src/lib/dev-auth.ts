import { NextResponse } from "next/server";
import { getAuthSession, type AuthSession } from "@/src/lib/auth-session";

type DevAdminGuard =
  | { session: AuthSession; response: null }
  | { session: null; response: NextResponse };

export async function requireDevAdminSession(): Promise<DevAdminGuard> {
  const session = await getAuthSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 }),
    };
  }

  if (!session.isDevAdmin) {
    return {
      session: null,
      response: NextResponse.json({ error: "Acesso restrito ao desenvolvedor." }, { status: 403 }),
    };
  }

  return { session, response: null };
}
