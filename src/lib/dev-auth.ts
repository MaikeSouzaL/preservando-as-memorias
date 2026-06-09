import { NextResponse } from "next/server";
import { getAuthSession, type AuthSession } from "@/src/lib/auth-session";

export function getDevAdminEmail(): string {
  return (process.env.DEVADMIN_EMAIL ?? "maikesouzaleite@gmail.com").trim().toLowerCase();
}

export function isDevAdmin(email: string): boolean {
  return email.trim().toLowerCase() === getDevAdminEmail();
}

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

  if (!isDevAdmin(session.email)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Acesso restrito ao desenvolvedor." }, { status: 403 }),
    };
  }

  return { session, response: null };
}
