import { createAdminClient } from "@/src/lib/supabase";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export type OwnerStats = {
  users: { total: number; active30d: number; neverEntered: number };
  memorials: { total: number; byStatus: { ativo: number; rascunho: number; pending_payment: number } };
  qrCodes: { total: number; scans: number };
  revenue: { totalCents: number; paidOrdersCount: number };
  funeralHomes: { active: number; pending: number };
  invoices: { openCount: number; openTotalCents: number };
  deliveries: { pending: number };
  monthlySeries: { key: string; label: string; revenueCents: number; memorials: number }[];
};

/**
 * Agregados reais para a Visão Geral do painel do dono. Consultas direcionadas
 * (não usa `readPlatformData()` / `updatePlatformData()` — ver ADR
 * `brain/architecture/adr-2026-08-11-three-actor-schema-redesign.md` sobre o
 * custo de fazer 17 full-table scans nessa camada para uma leitura simples).
 */
export async function getOwnerStats(): Promise<OwnerStats> {
  const supabase = await createAdminClient();

  const [
    { count: totalUsers },
    { data: recentProfiles },
    { data: memorialsRows },
    { data: qrCodesRows },
    { data: ordersRows },
    { count: funeralHomesActive },
    { count: funeralHomesPending },
    { data: invoiceRows },
    { data: deliveryRows },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id, last_seen_at"),
    supabase.from("memorials").select("status, created_at"),
    supabase.from("qr_codes").select("scans"),
    supabase.from("orders").select("status, gross_amount_cents, created_at"),
    supabase.from("funeral_homes").select("id", { count: "exact", head: true }).eq("approval_status", "approved").eq("is_active", true),
    supabase.from("funeral_homes").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("funeral_invoices").select("status, total_cents"),
    supabase.from("qr_deliveries").select("status"),
  ]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const usersActive30d = (recentProfiles ?? []).filter((p) => p.last_seen_at && new Date(p.last_seen_at) >= thirtyDaysAgo).length;
  const usersNeverEntered = (recentProfiles ?? []).filter((p) => !p.last_seen_at).length;

  const memorialsByStatus = { ativo: 0, rascunho: 0, pending_payment: 0 };
  (memorialsRows ?? []).forEach((m) => {
    const key = (m.status ?? "rascunho") as keyof typeof memorialsByStatus;
    if (key in memorialsByStatus) memorialsByStatus[key] += 1;
  });

  const qrCodesTotal = (qrCodesRows ?? []).length;
  const qrCodesScans = (qrCodesRows ?? []).reduce((sum, q) => sum + (q.scans ?? 0), 0);

  const paidOrders = (ordersRows ?? []).filter((o) => o.status === "paid");
  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + (o.gross_amount_cents ?? 0), 0);

  const openInvoices = (invoiceRows ?? []).filter((i) => i.status === "open" || i.status === "sent" || i.status === "overdue");
  const openInvoicesTotalCents = openInvoices.reduce((sum, i) => sum + (i.total_cents ?? 0), 0);

  const pendingDeliveries = (deliveryRows ?? []).filter((d) => d.status !== "delivered" && d.status !== "cancelled").length;

  const months: OwnerStats["monthlySeries"] = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""), revenueCents: 0, memorials: 0 };
  });
  const monthIndex = new Map(months.map((m, i) => [m.key, i]));

  paidOrders.forEach((o) => {
    if (!o.created_at) return;
    const idx = monthIndex.get(monthKey(new Date(o.created_at)));
    if (idx !== undefined) months[idx].revenueCents += o.gross_amount_cents ?? 0;
  });
  (memorialsRows ?? []).forEach((m) => {
    if (!m.created_at) return;
    const idx = monthIndex.get(monthKey(new Date(m.created_at)));
    if (idx !== undefined) months[idx].memorials += 1;
  });

  return {
    users: { total: totalUsers ?? 0, active30d: usersActive30d, neverEntered: usersNeverEntered },
    memorials: { total: (memorialsRows ?? []).length, byStatus: memorialsByStatus },
    qrCodes: { total: qrCodesTotal, scans: qrCodesScans },
    revenue: { totalCents: totalRevenueCents, paidOrdersCount: paidOrders.length },
    funeralHomes: { active: funeralHomesActive ?? 0, pending: funeralHomesPending ?? 0 },
    invoices: { openCount: openInvoices.length, openTotalCents: openInvoicesTotalCents },
    deliveries: { pending: pendingDeliveries },
    monthlySeries: months,
  };
}
