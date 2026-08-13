import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const supabase = await createAdminClient();
  const [{ data: invoiceRows, error }, { data: homeRows }] = await Promise.all([
    supabase.from("funeral_invoices").select("*").order("period_start", { ascending: false }),
    supabase.from("funeral_homes").select("id, name"),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const homeNames = new Map((homeRows ?? []).map((h) => [h.id, h.name]));

  const invoices = (invoiceRows ?? []).map((inv) => ({
    id: inv.id,
    funeralHomeId: inv.funeral_home_id,
    funeralHomeName: homeNames.get(inv.funeral_home_id) ?? "Funerária removida",
    periodStart: inv.period_start,
    periodEnd: inv.period_end,
    billingMode: inv.billing_mode as "monthly" | "per_qr",
    baseFeeCents: inv.base_fee_cents,
    memorialsCount: inv.memorials_count,
    extraCount: inv.extra_count,
    extraFeeCents: inv.extra_fee_cents,
    totalCents: inv.total_cents,
    status: inv.status as "open" | "sent" | "paid" | "overdue" | "cancelled",
    dueDate: inv.due_date,
    paidAt: inv.paid_at,
    notes: inv.notes,
    createdAt: inv.created_at,
  }));

  return NextResponse.json({ invoices });
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  try {
    const body = await request.json();
    const funeralHomeId = String(body.funeralHomeId ?? "").trim();
    const periodStart = String(body.periodStart ?? "").trim();
    const periodEnd = String(body.periodEnd ?? "").trim();
    const dueDate = body.dueDate ? String(body.dueDate).trim() : null;

    if (!funeralHomeId) throw new Error("Selecione uma funerária.");
    if (!periodStart || !periodEnd) throw new Error("Informe o período (início e fim).");
    if (new Date(periodStart) > new Date(periodEnd)) throw new Error("O início do período deve ser antes do fim.");

    const supabase = await createAdminClient();

    const { data: home, error: homeError } = await supabase
      .from("funeral_homes")
      .select("id, name, billing_plan_id")
      .eq("id", funeralHomeId)
      .maybeSingle();
    if (homeError) throw new Error(homeError.message);
    if (!home) throw new Error("Funerária não encontrada.");

    let planId = home.billing_plan_id as string | null;
    if (!planId) {
      const { data: defaultPlan } = await supabase
        .from("funeral_billing_plans")
        .select("id")
        .eq("is_default", true)
        .maybeSingle();
      planId = defaultPlan?.id ?? null;
    }
    if (!planId) throw new Error("Nenhum plano de cobrança padrão configurado. Crie um em Planos de cobrança.");

    const { data: plan, error: planError } = await supabase
      .from("funeral_billing_plans")
      .select("*")
      .eq("id", planId)
      .single();
    if (planError || !plan) throw new Error("Plano de cobrança não encontrado.");

    // Memoriais criados por esta funerária dentro do período (inclusive nos dois extremos)
    const periodEndExclusive = ymd(new Date(new Date(periodEnd).getTime() + 24 * 60 * 60 * 1000));
    const { count: memorialsCount, error: countError } = await supabase
      .from("memorials")
      .select("id", { count: "exact", head: true })
      .eq("funeral_home_id", funeralHomeId)
      .gte("created_at", periodStart)
      .lt("created_at", periodEndExclusive);
    if (countError) throw new Error(countError.message);

    const memCount = memorialsCount ?? 0;
    const billingMode = plan.billing_mode as "monthly" | "per_qr";

    let baseFeeCents = 0;
    let extraCount = 0;
    let extraFeeCents = 0;

    if (billingMode === "monthly") {
      baseFeeCents = plan.monthly_fee_cents ?? 0;
      extraCount = Math.max(0, memCount - (plan.included_memorials ?? 0));
      extraFeeCents = extraCount * (plan.extra_memorial_price_cents ?? 0);
    } else {
      baseFeeCents = 0;
      extraCount = memCount;
      extraFeeCents = extraCount * (plan.extra_memorial_price_cents ?? 0);
    }

    const totalCents = baseFeeCents + extraFeeCents;

    const { data: invoice, error: insertError } = await supabase
      .from("funeral_invoices")
      .insert({
        funeral_home_id: funeralHomeId,
        period_start: periodStart,
        period_end: periodEnd,
        billing_mode: billingMode,
        base_fee_cents: baseFeeCents,
        memorials_count: memCount,
        extra_count: extraCount,
        extra_fee_cents: extraFeeCents,
        total_cents: totalCents,
        status: "open",
        due_date: dueDate,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        throw new Error("Já existe uma fatura para esta funerária neste período exato.");
      }
      throw new Error(insertError.message);
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar fatura.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
