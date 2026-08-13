import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["pending", "printing", "shipped", "delivered", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createAdminClient();

    const update: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) throw new Error("Status inválido.");
      update.status = body.status;
      const now = new Date().toISOString();
      if (body.status === "printing") update.printed_at = now;
      if (body.status === "shipped") update.shipped_at = now;
      if (body.status === "delivered") update.delivered_at = now;
    }
    if (body.trackingCode !== undefined) update.tracking_code = String(body.trackingCode).trim() || null;
    if (body.carrier !== undefined) update.carrier = String(body.carrier).trim() || null;
    if (body.notes !== undefined) update.notes = String(body.notes).trim() || null;

    if (Object.keys(update).length === 0) throw new Error("Nenhum campo para atualizar.");

    const { data, error } = await supabase.from("qr_deliveries").update(update).eq("id", id).select().single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ delivery: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar entrega.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
