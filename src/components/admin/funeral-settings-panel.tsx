"use client";

import { useMemo, useState } from "react";
import { centsToBRL, cycleLabel, type PlatformConfig, type FuneralPlan } from "@/src/lib/platform-types";

const MODULE_LABELS: Record<string, string> = {
  memorials: "Memoriais + QR Code",
  schedules: "Agenda de cerimônias",
  services: "Gestão de atendimentos",
  documents: "Documentos digitais",
  inventory: "Controle de estoque",
  staff: "Gestão de equipe",
};

type Props = { initialConfig: PlatformConfig };

export function FuneralSettingsPanel({ initialConfig }: Props) {
  const [config, setConfig] = useState(initialConfig);
  const [selectedPlanId, setSelectedPlanId] = useState(initialConfig.defaultFuneralPlanId);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const funeralPlans = config.funeralPlans ?? [];
  const selectedPlan = useMemo(
    () => funeralPlans.find((p) => p.id === selectedPlanId) ?? funeralPlans[0],
    [funeralPlans, selectedPlanId]
  );

  const commission = selectedPlan ? Math.round((selectedPlan.priceCents * config.ownerCommissionPercent) / 100) : 0;
  const operatorRevenue = selectedPlan ? selectedPlan.priceCents - commission : 0;

  async function savePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/platform-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: "funeral",
        planId: selectedPlan.id,
        defaultFuneralPlanId: String(fd.get("defaultFuneralPlanId")),
        name: String(fd.get("name")),
        description: String(fd.get("description")),
        price: Number(fd.get("price")),
        cycle: String(fd.get("cycle")),
        active: fd.get("active") === "on",
      }),
    });

    const payload = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage(payload.error ?? "Não foi possível salvar.");
      return;
    }

    setConfig(payload.config);
    setMessage("Plano salvo com sucesso.");
  }

  if (!selectedPlan) {
    return (
      <div className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 text-on-surface-variant text-sm">
        Nenhum plano de funerária configurado.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Editor */}
      <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
        <div className="mb-6">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Planos cobrados das funerárias</p>
          <h3 className="mt-1 text-xl font-medium text-on-surface">Assinaturas de funerária</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            Selecione um plano e edite o valor e os recursos oferecidos.
          </p>
        </div>

        {/* Plan tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {funeralPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                plan.id === selectedPlanId
                  ? "border-tertiary bg-tertiary/10 text-tertiary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-tertiary/50"
              }`}
            >
              {plan.name}
              {!plan.active && <span className="ml-1.5 text-xs opacity-60">(inativo)</span>}
            </button>
          ))}
        </div>

        <form onSubmit={savePlan} className="grid gap-4">
          <input type="hidden" name="defaultFuneralPlanId" value={config.defaultFuneralPlanId} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wide text-on-surface-variant">Nome do plano</span>
              <input
                name="name"
                defaultValue={selectedPlan.name}
                key={`name-${selectedPlan.id}`}
                required
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wide text-on-surface-variant">Recorrência</span>
              <select
                name="cycle"
                defaultValue={selectedPlan.cycle}
                key={`cycle-${selectedPlan.id}`}
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              >
                <option value="monthly">Mensal</option>
                <option value="annual">Anual</option>
                <option value="one_time">Pagamento único</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs uppercase tracking-wide text-on-surface-variant">Descrição</span>
            <textarea
              name="description"
              defaultValue={selectedPlan.description}
              key={`desc-${selectedPlan.id}`}
              rows={2}
              className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs uppercase tracking-wide text-on-surface-variant">Preço (R$)</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={(selectedPlan.priceCents / 100).toFixed(2)}
              key={`price-${selectedPlan.id}`}
              required
              className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none"
            />
          </label>

          {/* Modules (read-only display) */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-on-surface-variant">Módulos incluídos</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedPlan.modules || {}).map(([key, enabled]) => (
                <span
                  key={key}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    enabled
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-outline-variant/20 text-on-surface-variant/40"
                  }`}
                >
                  {enabled ? "✓" : "✗"} {MODULE_LABELS[key] ?? key}
                </span>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              defaultChecked={selectedPlan.active}
              key={`active-${selectedPlan.id}`}
              className="h-4 w-4 rounded border-outline-variant/40 accent-tertiary"
            />
            <span className="text-sm text-on-surface-variant">Plano ativo (visível para funerárias)</span>
          </label>

          {message && (
            <p className={`rounded-lg px-3 py-2 text-sm ${
              message.includes("sucesso")
                ? "border border-green-500/20 bg-green-500/10 text-green-300"
                : "border border-red-400/20 bg-red-500/10 text-red-300"
            }`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar plano"}
          </button>
        </form>
      </section>

      {/* Preview */}
      <aside className="space-y-4">
        <div className="rounded-xl border border-tertiary/20 bg-surface-container/60 p-5">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Prévia do plano</p>

          <div className="mb-4 flex items-baseline justify-between">
            <p className="text-lg font-semibold text-on-surface">{selectedPlan.name}</p>
            <div className="text-right">
              <p className="text-2xl font-bold text-tertiary">{centsToBRL(selectedPlan.priceCents)}</p>
              <p className="text-xs text-on-surface-variant">/{cycleLabel(selectedPlan.cycle)}</p>
            </div>
          </div>

          <p className="mb-4 text-sm text-on-surface-variant">{selectedPlan.description}</p>

          <ul className="space-y-1.5">
            {(selectedPlan.features || []).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base text-tertiary">check_circle</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container/40 p-5">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-on-surface-variant">Distribuição da receita</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Valor da assinatura</span>
              <span className="text-on-surface">{centsToBRL(selectedPlan.priceCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Taxa do sistema ({config.ownerCommissionPercent}%)</span>
              <span className="text-[#e9c349]">− {centsToBRL(commission)}</span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/30 pt-2">
              <span className="font-medium text-on-surface">Seu repasse ({100 - config.ownerCommissionPercent}%)</span>
              <span className="font-semibold text-on-surface">{centsToBRL(operatorRevenue)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
