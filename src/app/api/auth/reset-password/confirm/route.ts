import { NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ error: "Link expirado ou inválido. Solicite um novo." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível redefinir a senha." }, { status: 500 });
  }
}
