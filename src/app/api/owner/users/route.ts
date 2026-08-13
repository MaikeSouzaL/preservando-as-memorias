import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const supabase = await createAdminClient();
  const [{ data: profileRows, error }, { data: memorialRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, email, is_admin, is_dev_admin, plan, created_at, last_seen_at")
      .order("created_at", { ascending: false }),
    supabase.from("memorials").select("owner_id"),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const memorialCounts = new Map<string, number>();
  (memorialRows ?? []).forEach((m) => {
    if (m.owner_id) memorialCounts.set(m.owner_id, (memorialCounts.get(m.owner_id) ?? 0) + 1);
  });

  const users = (profileRows ?? []).map((p) => ({
    id: p.id,
    name: p.name || "Sem nome",
    email: p.email,
    isOwner: p.is_dev_admin === true,
    plan: p.plan ?? "free",
    memorialsCount: memorialCounts.get(p.id) ?? 0,
    createdAt: p.created_at,
    lastSeenAt: p.last_seen_at,
  }));

  return NextResponse.json({ users });
}
