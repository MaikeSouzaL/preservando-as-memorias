import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  const body = await request.json();
  const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "A nova senha deve ter pelo menos 8 caracteres." }, { status: 400 });
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(session.userId, {
    password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: "Não foi possível alterar a senha." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
