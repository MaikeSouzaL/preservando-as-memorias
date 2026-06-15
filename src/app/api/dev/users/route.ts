import { NextResponse } from "next/server";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const supabase = await createAdminClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, name, email, is_admin, is_dev_admin, created_at")
    .eq("is_dev_admin", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Erro ao buscar usuários: " + error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    users: profiles ?? [],
    diagnostic: {
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      profilesCount: profiles?.length,
      timestamp: Date.now()
    }
  });
}
