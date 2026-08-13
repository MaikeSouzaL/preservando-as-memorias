import { cache } from "react";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getFuneralSession, type FuneralSession } from "@/src/lib/funeral-auth";
import { createAdminClient } from "@/src/lib/supabase";

/**
 * Guarda de sessão da funerária.
 *
 * A sessão (cookie assinado) só prova que o login aconteceu em algum momento
 * — ela não sabe se a conta foi suspensa ou reprovada DEPOIS disso (o cookie
 * vive até 12h, ver src/lib/funeral-auth.ts). Por isso toda rota/página
 * protegida precisa revalidar `is_active` e `approval_status` no banco a
 * cada request, não só confiar no cookie. É exatamente o que as funções
 * abaixo fazem — nunca leia `funeralHomes` a partir do cookie.
 */

export type FuneralHomeAccount = {
  id: string;
  name: string;
  slug: string;
  email: string;
  contactName: string;
  phone: string;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  billingPlanId: string | null;
  bankPixKey: string | null;
  bankHolderName: string | null;
  bankCpfCnpj: string | null;
  createdAt: string;
};

function mapRow(r: Record<string, unknown>): FuneralHomeAccount {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: (r.slug as string) ?? (r.id as string),
    email: r.email as string,
    contactName: (r.contact_name as string) ?? "",
    phone: (r.phone as string) ?? "",
    cnpj: (r.cnpj as string) ?? null,
    address: (r.address as string) ?? null,
    city: (r.city as string) ?? null,
    state: (r.state as string) ?? null,
    isActive: (r.is_active as boolean) ?? false,
    approvalStatus: (r.approval_status as FuneralHomeAccount["approvalStatus"]) ?? "pending",
    billingPlanId: (r.billing_plan_id as string) ?? null,
    bankPixKey: (r.bank_pix_key as string) ?? null,
    bankHolderName: (r.bank_holder_name as string) ?? null,
    bankCpfCnpj: (r.bank_cpf_cnpj as string) ?? null,
    createdAt: r.created_at as string,
  };
}

/**
 * Busca a linha de `funeral_homes` direto (query filtrada por id, não o
 * scan de 17 tabelas de `readPlatformData()`). `cache()` garante que, dentro
 * do mesmo request, o layout + a página não disparem a mesma query duas
 * vezes.
 */
export const loadFuneralHomeById = cache(async (id: string): Promise<FuneralHomeAccount | null> => {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("funeral_homes").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
});

export type GuardFailureReason = "no_session" | "not_found" | "pending" | "rejected" | "suspended";

export type GuardResult =
  | { ok: true; session: FuneralSession; funeralHome: FuneralHomeAccount }
  | { ok: false; reason: GuardFailureReason };

/** Núcleo compartilhado: resolve a sessão e revalida a conta no banco. */
export async function resolveFuneralHomeGuard(): Promise<GuardResult> {
  const session = await getFuneralSession();
  if (!session) return { ok: false, reason: "no_session" };

  const funeralHome = await loadFuneralHomeById(session.funeralHomeId);
  if (!funeralHome) return { ok: false, reason: "not_found" };

  if (funeralHome.approvalStatus === "pending") return { ok: false, reason: "pending" };
  if (funeralHome.approvalStatus === "rejected") return { ok: false, reason: "rejected" };
  if (!funeralHome.isActive) return { ok: false, reason: "suspended" };

  return { ok: true, session, funeralHome };
}

const REASON_QUERY: Record<GuardFailureReason, string> = {
  no_session: "",
  not_found: "conta",
  pending: "pendente",
  rejected: "reprovado",
  suspended: "suspenso",
};

/** Server Components (páginas). Redireciona para o login se algo não bater. */
export async function requireFuneralHomePage(): Promise<{ session: FuneralSession; funeralHome: FuneralHomeAccount }> {
  const result = await resolveFuneralHomeGuard();
  if (!result.ok) {
    const reason = REASON_QUERY[result.reason];
    redirect(reason ? `/funeraria/login?motivo=${reason}` : "/funeraria/login");
  }
  return { session: result.session, funeralHome: result.funeralHome };
}

/** Rotas de API. Retorna a resposta 401/403 pronta (limpando o cookie) em caso de falha. */
export async function requireFuneralHomeApi(): Promise<
  { ok: true; session: FuneralSession; funeralHome: FuneralHomeAccount } | { ok: false; response: NextResponse }
> {
  const result = await resolveFuneralHomeGuard();
  if (result.ok) return { ok: true, session: result.session, funeralHome: result.funeralHome };

  const messages: Record<GuardFailureReason, { status: number; error: string }> = {
    no_session: { status: 401, error: "Não autenticado." },
    not_found: { status: 401, error: "Conta não encontrada." },
    pending: { status: 403, error: "Cadastro em análise. Aguarde a aprovação do administrador." },
    rejected: { status: 403, error: "Cadastro não aprovado. Entre em contato com o suporte." },
    suspended: { status: 403, error: "Conta suspensa. Entre em contato com o suporte." },
  };
  const { status, error } = messages[result.reason];

  const response = NextResponse.json({ error }, { status });
  if (result.reason !== "no_session") {
    // Sessão existe mas a conta não passa mais na revalidação — derruba o
    // cookie para não ficar tentando de novo a cada request.
    response.cookies.set("funeral_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return { ok: false, response };
}
