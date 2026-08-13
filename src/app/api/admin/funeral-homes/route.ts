import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const supabase = await createAdminClient();

  const [{ data: homesRows, error: homesError }, { data: plansRows, error: plansError }] = await Promise.all([
    supabase
      .from("funeral_homes")
      .select(
        "id, name, email, contact_name, phone, cnpj, city, state, is_active, approval_status, admin_commission_percent, billing_plan_id, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("funeral_billing_plans")
      .select("id, name, billing_mode, monthly_fee_cents, included_memorials, extra_memorial_price_cents, is_default, is_active")
      .order("is_default", { ascending: false })
      .order("name", { ascending: true }),
  ]);

  if (homesError) return NextResponse.json({ error: homesError.message }, { status: 500 });
  if (plansError) return NextResponse.json({ error: plansError.message }, { status: 500 });

  const funeralHomes = (homesRows ?? []).map((fh) => ({
    id: fh.id,
    name: fh.name,
    email: fh.email,
    contactName: fh.contact_name,
    phone: fh.phone,
    cnpj: fh.cnpj,
    city: fh.city,
    state: fh.state,
    isActive: fh.is_active,
    approvalStatus: fh.approval_status ?? "pending",
    adminCommissionPercent: fh.admin_commission_percent ?? 20,
    billingPlanId: fh.billing_plan_id ?? null,
    createdAt: fh.created_at,
  }));

  const billingPlans = (plansRows ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    billingMode: p.billing_mode as "monthly" | "per_qr",
    monthlyFeeCents: p.monthly_fee_cents,
    includedMemorials: p.included_memorials,
    extraMemorialPriceCents: p.extra_memorial_price_cents,
    isDefault: p.is_default,
    isActive: p.is_active,
  }));

  return NextResponse.json({ funeralHomes, billingPlans });
}
