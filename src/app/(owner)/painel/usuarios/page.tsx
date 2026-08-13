import { createAdminClient } from "@/src/lib/supabase";
import { UsersPageClient, type OwnerUserRow } from "@/src/components/owner/users-page-client";

export const dynamic = "force-dynamic";

export default async function OwnerUsersPage() {
  const supabase = await createAdminClient();

  const [{ data: profileRows }, { data: memorialRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, email, is_dev_admin, plan, created_at, last_seen_at")
      .order("created_at", { ascending: false }),
    supabase.from("memorials").select("owner_id"),
  ]);

  const memorialCounts = new Map<string, number>();
  (memorialRows ?? []).forEach((m) => {
    if (m.owner_id) memorialCounts.set(m.owner_id, (memorialCounts.get(m.owner_id) ?? 0) + 1);
  });

  const users: OwnerUserRow[] = (profileRows ?? []).map((p) => ({
    id: p.id,
    name: p.name || "Sem nome",
    email: p.email,
    isOwner: p.is_dev_admin === true,
    plan: p.plan ?? "free",
    memorialsCount: memorialCounts.get(p.id) ?? 0,
    createdAt: p.created_at,
    lastSeenAt: p.last_seen_at,
  }));

  return <UsersPageClient users={users} />;
}
