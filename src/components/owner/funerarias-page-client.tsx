"use client";

import { useCallback, useEffect, useState } from "react";
import { centsToBRL } from "@/src/lib/platform-types";

type FuneralHome = {
  id: string;
  name: string;
  email: string;
  contactName: string;
  phone: string;
  cnpj?: string;
  city?: string;
  state?: string;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  billingPlanId: string | null;
  createdAt: string;
};

type BillingPlan = {
  id: string;
  name: string;
  billingMode: "monthly" | "per_qr";
  monthlyFeeCents: number;
  includedMemorials: number;
  extraMemorialPriceCents: number;
  isDefault: boolean;
  isActive: boolean;
};

function planSummary(plan?: BillingPlan) {
  if (!plan) return "";
  if (plan.billingMode === "monthly") {
    return `${centsToBRL(plan.monthlyFeeCents)}/mês · ${plan.includedMemorials} inclusos · +${centsToBRL(plan.extraMemorialPriceCents)}/excedente`;
  }
  return `${centsToBRL(plan.extraMemorialPriceCents)} por QR gerado`;
}

export function FunerariasPageClient() {
  const [homes, setHomes] = useState<FuneralHome[]>([]);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/funeral-homes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao carregar funerárias.");
      setHomes(data.funeralHomes ?? []);
      setPlans(data.billingPlans ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar funerárias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: string, extra?: Record<string, unknown>) {
    setActing(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/funeral-homes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível concluir a ação.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir a ação.");
    } finally {
      setActing(null);
    }
  }

  const defaultPlan = plans.find((p) => p.isDefault);
  const pending = homes.filter((h) => h.approvalStatus === "pending");
  const active = homes.filter((h) => h.approvalStatus === "approved" && h.isActive);
  const suspended = homes.filter((h) => h.approvalStatus === "approved" && !h.isActive);
  const rejected = homes.filter((h) => h.approvalStatus === "rejected");

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Funerárias</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
          Aprove, suspenda e defina quanto cobrar de cada funerária parceira.
        </p>
      </header>

      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-4">
        <Metric label="Pendentes" value={pending.length} tone="amber" />
        <Metric label="Ativas" value={active.length} tone="green" />
        <Metric label="Suspensas" value={suspended.length} tone="neutral" />
        <Metric label="Rejeitadas" value={rejected.length} tone="red" />
      </div>

      {pending.length > 0 && (
        <Section title="Aguardando aprovação" count={pending.length} tone="amber">
          {pending.map((fh) => (
            <FuneralCard key={fh.id} fh={fh} acting={acting}>
              <div className="flex gap-2">
                <ActionButton tone="green" onClick={() => act(fh.id, "approve")} disabled={acting === fh.id}>
                  Aprovar
                </ActionButton>
                <ActionButton tone="red" onClick={() => act(fh.id, "reject")} disabled={acting === fh.id}>
                  Rejeitar
                </ActionButton>
              </div>
            </FuneralCard>
          ))}
        </Section>
      )}

      <Section title="Funerárias ativas" count={active.length} tone="green">
        {active.length === 0 ? (
          <EmptyRow text="Nenhuma funerária ativa ainda." />
        ) : (
          active.map((fh) => {
            const currentPlan = plans.find((p) => p.id === fh.billingPlanId);
            return (
              <FuneralCard key={fh.id} fh={fh} acting={acting}>
                <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-3">
                  {/* A comissão por venda foi extinta junto com o papel de operador.
                      O que a funerária paga vem do plano de cobrança abaixo. */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-on-surface-variant">
                      Cobrança:{" "}
                      {currentPlan ? (
                        <span className="font-semibold text-tertiary">{currentPlan.name}</span>
                      ) : (
                        <span>
                          <span className="text-outline">Padrão</span>
                          {defaultPlan && <span className="font-semibold text-tertiary"> — {defaultPlan.name}</span>}
                        </span>
                      )}
                      {(currentPlan ?? defaultPlan) && (
                        <span className="ml-1 text-outline">({planSummary(currentPlan ?? defaultPlan)})</span>
                      )}
                    </p>
                    <select
                      disabled={acting === fh.id}
                      value={fh.billingPlanId ?? ""}
                      onChange={(e) => act(fh.id, "set_billing_plan", { billingPlanId: e.target.value || null })}
                      className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface focus:border-tertiary focus:outline-none"
                    >
                      <option value="">Herdar padrão{defaultPlan ? ` (${defaultPlan.name})` : ""}</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <ActionButton tone="neutral" onClick={() => act(fh.id, "suspend")} disabled={acting === fh.id}>
                      Suspender
                    </ActionButton>
                  </div>
                </div>
              </FuneralCard>
            );
          })
        )}
      </Section>

      {suspended.length > 0 && (
        <Section title="Suspensas" count={suspended.length} tone="neutral">
          {suspended.map((fh) => (
            <FuneralCard key={fh.id} fh={fh} acting={acting}>
              <div className="flex justify-end border-t border-outline-variant/20 pt-3">
                <ActionButton tone="green" onClick={() => act(fh.id, "reactivate")} disabled={acting === fh.id}>
                  Reativar
                </ActionButton>
              </div>
            </FuneralCard>
          ))}
        </Section>
      )}

      {rejected.length > 0 && (
        <Section title="Rejeitadas" count={rejected.length} tone="red">
          {rejected.map((fh) => (
            <FuneralCard key={fh.id} fh={fh} acting={acting}>
              <div className="flex justify-end border-t border-outline-variant/20 pt-3">
                <ActionButton tone="green" onClick={() => act(fh.id, "approve")} disabled={acting === fh.id}>
                  Aprovar
                </ActionButton>
              </div>
            </FuneralCard>
          ))}
        </Section>
      )}

      {homes.length === 0 && (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-16 text-center text-on-surface-variant">
          Nenhuma funerária cadastrada na plataforma ainda.
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "amber" | "green" | "red" | "neutral" }) {
  const colors = {
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    green: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    red: "border-red-500/20 bg-red-500/5 text-red-400",
    neutral: "border-outline-variant/30 bg-surface-container-low text-on-surface-variant",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[tone]}`}>
      <p className="text-xs uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Section({
  title,
  count,
  tone,
  children,
}: {
  title: string;
  count: number;
  tone: "amber" | "green" | "red" | "neutral";
  children: React.ReactNode;
}) {
  const dot = { amber: "bg-amber-400", green: "bg-emerald-400", red: "bg-red-400", neutral: "bg-outline" };
  const text = { amber: "text-amber-400", green: "text-emerald-400", red: "text-red-400", neutral: "text-on-surface-variant" };
  return (
    <section>
      <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${text[tone]}`}>
        <span className={`h-2 w-2 rounded-full ${dot[tone]}`} />
        {title} ({count})
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-outline-variant/30 py-8 text-center text-sm text-on-surface-variant">{text}</p>;
}

function ActionButton({
  tone,
  onClick,
  disabled,
  children,
}: {
  tone: "green" | "red" | "neutral";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const styles = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    red: "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15",
    neutral: "border-outline-variant/40 text-on-surface-variant hover:bg-surface-variant/40",
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${styles[tone]}`}
    >
      {disabled ? "..." : children}
    </button>
  );
}

function FuneralCard({ fh, acting, children }: { fh: FuneralHome; acting: string | null; children: React.ReactNode }) {
  void acting;
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-on-surface">{fh.name}</p>
          <p className="text-sm text-on-surface-variant">{fh.contactName} · {fh.email}</p>
          <p className="text-xs text-outline">
            {fh.phone}
            {fh.city ? ` · ${fh.city}${fh.state ? `/${fh.state}` : ""}` : ""}
            {fh.cnpj ? ` · ${fh.cnpj}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-outline">Cadastro: {new Date(fh.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

