"use client";

import { useCallback, useEffect, useState } from "react";
import { centsToBRL } from "@/src/lib/platform-types";

type BillingPlan = {
  id: string;
  name: string;
  description: string;
  billingMode: "monthly" | "per_qr";
  monthlyFeeCents: number;
  includedMemorials: number;
  extraMemorialPriceCents: number;
  isDefault: boolean;
  isActive: boolean;
  funeralHomesCount: number;
  createdAt: string;
};

type FormState = {
  name: string;
  description: string;
  billingMode: "monthly" | "per_qr";
  monthlyFee: string;
  includedMemorials: string;
  extraMemorialPrice: string;
  isDefault: boolean;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  billingMode: "monthly",
  monthlyFee: "0,00",
  includedMemorials: "0",
  extraMemorialPrice: "0,00",
  isDefault: false,
  isActive: true,
};

function toCents(v: string) {
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function BillingPlansPageClient() {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/owner/billing-plans");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao carregar planos.");
      setPlans(data.plans ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar planos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(plan: BillingPlan) {
    setForm({
      name: plan.name,
      description: plan.description,
      billingMode: plan.billingMode,
      monthlyFee: (plan.monthlyFeeCents / 100).toFixed(2).replace(".", ","),
      includedMemorials: String(plan.includedMemorials),
      extraMemorialPrice: (plan.extraMemorialPriceCents / 100).toFixed(2).replace(".", ","),
      isDefault: plan.isDefault,
      isActive: plan.isActive,
    });
    setEditingId(plan.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Informe um nome para o plano.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        billingMode: form.billingMode,
        monthlyFeeCents: toCents(form.monthlyFee),
        includedMemorials: parseInt(form.includedMemorials, 10) || 0,
        extraMemorialPriceCents: toCents(form.extraMemorialPrice),
        isDefault: form.isDefault,
        isActive: form.isActive,
      };
      const res = await fetch(editingId ? `/api/owner/billing-plans/${editingId}` : "/api/owner/billing-plans", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar plano.");
      setShowForm(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar plano.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(plan: BillingPlan) {
    setBusyId(plan.id);
    try {
      const res = await fetch(`/api/owner/billing-plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao atualizar plano.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar plano.");
    } finally {
      setBusyId(null);
    }
  }

  async function makeDefault(plan: BillingPlan) {
    setBusyId(plan.id);
    try {
      const res = await fetch(`/api/owner/billing-plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao definir padrão.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao definir padrão.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(plan: BillingPlan) {
    if (!confirm(`Excluir o plano "${plan.name}"?`)) return;
    setBusyId(plan.id);
    try {
      const res = await fetch(`/api/owner/billing-plans/${plan.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao excluir plano.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir plano.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
          <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Planos de cobrança</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Defina se cada funerária paga mensalidade fixa ou por QR gerado. O plano padrão é aplicado a quem não tem plano específico.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-tertiary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-tertiary/85"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Novo plano
        </button>
      </header>

      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 space-y-4">
          <h2 className="text-lg font-medium text-on-surface">{editingId ? "Editar plano" : "Novo plano de cobrança"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome do plano">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Mensal Básico"
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              />
            </Field>
            <Field label="Modo de cobrança">
              <select
                value={form.billingMode}
                onChange={(e) => setForm((f) => ({ ...f, billingMode: e.target.value as "monthly" | "per_qr" }))}
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              >
                <option value="monthly">Mensalidade fixa</option>
                <option value="per_qr">Por QR gerado</option>
              </select>
            </Field>

            {form.billingMode === "monthly" && (
              <>
                <Field label="Mensalidade (R$)">
                  <input
                    value={form.monthlyFee}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyFee: e.target.value }))}
                    placeholder="199,00"
                    className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                  />
                </Field>
                <Field label="Memoriais inclusos por mês">
                  <input
                    type="number"
                    min={0}
                    value={form.includedMemorials}
                    onChange={(e) => setForm((f) => ({ ...f, includedMemorials: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                  />
                </Field>
              </>
            )}

            <Field label={form.billingMode === "monthly" ? "Preço por memorial excedente (R$)" : "Preço por QR gerado (R$)"}>
              <input
                value={form.extraMemorialPrice}
                onChange={(e) => setForm((f) => ({ ...f, extraMemorialPrice: e.target.value }))}
                placeholder="49,00"
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              />
            </Field>

            <Field label="Descrição (opcional)">
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              />
            </Field>

            <div className="flex items-end gap-6 pb-1">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="h-4 w-4 rounded border-outline-variant accent-tertiary"
                />
                Definir como plano padrão
              </label>
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-outline-variant accent-tertiary"
                />
                Ativo
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="rounded-full border border-outline-variant/40 px-5 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:border-outline-variant"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-tertiary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-tertiary/85 disabled:opacity-50"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar plano"}
            </button>
          </div>
        </form>
      )}

      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-16 text-center text-on-surface-variant">
          Nenhum plano de cobrança criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-on-surface">{plan.name}</p>
                    {plan.isDefault && (
                      <span className="rounded-full bg-tertiary/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-tertiary">
                        Padrão
                      </span>
                    )}
                    {!plan.isActive && (
                      <span className="rounded-full bg-surface-variant px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant">
                        Inativo
                      </span>
                    )}
                  </div>
                  {plan.description && <p className="mt-1 text-sm text-on-surface-variant">{plan.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-outline">
                    <span>{plan.billingMode === "monthly" ? "Mensalidade fixa" : "Cobrança por QR"}</span>
                    {plan.billingMode === "monthly" && (
                      <>
                        <span><strong className="text-on-surface">{centsToBRL(plan.monthlyFeeCents)}</strong>/mês</span>
                        <span>{plan.includedMemorials} memoriais inclusos</span>
                      </>
                    )}
                    <span>
                      {plan.billingMode === "monthly" ? "excedente" : "por QR"}:{" "}
                      <strong className="text-on-surface">{centsToBRL(plan.extraMemorialPriceCents)}</strong>
                    </span>
                    <span>{plan.funeralHomesCount} funerária(s) neste plano</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!plan.isDefault && (
                    <button
                      disabled={busyId === plan.id}
                      onClick={() => makeDefault(plan)}
                      className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface-variant transition hover:border-tertiary/40 hover:text-tertiary disabled:opacity-50"
                    >
                      Tornar padrão
                    </button>
                  )}
                  <button
                    disabled={busyId === plan.id}
                    onClick={() => toggleActive(plan)}
                    className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface-variant transition hover:border-outline-variant disabled:opacity-50"
                  >
                    {plan.isActive ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => startEdit(plan)}
                    className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface-variant transition hover:border-outline-variant"
                  >
                    Editar
                  </button>
                  <button
                    disabled={busyId === plan.id}
                    onClick={() => remove(plan)}
                    className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs uppercase tracking-wider text-outline">{label}</span>
      {children}
    </label>
  );
}
