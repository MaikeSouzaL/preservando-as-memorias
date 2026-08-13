import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "rl:reset-request", { limit: 3, windowSecs: 60 * 60 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001";

    // Always returns success to prevent email enumeration
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?next=/nova-senha`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a solicitação." }, { status: 500 });
  }
}
