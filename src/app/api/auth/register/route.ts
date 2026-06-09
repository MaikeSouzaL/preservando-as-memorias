import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "rl:register", { limit: 5, windowSecs: 60 * 60 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const name = asString(body.name);
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Informe nome, e-mail e senha." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha precisa ter pelo menos 8 caracteres." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001"}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("email")) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
    }

    // Profile is auto-created by the DB trigger, but update name immediately
    await supabase.from("profiles").upsert({ id: data.user.id, email, name }, { onConflict: "id" });

    return NextResponse.json(
      {
        profile: {
          name,
          email,
          bio: `Guardião das memórias da família. Curadoria de lembranças criada por ${name}.`,
          theme: "noturno",
          privacy: "public",
          notifyVelas: true,
          notifyTributos: true,
          multiFactorEnabled: false,
          language: "pt-BR",
          timezone: "GMT-3",
          globalAudio: true,
          isAdmin: false,
        },
        session: { email, isAdmin: false, userId: data.user.id },
        emailConfirmationRequired: !data.session,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Erro no cadastro:", err);
    return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
  }
}
