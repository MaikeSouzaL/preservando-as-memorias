"use client";

import { useMemo, useState } from "react";
import { centsToBRL, cycleLabel, type BillingCycle, type FuneralPlan, type PlatformConfig } from "@/src/lib/platform-types";

// ─────────────────────────────────────────────────────────────────────────────
// Tela de Planos de Assinatura das Funerárias (reescrita do zero)
//
// Modelo: o admin cria planos MENSAIS para as funerárias. Cada plano define
// uma cota de memoriais/mês. Dentro da cota, a funerária cria memoriais sem
// pagar avulso; acima dela, paga o "preço excedente". Funerárias sem assinatura
// pagam o preço avulso configurado em Comercial.
// ─────────────────────────────────────────────────────────────────────────────

type Props = { initialConfig: PlatformConfig };

type FormState = {
  name: string;
  description: string;
  price: string; // R$ como string editável
  cycle: BillingCycle;
  unlimited: boolean;
  memorialLimit: string; // número como string
  extraPrice: string; // R$ como string
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "197,00",
  cycle: "monthly",
  unlimited: false,
  memorialLimit: "10",
  extraPrice: "49,00",
  active: true,
};

/** Converte "1.234,56" / "1234.56" / "197" em centavos de forma segura. */
function brlToCents(input: string): number {
  const clean = String(input).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
  const value = parseFloat(clean);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : 0;
}

/** Filtra qualquer entrada inválida vinda do banco (null, string, sem id). */
function normalizePlans(raw: unknown): FuneralPlan[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is FuneralPlan => !!p && typeof p === "object" && "id" in p && typeof (p as FuneralPlan).id === "string");
}

export function FuneralSettingsPanel({ initialConfig }: Props) {
  const [config, setConfig] = useState<PlatformConfig>(initialConfig);
  const [editingId, setEditingId] = useState<string | null>(null); // null = nenhum form aberto
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const plans = useMemo(() => normalizePlans(config.funeralPlans), [config.funeralPlans]);
  const ownerPct = Number.isFinite(config.ownerCommissionPercent) ? config.ownerCommissionPercent : 15;
  const defaultId = config.defaultFuneralPlanId;

  // ── Form helpers ──────────────────────────────────────────────────────────

  function openCreate() {
    setForm(EMPTY_FORM);
    setIsCreating(true);
    setEditingId("new");
    setMessage(null);
  }

  function openEdit(plan: FuneralPlan) {
    setForm({
      name: plan.name ?? "",
      description: plan.description ?? "",
      price: ((plan.priceCents ?? 0) / 100).toFixed(2).replace(".", ","),
      cycle: plan.cycle ?? "monthly",
      unlimited: plan.memorialLimit == null,
      memorialLimit: String(plan.memorialLimit ?? 10),
      extraPrice: ((plan.extraMemorialPriceCents ?? 0) / 100).toFixed(2).replace(".", ","),
      active: plan.active ?? true,
    });
    setIsCreating(false);
    setEditingId(plan.id);
    setMessage(null);
  }

  function closeForm() {
    setEditingId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const limit = form.unlimited ? null : Math.max(1, parseInt(form.memorialLimit, 10) || 1);
    const planId = isCreating ? crypto.randomUUID() : String(editingId);

    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "funeral",
          planId,
          name: form.name.trim() || "Plano",
          description: form.description.trim(),
          price: brlToCents(form.price) / 100,
          cycle: form.cycle,
          active: form.active,
          memorialLimit: limit,
          extraMemorialPriceCents: form.unlimited ? 0 : brlToCents(form.extraPrice) / 100,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setMessage({ kind: "err", text: payload.error ?? "Não foi possível salvar o plano." });
        return;
      }
      setConfig(payload.config);
      setMessage({ kind: "ok", text: isCreating ? "Plano criado com sucesso." : "Plano atualizado." });
      closeForm();
    } catch {
      setMessage({ kind: "err", text: "Erro de conexão ao salvar o plano." });
    } finally {
      setSaving(false);
    }
  }

  async function setAsDefault(planId: string) {
    setMessage(null);
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "funeral", planId, defaultFuneralPlanId: planId }),
      });
      const payload = await res.json();
      if (res.ok) {
        setConfig(payload.config);
        setMessage({ kind: "ok", text: "Plano padrão atualizado." });
      } else {
        setMessage({ kind: "err", text: payload.error ?? "Não foi possível definir o padrão." });
      }
    } catch {
      setMessage({ kind: "err", text: "Erro de conexão." });
    }
  }

  async function removePlan(plan: FuneralPlan) {
    if (!confirm(`Excluir o plano "${plan.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(plan.id);
    setMessage(null);
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "funeral_delete", planId: plan.id }),
      });
      const payload = await res.json();
      if (res.ok) {
        setConfig(payload.config);
        setMessage({ kind: "ok", text: "Plano excluído." });
        if (editingId === plan.id) closeForm();
      } else {
        setMessage({ kind: "err", text: payload.error ?? "Não foi possível excluir." });
      }
    } catch {
      setMessage({ kind: "err", text: "Erro de conexão." });
    } finally {
      setDeletingId(null);
    }
  }

  // ── Derivados para preview da receita do form ──────────────────────────────

  const formPriceCents = brlToCents(form.price);
  const formCommission = Math.round((formPriceCents * ownerPct) / 100);
  const formRepasse = formPriceCents - formCommission;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Assinaturas de funerária</p>
          <h2 className="font-h3 text-xl text-on-surface">Planos mensais com cota de memoriais</h2>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Funerárias assinantes criam memoriais dentro da cota mensal sem pagar avulso. Acima da cota,
            pagam o preço excedente. Quem não assina paga o valor avulso definido em <strong className="text-on-surface">Comercial</strong>.
          </p>
        </div>
        {editingId === null && (
          <button
            onClick={openCreate}
            className="shrink-0 rounded-full bg-tertiary px-5 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088]"
          >
            + Novo plano
          </button>
        )}
      </div>

      {/* Mensagem */}
      {message && (
        <p className={`rounded-lg px-4 py-2.5 text-sm ${
          message.kind === "ok"
            ? "border border-green-500/20 bg-green-500/10 text-green-300"
            : "border border-red-400/20 bg-red-500/10 text-red-300"
        }`}>
          {message.text}
        </p>
      )}

      {/* Formulário (criar / editar) */}
      {editingId !== null && (
        <form onSubmit={submitForm} className="rounded-2xl border border-tertiary/20 bg-[#0a192f99] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-medium text-on-surface">
              {isCreating ? "Novo plano de assinatura" : "Editar plano"}
            </h3>
            <button type="button" onClick={closeForm} className="text-on-surface-variant transition hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* Campos */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome do plano" className="sm:col-span-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Profissional"
                  className={inputCls}
                />
              </Field>

              <Field label="Preço (R$)">
                <input
                  required
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputCls}
                />
              </Field>

              <Field label="Recorrência">
                <select
                  value={form.cycle}
                  onChange={(e) => setForm((f) => ({ ...f, cycle: e.target.value as BillingCycle }))}
                  className={inputCls}
                >
                  <option value="monthly">Mensal</option>
                  <option value="annual">Anual</option>
                  <option value="one_time">Pagamento único</option>
                </select>
              </Field>

              <Field label="Memoriais incluídos por mês">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={form.unlimited ? "" : form.memorialLimit}
                    disabled={form.unlimited}
                    onChange={(e) => setForm((f) => ({ ...f, memorialLimit: e.target.value }))}
                    className={`w-24 ${inputCls} disabled:opacity-40`}
                  />
                  <label className="flex cursor-pointer items-center gap-1.5 text-sm text-on-surface-variant">
                    <input
                      type="checkbox"
                      checked={form.unlimited}
                      onChange={(e) => setForm((f) => ({ ...f, unlimited: e.target.checked }))}
                      className="h-4 w-4 accent-tertiary"
                    />
                    Ilimitado
                  </label>
                </div>
              </Field>

              <Field label="Preço por memorial excedente (R$)">
                <input
                  value={form.extraPrice}
                  disabled={form.unlimited}
                  onChange={(e) => setForm((f) => ({ ...f, extraPrice: e.target.value }))}
                  placeholder="0,00"
                  className={`${inputCls} disabled:opacity-40`}
                />
              </Field>

              <Field label="Descrição (opcional)" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="O que está incluído neste plano"
                  className={inputCls}
                />
              </Field>

              <label className="flex cursor-pointer items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 accent-tertiary"
                />
                <span className="text-sm text-on-surface-variant">Plano ativo (visível para as funerárias)</span>
              </label>
            </div>

            {/* Preview da receita */}
            <aside className="rounded-xl border border-outline-variant/20 bg-surface-container/40 p-5">
              <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-on-surface-variant">Receita por assinatura</p>
              <div className="space-y-2 text-sm">
                <Row label="Valor cobrado" value={centsToBRL(formPriceCents)} />
                <Row label={`Taxa do sistema (${ownerPct}%)`} value={`− ${centsToBRL(formCommission)}`} valueClass="text-[#e9c349]" />
                <div className="flex justify-between border-t border-outline-variant/30 pt-2">
                  <span className="font-medium text-on-surface">Seu repasse</span>
                  <span className="font-semibold text-on-surface">{centsToBRL(formRepasse)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-tertiary/15 bg-tertiary/5 p-3 text-xs text-on-surface-variant">
                {form.unlimited ? (
                  <>Memoriais <strong className="text-tertiary">ilimitados</strong> por mês.</>
                ) : (
                  <>
                    Até <strong className="text-tertiary">{parseInt(form.memorialLimit, 10) || 0}</strong> memoriais/mês.
                    Excedente a <strong className="text-tertiary">{centsToBRL(brlToCents(form.extraPrice))}</strong> cada.
                  </>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50"
            >
              {saving ? "Salvando..." : isCreating ? "Criar plano" : "Salvar alterações"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-outline-variant/40 px-5 py-2.5 text-sm text-on-surface-variant transition hover:text-on-surface"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de planos / estado vazio */}
      {plans.length === 0 ? (
        editingId === null && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-outline-variant/40 bg-[#0a192f66] p-10 text-center">
            <span className="material-symbols-outlined mb-3 text-5xl text-tertiary/60">subscriptions</span>
            <p className="mb-1 text-base font-medium text-on-surface">Nenhum plano de assinatura ainda</p>
            <p className="mx-auto mb-6 max-w-md text-sm text-on-surface-variant">
              Crie o primeiro plano mensal. Defina o preço, quantos memoriais a funerária pode criar por mês
              e quanto custa cada memorial acima dessa cota.
            </p>
            <button
              onClick={openCreate}
              className="rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088]"
            >
              Criar primeiro plano
            </button>
          </div>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const priceCents = plan.priceCents ?? 0;
            const isDefault = plan.id === defaultId;
            const limit = plan.memorialLimit;
            return (
              <article
                key={plan.id}
                className={`flex flex-col rounded-2xl border bg-surface-container/40 p-5 transition ${
                  plan.active ? "border-tertiary/20" : "border-outline-variant/20 opacity-70"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-on-surface">{plan.name || "Sem nome"}</h3>
                      {isDefault && (
                        <span className="rounded-full bg-tertiary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-tertiary">
                          Padrão
                        </span>
                      )}
                      {!plan.active && (
                        <span className="rounded-full bg-outline-variant/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-on-surface-variant">
                          Inativo
                        </span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{plan.description}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-tertiary">{centsToBRL(priceCents)}</span>
                  <span className="text-xs text-on-surface-variant">/{cycleLabel(plan.cycle)}</span>
                </div>

                <div className="mb-4 space-y-1.5 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-tertiary">photo_album</span>
                    {limit == null ? (
                      <span>Memoriais <strong className="text-on-surface">ilimitados</strong>/mês</span>
                    ) : (
                      <span><strong className="text-on-surface">{limit}</strong> memoriais/mês</span>
                    )}
                  </div>
                  {limit != null && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-tertiary">add_card</span>
                      <span>Excedente: <strong className="text-on-surface">{centsToBRL(plan.extraMemorialPriceCents ?? 0)}</strong> cada</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex flex-wrap gap-2 border-t border-outline-variant/20 pt-3">
                  <button
                    onClick={() => openEdit(plan)}
                    className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs font-medium text-on-surface transition hover:border-tertiary/50 hover:text-tertiary"
                  >
                    Editar
                  </button>
                  {!isDefault && (
                    <button
                      onClick={() => setAsDefault(plan.id)}
                      className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs font-medium text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary"
                    >
                      Tornar padrão
                    </button>
                  )}
                  <button
                    onClick={() => removePlan(plan)}
                    disabled={deletingId === plan.id}
                    className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deletingId === plan.id ? "..." : "Excluir"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Subcomponentes auxiliares ────────────────────────────────────────────────

const inputCls =
  "rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none";

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-xs uppercase tracking-wide text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, valueClass = "text-on-surface" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-on-surface-variant">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
