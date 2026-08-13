import { NextRequest, NextResponse } from "next/server";
import { createClientServer, createAdminClient } from "@/src/lib/supabase";
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
      return NextResponse.json(
        { error: "A senha precisa ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const supabase = await createClientServer();
    const supabaseAdmin = await createAdminClient();

    // Criamos o usuário pela API de admin, não por `signUp`.
    //
    // `signUp` dispara o e-mail de confirmação do Supabase, que tem cota baixa:
    // alguns cadastros seguidos e a rota passa a responder
    // "email rate limit exceeded" — o cadastro simplesmente para de funcionar.
    // Criando aqui, nenhum e-mail é enviado e a conta já nasce utilizável.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, name },
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("already registered") ||
        message.includes("already been") ||
        message.includes("already exists")
      ) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
      }
      console.error("Falha ao criar usuário:", error);
      return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
    }

    // Garante o perfil na hora, sem depender do trigger handle_new_user.
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ id: data.user.id, email, name }, { onConflict: "id" });

    if (profileError) {
      console.error("Erro ao criar/atualizar profile:", profileError);
    }

    // Grava os cookies sb-* para a pessoa já sair do cadastro logada, em vez de
    // ser jogada na tela de login logo depois de preencher tudo.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      console.error("Falha ao iniciar sessão logo após o cadastro:", signInError);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json(
      {
        profile: {
          name: profile?.name ?? name,
          email,
          bio: profile?.bio ?? "",
          avatarUrl: profile?.avatar_url ?? "",
          isAdmin: false,
          isDevAdmin: false,
        },
        session: { email, userId: data.user.id, isAdmin: false, isDevAdmin: false },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
  }
}
