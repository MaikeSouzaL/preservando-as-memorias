import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["open", "sent", "paid", "overdue", "cancelled"];

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
      update.paid_at = body.status === "paid" ? new Date().toISOString() : null;
    }
    if (body.notes !== undefined) update.notes = String(body.notes).trim() || null;
    if (body.dueDate !== undefined) update.due_date = body.dueDate || null;

    if (Object.keys(update).length === 0) throw new Error("Nenhum campo para atualizar.");

    const { data, error } = await supabase.from("funeral_invoices").update(update).eq("id", id).select().single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ invoice: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar fatura.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const { id } = await params;
  const supabase = await createAdminClient();
  const { error } = await supabase.from("funeral_invoices").delete().eq("id", id).eq("status", "open");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
