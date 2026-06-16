"use client";

import React, { useMemo, useState } from "react";
import { centsToBRL, cycleLabel, type FuneralPlan, type PlatformConfig } from "@/src/lib/platform-types";

const MODULE_LABELS: Record<string, string> = {
  memorials: "Memoriais + QR Code",
  schedules: "Agenda de cerimônias",
  services: "Gestão de atendimentos",
  documents: "Documentos digitais",
  inventory: "Controle de estoque",
  staff: "Gestão de equipe",
};

type Props = { initialConfig: PlatformConfig };

type NewPlan = {
  name: string;
  description: string;
  price: string;
  cycle: "monthly" | "annual" | "one_time";
  memorialLimit: number | null;
  extraMemorialPrice: string;
};

function NewPlanFields({ newPlan, setNewPlan }: { newPlan: NewPlan; setNewPlan: React.Dispatch<React.SetStateAction<NewPlan>> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Nome do plano</span>
        <input required value={newPlan.name} onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Recorrência</span>
        <select value={newPlan.cycle} onChange={(e) => setNewPlan((p) => ({ ...p, cycle: e.target.value as NewPlan["cycle"] }))}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none">
          <option value="monthly">Mensal</option>
          <option value="annual">Anual</option>
          <option value="one_time">Pagamento único</option>
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Preço (R$)</span>
        <input type="text" required value={newPlan.price}
          onChange={(e) => setNewPlan((p) => ({ ...p, price: e.target.value }))}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Descrição</span>
        <input value={newPlan.description} onChange={(e) => setNewPlan((p) => ({ ...p, description: e.target.value }))}
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none" />
      </label>
      <div className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Memoriais por mês</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            value={newPlan.memorialLimit ?? ""}
            disabled={newPlan.memorialLimit === null}
            onChange={(e) => setNewPlan((p) => ({ ...p, memorialLimit: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
            placeholder="Ex: 10"
            className="w-28 rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none disabled:opacity-40"
          />
          <label className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={newPlan.memorialLimit === null}
              onChange={(e) => setNewPlan((p) => ({ ...p, memorialLimit: e.target.checked ? null : 10 }))}
              className="h-4 w-4 accent-tertiary"
            />
            Ilimitado
          </label>
        </div>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-wide text-on-surface-variant">Preço excedente (R$ por memorial)</span>
        <input type="text" value={newPlan.extraMemorialPrice}
          disabled={newPlan.memorialLimit === null}
          onChange={(e) => setNewPlan((p) => ({ ...p, extraMemorialPrice: e.target.value }))}
          placeholder="0,00"
          className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none disabled:opacity-40"
        />
      </label>
    </div>
  );
}

function MemorialQuotaFields({ initialLimit, initialExtraPrice }: { initialLimit: number | null; initialExtraPrice: number }) {
  const [isUnlimited, setIsUnlimited] = useState(initialLimit === null);
  const [limit, setLimit] = useState(initialLimit ?? 10);

  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface-container/20 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-surface-variant">Cotas de memoriais</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <span className="text-xs text-on-surface-variant">Memoriais incluídos por mês</span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="memorialLimit"
              min={1}
              value={isUnlimited ? "" : limit}
              disabled={isUnlimited}
              onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-28 rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none disabled:opacity-40"
            />
            <label className="flex items-center gap-1.5 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                name="memorialLimitUnlimited"
                checked={isUnlimited}
                onChange={(e) => setIsUnlimited(e.target.checked)}
                className="h-4 w-4 accent-tertiary"
              />
              Ilimitado
            </label>
          </div>
        </div>
        <label className="grid gap-1.5">
          <span className="text-xs text-on-surface-variant">Preço por memorial excedente (R$)</span>
          <input
            type="number"
            name="extraMemorialPrice"
            min={0}
            step={0.01}
            defaultValue={initialExtraPrice.toFixed(2)}
            disabled={isUnlimited}
            className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none disabled:opacity-40"
          />
        </label>
      </div>
      {!isUnlimited && (
        <p className="mt-2 text-xs text-on-surface-variant/60">
          A funerária pode criar até {limit} memorials/mês. Acima disso, será cobrado o preço excedente por memorial adicional.
        </p>
      )}
    </div>
  );
}

const DEFAULT_NEW_PLAN = {
  name: "",
  description: "",
  price: "0,00",
  cycle: "monthly" as "monthly" | "annual" | "one_time",
  memorialLimit: 10 as number | null,
  extraMemorialPrice: "49,00",
};

export function FuneralSettingsPanel({ initialConfig }: Props) {
  const [config, setConfig] = useState(initialConfig);
  const [selectedPlanId, setSelectedPlanId] = useState(initialConfig.defaultFuneralPlanId);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlan, setNewPlan] = useState(DEFAULT_NEW_PLAN);
  const [creating, setCreating] = useState(false);

  const funeralPlans = useMemo(
    () => (Array.isArray(config.funeralPlans) ? config.funeralPlans : []).filter((p): p is FuneralPlan => !!p && typeof p === "object" && "id" in p),
    [config.funeralPlans]
  );
  const selectedPlan = useMemo(
    () => funeralPlans.find((p) => p.id === selectedPlanId) ?? funeralPlans[0],
    [funeralPlans, selectedPlanId]
  );

  const priceCents = selectedPlan?.priceCents ? Number(selectedPlan.priceCents) : 0;
  const commission = selectedPlan ? Math.round((priceCents * (config.ownerCommissionPercent ?? 15)) / 100) : 0;
  const operatorRevenue = selectedPlan ? priceCents - commission : 0;

  async function createPlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const clean = newPlan.price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const priceCents = Math.round((parseFloat(clean) || 0) * 100);
    const extraClean = newPlan.extraMemorialPrice.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const newId = crypto.randomUUID();
    const res = await fetch("/api/platform-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: "funeral",
        planId: newId,
        name: newPlan.name,
        description: newPlan.description,
        price: priceCents / 100,
        cycle: newPlan.cycle,
        active: true,
        memorialLimit: newPlan.memorialLimit,
        extraMemorialPriceCents: parseFloat(extraClean) || 0,
      }),
    });
    const payload = await res.json();
    setCreating(false);
    if (!res.ok) {
      setMessage(payload.error ?? "Não foi possível criar o plano.");
      return;
    }
    setConfig(payload.config);
    setSelectedPlanId(newId);
    setShowCreate(false);
    setNewPlan(DEFAULT_NEW_PLAN);
    setMessage("Plano criado com sucesso.");
  }

  async function savePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const isUnlimited = fd.get("memorialLimitUnlimited") === "on";
    const memorialLimit = isUnlimited ? null : Math.max(0, parseInt(String(fd.get("memorialLimit") ?? "0"), 10));
    const extraRaw = String(fd.get("extraMemorialPrice") ?? "0").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const extraMemorialPriceCents = parseFloat(extraRaw) || 0;

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
        memorialLimit,
        extraMemorialPriceCents,
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
      <div className="space-y-4">
        {message && (
          <p className={`rounded-lg px-3 py-2 text-sm ${
            message.includes("sucesso")
              ? "border border-green-500/20 bg-green-500/10 text-green-300"
              : "border border-red-400/20 bg-red-500/10 text-red-300"
          }`}>
            {message}
          </p>
        )}
        {showCreate ? (
          <form onSubmit={createPlan} className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 space-y-4">
            <h3 className="text-lg font-medium text-on-surface">Criar primeiro plano</h3>
            <NewPlanFields newPlan={newPlan} setNewPlan={setNewPlan} />
            <div className="flex gap-3">
              <button type="submit" disabled={creating}
                className="rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50">
                {creating ? "Criando..." : "Criar plano"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="rounded-full border border-outline-variant/40 px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface transition">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-dashed border-outline-variant/40 bg-[#0a192f66] p-8 text-center">
            <p className="mb-4 text-sm text-on-surface-variant">Nenhum plano de funerária configurado.</p>
            <button onClick={() => setShowCreate(true)}
              className="rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088]">
              Criar primeiro plano
            </button>
          </div>
        )}
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
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {funeralPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => { setShowCreate(false); setSelectedPlanId(plan.id); }}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                plan.id === selectedPlanId && !showCreate
                  ? "border-tertiary bg-tertiary/10 text-tertiary"
                  : "border-outline-variant/40 text-on-surface-variant hover:border-tertiary/50"
              }`}
            >
              {plan.name}
              {!plan.active && <span className="ml-1.5 text-xs opacity-60">(inativo)</span>}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              showCreate
                ? "border-tertiary bg-tertiary/10 text-tertiary"
                : "border-dashed border-outline-variant/40 text-on-surface-variant hover:border-tertiary/50"
            }`}
          >
            + Adicionar plano
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createPlan} className="mb-6 rounded-xl border border-tertiary/20 bg-[#0a192f99] p-5 space-y-4">
            <p className="text-sm font-medium text-on-surface">Novo plano</p>
            <NewPlanFields newPlan={newPlan} setNewPlan={setNewPlan} />
            <div className="flex gap-3">
              <button type="submit" disabled={creating}
                className="rounded-full bg-tertiary px-5 py-2 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50">
                {creating ? "Criando..." : "Criar plano"}
              </button>
              <button type="button" onClick={() => { setShowCreate(false); setNewPlan(DEFAULT_NEW_PLAN); }}
                className="rounded-full border border-outline-variant/40 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition">
                Cancelar
              </button>
            </div>
          </form>
        )}

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
              defaultValue={(priceCents / 100).toFixed(2)}
              key={`price-${selectedPlan.id}`}
              required
              className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface focus:border-tertiary focus:outline-none"
            />
          </label>

          {/* Memorial quota */}
          <MemorialQuotaFields
            key={`quota-${selectedPlan.id}`}
            initialLimit={selectedPlan.memorialLimit ?? null}
            initialExtraPrice={(selectedPlan.extraMemorialPriceCents ?? 0) / 100}
          />

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
              <p className="text-2xl font-bold text-tertiary">{centsToBRL(priceCents)}</p>
              <p className="text-xs text-on-surface-variant">/{cycleLabel(selectedPlan.cycle)}</p>
            </div>
          </div>

          <p className="mb-4 text-sm text-on-surface-variant">{selectedPlan.description}</p>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-tertiary/20 bg-tertiary/5 px-3 py-2.5">
            <span className="material-symbols-outlined text-base text-tertiary">photo_album</span>
            <div className="text-sm">
              {selectedPlan.memorialLimit == null ? (
                <span className="font-medium text-tertiary">Memoriais ilimitados / mês</span>
              ) : (
                <>
                  <span className="font-medium text-tertiary">{selectedPlan.memorialLimit} memoriais / mês</span>
                  {(selectedPlan.extraMemorialPriceCents ?? 0) > 0 && (
                    <span className="ml-2 text-xs text-on-surface-variant">
                      + {centsToBRL(selectedPlan.extraMemorialPriceCents ?? 0)} cada excedente
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <ul className="space-y-1.5">
            {(Array.isArray(selectedPlan.features) ? selectedPlan.features : []).map((f) => (
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
              <span className="text-on-surface">{centsToBRL(priceCents)}</span>
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
