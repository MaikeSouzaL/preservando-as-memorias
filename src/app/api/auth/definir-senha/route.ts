import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha precisa ter pelo menos 8 caracteres." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ error: "Não foi possível definir a senha." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível definir a senha." }, { status: 500 });
  }
}
