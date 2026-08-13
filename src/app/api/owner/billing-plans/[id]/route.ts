import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function centsFrom(v: unknown) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createAdminClient();

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const name = str(body.name);
      if (!name) throw new Error("Informe um nome para o plano.");
      update.name = name;
    }
    if (body.description !== undefined) update.description = str(body.description) || null;
    if (body.billingMode !== undefined) update.billing_mode = body.billingMode === "per_qr" ? "per_qr" : "monthly";
    if (body.monthlyFeeCents !== undefined) {
      const cents = centsFrom(body.monthlyFeeCents);
      if (cents === null) throw new Error("Mensalidade inválida.");
      update.monthly_fee_cents = cents;
    }
    if (body.includedMemorials !== undefined) {
      update.included_memorials = Math.max(0, Math.round(Number(body.includedMemorials)) || 0);
    }
    if (body.extraMemorialPriceCents !== undefined) {
      const cents = centsFrom(body.extraMemorialPriceCents);
      if (cents === null) throw new Error("Preço excedente inválido.");
      update.extra_memorial_price_cents = cents;
    }
    if (body.isActive !== undefined) update.is_active = Boolean(body.isActive);

    if (body.isDefault === true) {
      await supabase.from("funeral_billing_plans").update({ is_default: false }).eq("is_default", true).neq("id", id);
      update.is_default = true;
    } else if (body.isDefault === false) {
      update.is_default = false;
    }

    if (Object.keys(update).length === 0) {
      throw new Error("Nenhum campo para atualizar.");
    }

    const { data, error } = await supabase
      .from("funeral_billing_plans")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ plan: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar plano.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const { id } = await params;
  const supabase = await createAdminClient();

  const { data: plan } = await supabase.from("funeral_billing_plans").select("is_default").eq("id", id).maybeSingle();
  if (plan?.is_default) {
    return NextResponse.json({ error: "Não é possível excluir o plano padrão. Defina outro plano como padrão primeiro." }, { status: 400 });
  }

  const { count } = await supabase
    .from("funeral_homes")
    .select("id", { count: "exact", head: true })
    .eq("billing_plan_id", id);
  if (count && count > 0) {
    return NextResponse.json({ error: `Este plano está atribuído a ${count} funerária(s). Reatribua-as antes de excluir.` }, { status: 400 });
  }

  const { error } = await supabase.from("funeral_billing_plans").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
