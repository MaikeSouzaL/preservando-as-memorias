import { createAdminClient } from "@/src/lib/supabase";
import { currentBillingPeriod } from "@/src/components/funeral/format";
import type { FuneralHomeAccount } from "@/src/components/funeral/guard";

// ─── Billing plan ───────────────────────────────────────────────────────────

export type BillingMode = "monthly" | "per_qr";

export type BillingPlan = {
  id: string;
  name: string;
  description: string | null;
  billingMode: BillingMode;
  monthlyFeeCents: number;
  includedMemorials: number;
  extraMemorialPriceCents: number;
};

function mapPlan(r: Record<string, unknown>): BillingPlan {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? null,
    billingMode: r.billing_mode as BillingMode,
    monthlyFeeCents: (r.monthly_fee_cents as number) ?? 0,
    includedMemorials: (r.included_memorials as number) ?? 0,
    extraMemorialPriceCents: (r.extra_memorial_price_cents as number) ?? 0,
  };
}

/**
 * `funeral_homes.billing_plan_id` nulo significa "usa o plano padrão"
 * (is_default = true). Nunca inventa um plano — se não existir nenhum plano
 * padrão ativo cadastrado, retorna null e a tela mostra estado vazio.
 */
export async function resolveBillingPlan(funeralHome: Pick<FuneralHomeAccount, "billingPlanId">): Promise<BillingPlan | null> {
  const supabase = await createAdminClient();

  if (funeralHome.billingPlanId) {
    const { data } = await supabase
      .from("funeral_billing_plans")
      .select("*")
      .eq("id", funeralHome.billingPlanId)
      .maybeSingle();
    if (data) return mapPlan(data);
  }

  const { data } = await supabase
    .from("funeral_billing_plans")
    .select("*")
    .eq("is_default", true)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  return data ? mapPlan(data) : null;
}

// ─── Ciclo atual (uso + estimativa) ─────────────────────────────────────────

export type CycleUsage = {
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  billingMode: BillingMode;
  memorialsCount: number;
  includedMemorials: number;
  extraCount: number;
  baseFeeCents: number;
  extraFeeCents: number;
  totalCents: number;
  nextChargeDate: string;
};

export async function getCurrentCycleUsage(funeralHomeId: string, plan: BillingPlan): Promise<CycleUsage> {
  const supabase = await createAdminClient();
  const { start, end, label } = currentBillingPeriod();

  const { count } = await supabase
    .from("memorials")
    .select("id", { count: "exact", head: true })
    .eq("funeral_home_id", funeralHomeId)
    .eq("status", "ativo")
    .gte("created_at", start)
    .lt("created_at", end);

  const memorialsCount = count ?? 0;
  const extraCount = Math.max(0, memorialsCount - plan.includedMemorials);
  const extraFeeCents = extraCount * plan.extraMemorialPriceCents;
  const baseFeeCents = plan.monthlyFeeCents;

  return {
    periodStart: start,
    periodEnd: end,
    periodLabel: label,
    billingMode: plan.billingMode,
    memorialsCount,
    includedMemorials: plan.includedMemorials,
    extraCount,
    baseFeeCents,
    extraFeeCents,
    totalCents: baseFeeCents + extraFeeCents,
    nextChargeDate: end,
  };
}

// ─── Faturas ────────────────────────────────────────────────────────────────

export type FuneralInvoice = {
  id: string;
  periodStart: string;
  periodEnd: string;
  billingMode: BillingMode;
  baseFeeCents: number;
  memorialsCount: number;
  extraCount: number;
  extraFeeCents: number;
  totalCents: number;
  status: "open" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
};

function mapInvoice(r: Record<string, unknown>): FuneralInvoice {
  return {
    id: r.id as string,
    periodStart: r.period_start as string,
    periodEnd: r.period_end as string,
    billingMode: r.billing_mode as BillingMode,
    baseFeeCents: (r.base_fee_cents as number) ?? 0,
    memorialsCount: (r.memorials_count as number) ?? 0,
    extraCount: (r.extra_count as number) ?? 0,
    extraFeeCents: (r.extra_fee_cents as number) ?? 0,
    totalCents: (r.total_cents as number) ?? 0,
    status: r.status as FuneralInvoice["status"],
    dueDate: (r.due_date as string) ?? null,
    paidAt: (r.paid_at as string) ?? null,
    notes: (r.notes as string) ?? null,
    createdAt: r.created_at as string,
  };
}

export async function listInvoices(funeralHomeId: string): Promise<FuneralInvoice[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("funeral_invoices")
    .select("*")
    .eq("funeral_home_id", funeralHomeId)
    .order("period_start", { ascending: false });
  return (data ?? []).map(mapInvoice);
}

// ─── Perfil da empresa ──────────────────────────────────────────────────────

export type CompanyProfilePatch = {
  contactName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
};

export async function updateCompanyProfile(funeralHomeId: string, patch: CompanyProfilePatch): Promise<void> {
  const supabase = await createAdminClient();
  const row: Record<string, string> = {};
  if (patch.contactName !== undefined) row.contact_name = patch.contactName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.state !== undefined) row.state = patch.state;
  if (Object.keys(row).length === 0) return;

  const { error } = await supabase.from("funeral_homes").update(row).eq("id", funeralHomeId);
  if (error) throw new Error(error.message);
}

export type BankDataPatch = {
  bankPixKey?: string;
  bankHolderName?: string;
  bankCpfCnpj?: string;
};

export async function updateBankData(funeralHomeId: string, patch: BankDataPatch): Promise<void> {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("funeral_homes")
    .update({
      bank_pix_key: patch.bankPixKey ?? null,
      bank_holder_name: patch.bankHolderName ?? null,
      bank_cpf_cnpj: patch.bankCpfCnpj ?? null,
    })
    .eq("id", funeralHomeId);
  if (error) throw new Error(error.message);
}

// ─── Dono técnico dos memoriais criados pela funerária ──────────────────────

/**
 * `memorials.owner_id` é uuid NOT NULL com FK para `profiles`. A sessão da
 * funerária não é um usuário do Supabase Auth (é um cookie assinado à parte,
 * ver src/lib/funeral-auth.ts) — não existe um `auth.users`/`profiles` para
 * "a funerária" pronto para usar como dono do registro.
 *
 * Solução: uma conta de sistema por funerária (e-mail determinístico,
 * criada uma única vez via Supabase Auth Admin, igual ao padrão já usado em
 * src/app/api/memorial-publico/route.ts para famílias). Depois da primeira
 * vez, o profile já existe e é só reaproveitar.
 */
export async function getOrCreateFuneralHomeOwnerId(funeralHome: Pick<FuneralHomeAccount, "id" | "name" | "slug">): Promise<string> {
  const supabase = await createAdminClient();
  const systemEmail = `sistema+funeraria-${funeralHome.id}@preservandomemorias.com.br`;

  const { data: existing } = await supabase.from("profiles").select("id").eq("email", systemEmail).maybeSingle();
  if (existing?.id) return existing.id as string;

  type SupabaseAdmin = {
    auth: {
      admin: {
        createUser: (params: { email: string; email_confirm: boolean; user_metadata: unknown }) => Promise<{
          data: { user: { id: string } | null };
          error: { message: string } | null;
        }>;
      };
    };
  };

  const { data: created, error } = await (supabase as unknown as SupabaseAdmin).auth.admin.createUser({
    email: systemEmail,
    email_confirm: true,
    user_metadata: { full_name: `${funeralHome.name} (conta de sistema)`, is_funeral_home_system_account: true },
  });

  if (error || !created?.user) {
    throw new Error(`Não foi possível preparar a conta da funerária: ${error?.message ?? "erro desconhecido"}`);
  }

  // O trigger handle_new_user() já cria a linha em profiles; só ajustamos o nome.
  await supabase.from("profiles").update({ name: funeralHome.name }).eq("id", created.user.id);

  return created.user.id;
}
