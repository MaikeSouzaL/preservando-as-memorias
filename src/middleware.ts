import { NextResponse, type NextRequest } from "next/server";

/**
 * Defesa em profundidade.
 *
 * A autorização de verdade continua em cada layout e rota de API — este
 * middleware só barra o óbvio antes de chegar lá, para que uma rota nova
 * esquecida não nasça aberta. Ele não valida a assinatura da sessão (isso
 * exigiria Node runtime); apenas exige presença de credencial.
 */

const FUNERAL_PREFIXES = ["/funeraria/dashboard", "/funeraria/dados-bancarios"];
const SUPABASE_COOKIE = /^sb-.*-auth-token/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (FUNERAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!request.cookies.get("funeral_session")?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/funeraria/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/painel") || pathname.startsWith("/dashboard")) {
    const hasSupabaseSession = request.cookies
      .getAll()
      .some((cookie) => SUPABASE_COOKIE.test(cookie.name) && cookie.value);

    if (!hasSupabaseSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/funeraria/:path*", "/painel", "/painel/:path*", "/dashboard", "/dashboard/:path*"],
};
