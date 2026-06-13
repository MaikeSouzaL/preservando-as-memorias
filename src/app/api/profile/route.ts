import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toPublicProfile(row: any) {
  return {
    name: row.name ?? "",
    email: row.email ?? "",
    bio: row.bio ?? "",
    theme: row.theme ?? "noturno",
    privacy: row.privacy ?? "public",
    memorialPassword: row.memorial_password ?? "",
    notifyVelas: row.notify_velas ?? true,
    notifyTributos: row.notify_tributos ?? true,
    multiFactorEnabled: row.multi_factor_enabled ?? false,
    language: row.language ?? "pt-BR",
    timezone: row.timezone ?? "GMT-3",
    globalAudio: row.global_audio ?? true,
    isAdmin: row.is_admin ?? false,
    avatarUrl: row.avatar_url ?? "",
  };
}

export async function GET() {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  const supabase = await createClientServer();
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", session.userId).single();

  if (error || !profile) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ profile: toPublicProfile(profile) });
}

export async function PATCH(request: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = await createClientServer();

    const updates: Record<string, any> = {};
    if (typeof body.name === "string") updates.name = asString(body.name);
    if (typeof body.bio === "string") updates.bio = body.bio;
    if (typeof body.theme === "string") updates.theme = body.theme;
    if (body.privacy === "public" || body.privacy === "protected" || body.privacy === "private") updates.privacy = body.privacy;
    if (typeof body.notifyVelas === "boolean") updates.notify_velas = body.notifyVelas;
    if (typeof body.notifyTributos === "boolean") updates.notify_tributos = body.notifyTributos;
    if (typeof body.multiFactorEnabled === "boolean") updates.multi_factor_enabled = body.multiFactorEnabled;
    if (typeof body.language === "string") updates.language = body.language;
    if (typeof body.timezone === "string") updates.timezone = body.timezone;
    if (typeof body.globalAudio === "boolean") updates.global_audio = body.globalAudio;
    if (typeof body.avatarUrl === "string") updates.avatar_url = body.avatarUrl.trim();
    if (typeof body.memorialPassword === "string") updates.memorial_password = body.memorialPassword.trim() || null;

    const { data: updated, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.userId)
      .select("*")
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: "Não foi possível atualizar o perfil." }, { status: 500 });
    }

    return NextResponse.json({
      profile: toPublicProfile(updated),
      session: { email: session.email, isAdmin: session.isAdmin, userId: session.userId },
    });
  } catch {
    return NextResponse.json({ error: "Erro desconhecido" }, { status: 400 });
  }
}
