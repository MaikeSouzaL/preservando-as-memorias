import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * NOTA: esta rota foi reescrita para gravar diretamente via Supabase em vez de
 * passar por `updatePlatformData()` (que relia num diff de TODAS as tabelas da
 * plataforma para uma mudança de um campo só). Antes desta mudança, o payload de
 * update de `funeral_homes` incluía a coluna `qr_delivery_mode`, que nunca existiu
 * na tabela — toda aprovação, rejeição ou alteração de comissão falhava em
 * silêncio com um erro do Postgres. Ver `src/lib/platform-data.ts`.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = await request.json();
  const action = body.action as string;
  const supabase = await createAdminClient();

  if (action === "approve" || action === "reject") {
    const { data, error } = await supabase
      .from("funeral_homes")
      .update({
        approval_status: action === "approve" ? "approved" : "rejected",
        is_active: action === "approve",
      })
      .eq("id", id)
      .select("id, name, approval_status, is_active")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, funeralHome: data });
  }

  if (action === "suspend" || action === "reactivate") {
    const { data, error } = await supabase
      .from("funeral_homes")
      .update({ is_active: action === "reactivate" })
      .eq("id", id)
      .eq("approval_status", "approved")
      .select("id, name, is_active")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Funerária não encontrada ou não aprovada." }, { status: 404 });
    return NextResponse.json({ success: true, funeralHome: data });
  }

  if (action === "set_commission") {
    const percent = Number(body.adminCommissionPercent);
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return NextResponse.json({ error: "Percentual inválido (0–100)." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("funeral_homes")
      .update({ admin_commission_percent: percent })
      .eq("id", id)
      .select("id, name, admin_commission_percent")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, funeralHome: data });
  }

  if (action === "set_billing_plan") {
    const billingPlanId = body.billingPlanId === null || body.billingPlanId === "" ? null : String(body.billingPlanId);

    if (billingPlanId) {
      const { data: plan } = await supabase
        .from("funeral_billing_plans")
        .select("id")
        .eq("id", billingPlanId)
        .maybeSingle();
      if (!plan) return NextResponse.json({ error: "Plano de cobrança não encontrado." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("funeral_homes")
      .update({ billing_plan_id: billingPlanId })
      .eq("id", id)
      .select("id, name, billing_plan_id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, funeralHome: data });
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
