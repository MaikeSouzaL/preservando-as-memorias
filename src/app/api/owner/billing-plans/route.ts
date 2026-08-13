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

export async function GET() {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("funeral_billing_plans")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Quantas funerárias usam cada plano (explicitamente, sem contar herança do padrão)
  const { data: homeCounts } = await supabase.from("funeral_homes").select("billing_plan_id");
  const counts = new Map<string, number>();
  (homeCounts ?? []).forEach((h) => {
    if (h.billing_plan_id) counts.set(h.billing_plan_id, (counts.get(h.billing_plan_id) ?? 0) + 1);
  });

  const plans = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    billingMode: p.billing_mode as "monthly" | "per_qr",
    monthlyFeeCents: p.monthly_fee_cents,
    includedMemorials: p.included_memorials,
    extraMemorialPriceCents: p.extra_memorial_price_cents,
    isDefault: p.is_default,
    isActive: p.is_active,
    funeralHomesCount: counts.get(p.id) ?? 0,
    createdAt: p.created_at,
  }));

  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  try {
    const body = await request.json();
    const name = str(body.name);
    if (!name) throw new Error("Informe um nome para o plano.");

    const billingMode = body.billingMode === "per_qr" ? "per_qr" : "monthly";
    const monthlyFeeCents = centsFrom(body.monthlyFeeCents ?? 0) ?? 0;
    const includedMemorials = Math.max(0, Math.round(Number(body.includedMemorials ?? 0)) || 0);
    const extraMemorialPriceCents = centsFrom(body.extraMemorialPriceCents ?? 0) ?? 0;
    const isDefault = Boolean(body.isDefault);
    const isActive = body.isActive !== false;

    const supabase = await createAdminClient();

    if (isDefault) {
      await supabase.from("funeral_billing_plans").update({ is_default: false }).eq("is_default", true);
    }

    const { data, error } = await supabase
      .from("funeral_billing_plans")
      .insert({
        name,
        description: str(body.description) || null,
        billing_mode: billingMode,
        monthly_fee_cents: monthlyFeeCents,
        included_memorials: includedMemorials,
        extra_memorial_price_cents: extraMemorialPriceCents,
        is_default: isDefault,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ plan: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar plano.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
