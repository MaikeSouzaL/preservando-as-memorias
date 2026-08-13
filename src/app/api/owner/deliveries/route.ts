import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const supabase = await createAdminClient();
  const [{ data: rows, error }, { data: memorialRows }] = await Promise.all([
    supabase.from("qr_deliveries").select("*").order("created_at", { ascending: false }),
    supabase.from("memorials").select("id, name, funeral_home_id"),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const memorials = new Map((memorialRows ?? []).map((m) => [m.id, m]));

  const deliveries = (rows ?? []).map((d) => ({
    id: d.id,
    memorialId: d.memorial_id,
    memorialName: memorials.get(d.memorial_id)?.name ?? "Memorial removido",
    responsible: d.responsible as "platform" | "funeral_home",
    status: d.status as "pending" | "printing" | "shipped" | "delivered" | "cancelled",
    recipientName: d.recipient_name,
    cep: d.cep,
    logradouro: d.logradouro,
    numero: d.numero,
    complemento: d.complemento,
    bairro: d.bairro,
    cidade: d.cidade,
    estado: d.estado,
    trackingCode: d.tracking_code,
    carrier: d.carrier,
    printedAt: d.printed_at,
    shippedAt: d.shipped_at,
    deliveredAt: d.delivered_at,
    notes: d.notes,
    createdAt: d.created_at,
  }));

  return NextResponse.json({ deliveries });
}
