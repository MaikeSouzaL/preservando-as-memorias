import { NextResponse } from "next/server";
import { getAuthSession, type AuthSession } from "@/src/lib/auth-session";

type AdminGuard =
  | { session: AuthSession; response: null }
  | { session: null; response: NextResponse };

/** É o dono da plataforma? Único papel com acesso total. */
export function isOwner(session: AuthSession | null): boolean {
  return Boolean(session?.isDevAdmin);
}

/**
 * Guard das rotas do painel do dono.
 * Retorna a resposta de erro quando o acesso é negado, ou `null` quando é permitido.
 */
export async function requireOwnerSession(): Promise<NextResponse | null> {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  if (!isOwner(session)) {
    return NextResponse.json({ error: "Acesso restrito ao dono da plataforma." }, { status: 403 });
  }

  return null;
}

/**
 * Mesma verificação, no formato antigo `{ session, response }`.
 *
 * O papel de "operador/representante" foi extinto: `isAdmin` não concede mais
 * acesso administrativo. Antes deste ajuste o dono (`isDevAdmin`) levava 403 em
 * todas as rotas de configuração, inclusive as de preço.
 */
export async function requireAdminSession(): Promise<AdminGuard> {
  const session = await getAuthSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 }),
    };
  }

  if (!isOwner(session)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Acesso restrito ao dono da plataforma." }, { status: 403 }),
    };
  }

  return { session, response: null };
}
