import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { createAdminClient, createClientServer } from "@/src/lib/supabase";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  const limited = await checkRateLimit(request as any, "rl:change-password", {
    limit: 5,
    windowSecs: 60 * 60,
  });
  if (limited) return limited;

  const body = await request.json();
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "A nova senha deve ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  if (!currentPassword) {
    return NextResponse.json({ error: "Informe sua senha atual." }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json(
      { error: "A nova senha precisa ser diferente da atual." },
      { status: 400 }
    );
  }

  // Reautenticação: sem isso, qualquer sessão sequestrada (máquina compartilhada,
  // cookie vazado) vira takeover permanente da conta.
  const userClient = await createClientServer();
  const { error: reauthError } = await userClient.auth.signInWithPassword({
    email: session.email,
    password: currentPassword,
  });

  if (reauthError) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 403 });
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(session.userId, {
    password: newPassword,
  });

  if (error) {
    console.error("Falha ao alterar senha:", error);
    return NextResponse.json({ error: "Não foi possível alterar a senha." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
