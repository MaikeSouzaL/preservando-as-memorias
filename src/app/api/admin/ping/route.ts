import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST — registra o timestamp de acesso do admin parceiro.
 * Chamado pelo AdminShell no mount, silenciosamente.
 * Só grava se o usuário for isAdmin e NÃO for isDevAdmin.
 */
export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session || !session.isAdmin || session.isDevAdmin) {
      return NextResponse.json({ ok: false });
    }

    const supabase = await createAdminClient();
    await supabase
      .from("profiles")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", session.userId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
