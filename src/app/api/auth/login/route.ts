import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "rl:login", { limit: 5, windowSecs: 15 * 60 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();

    return NextResponse.json({
      profile: {
        name: profile?.name ?? data.user.user_metadata?.full_name ?? "",
        email: data.user.email,
        bio: profile?.bio ?? "",
        theme: profile?.theme ?? "noturno",
        privacy: profile?.privacy ?? "public",
        notifyVelas: profile?.notify_velas ?? true,
        notifyTributos: profile?.notify_tributos ?? true,
        multiFactorEnabled: profile?.multi_factor_enabled ?? false,
        language: profile?.language ?? "pt-BR",
        timezone: profile?.timezone ?? "GMT-3",
        globalAudio: profile?.global_audio ?? true,
        isAdmin: profile?.is_admin ?? false,
        isDevAdmin: profile?.is_dev_admin ?? false,
        avatarUrl: profile?.avatar_url ?? "",
      },
      session: {
        email: data.user.email,
        isAdmin: profile?.is_admin ?? false,
        isDevAdmin: profile?.is_dev_admin ?? false,
        userId: data.user.id,
      },
    });
  } catch (err: any) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Não foi possível entrar agora." }, { status: 500 });
  }
}
