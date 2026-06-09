import { NextResponse } from "next/server";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();
  const email = data.platformAdminEmail ?? null;

  if (!email) {
    return NextResponse.json({ admin: null });
  }

  const supabase = await createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("name, email, created_at").eq("email", email).single();

  return NextResponse.json({
    admin: profile ? { email: profile.email, name: profile.name, createdAt: profile.created_at } : { email, name: null, createdAt: null },
  });
}

export async function PATCH(request: Request) {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const body = await request.json();
  const newEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!newEmail || !newEmail.includes("@")) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  const supabase = await createAdminClient();
  const { data: newProfile } = await supabase.from("profiles").select("*").eq("email", newEmail).single();

  if (!newProfile) {
    return NextResponse.json(
      { error: "Nenhum usuário cadastrado com esse e-mail. O operador precisa criar conta antes." },
      { status: 404 }
    );
  }

  const data = await readPlatformData();
  const previousEmail = data.platformAdminEmail;

  if (previousEmail && previousEmail !== newEmail) {
    await supabase.from("profiles").update({ is_admin: false }).eq("email", previousEmail);
  }

  await supabase.from("profiles").update({ is_admin: true }).eq("email", newEmail);
  await updatePlatformData((d) => { d.platformAdminEmail = newEmail; });

  return NextResponse.json({
    success: true,
    admin: { email: newProfile.email, name: newProfile.name },
  });
}

export async function DELETE() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();
  if (data.platformAdminEmail) {
    const supabase = await createAdminClient();
    await supabase.from("profiles").update({ is_admin: false }).eq("email", data.platformAdminEmail);
    await updatePlatformData((d) => { d.platformAdminEmail = undefined; });
  }

  return NextResponse.json({ success: true });
}
