"use client";

import { useMemo, useState } from "react";
import { centsToBRL, cycleLabel, type PlatformConfig, type PlatformPlan } from "@/src/lib/platform-types";

type CommercialSettingsPanelProps = {
  initialConfig: PlatformConfig;
};

export function CommercialSettingsPanel({ initialConfig }: CommercialSettingsPanelProps) {
  const [config, setConfig] = useState(initialConfig);
  const [selectedPlanId, setSelectedPlanId] = useState(initialConfig.defaultPlanId);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedPlan = useMemo(
    () => config.plans.find((plan) => plan.id === selectedPlanId) ?? config.plans[0],
    [config.plans, selectedPlanId]
  );

  const projectedCommission = Math.round((selectedPlan.priceCents * config.ownerCommissionPercent) / 100);
  const operatorRevenue = selectedPlan.priceCents - projectedCommission;

  async function savePlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/platform-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: selectedPlan.id,
        defaultPlanId: String(formData.get("defaultPlanId")),
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        cycle: String(formData.get("cycle")),
        active: formData.get("active") === "on",
      }),
    });

    const payload = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Não foi possível salvar.");
      return;
    }

    setConfig(payload.config);
    setMessage("Configuração comercial salva.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
        <div className="mb-6">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Planos cobrados do cliente</p>
          <h2 className="mt-2 font-h3 text-2xl text-on-surface">Modelo de cobrança</h2>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {config.plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`rounded-full border px-4 py-2 text-sm ${
                selectedPlanId === plan.id
                  ? "border-tertiary bg-tertiary/10 text-tertiary"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        <PlanForm
          key={selectedPlan.id}
          plan={selectedPlan}
          plans={config.plans}
          defaultPlanId={config.defaultPlanId}
          saving={saving}
          onSubmit={savePlan}
        />

        {message ? <p className="mt-4 rounded-lg border border-tertiary/20 bg-tertiary/10 p-3 text-sm text-tertiary">{message}</p> : null}
      </section>

      <aside className="space-y-6">
        <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-outline">Comissão do sistema fixa</p>
          <h2 className="mt-2 font-h2 text-5xl text-tertiary">{config.ownerCommissionPercent}%</h2>
          <p className="mt-3 text-sm text-on-surface-variant">
            Essa porcentagem é calculada em cima de cada pagamento confirmado, independente do valor definido pelo administrador do sistema.
          </p>
        </section>

        <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-outline">Simulação do plano</p>
          <h3 className="mt-2 font-h3 text-xl text-on-surface">{selectedPlan.name}</h3>
          <div className="mt-5 space-y-3 text-sm">
            <Line label="Preço cobrado" value={centsToBRL(selectedPlan.priceCents)} />
            <Line label="Comissão do sistema" value={centsToBRL(projectedCommission)} strong />
            <Line label="Seu valor líquido" value={centsToBRL(operatorRevenue)} />
            <Line label="Recorrência" value={cycleLabel(selectedPlan.cycle)} />
          </div>
        </section>
      </aside>
    </div>
  );
}

function PlanForm({
  plan,
  plans,
  defaultPlanId,
  saving,
  onSubmit,
}: {
  plan: PlatformPlan;
  plans: PlatformPlan[];
  defaultPlanId: string;
  saving: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Nome</span>
        <input name="name" defaultValue={plan.name} className="input-line" />
      </label>

      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Descrição</span>
        <textarea
          name="description"
          defaultValue={plan.description}
          rows={3}
          className="rounded-lg border border-outline-variant bg-transparent p-3 text-on-surface outline-none focus:border-tertiary"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Valor</span>
          <input name="price" type="number" min="0" step="0.01" defaultValue={(plan.priceCents / 100).toFixed(2)} className="input-line" />
        </label>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Cobrança</span>
          <select name="cycle" defaultValue={plan.cycle} className="rounded-lg border border-outline-variant bg-[#0a192f] p-3 text-on-surface">
            <option value="monthly">Mensal</option>
            <option value="annual">Anual</option>
            <option value="one_time">Única</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Plano padrão</span>
          <select name="defaultPlanId" defaultValue={defaultPlanId} className="rounded-lg border border-outline-variant bg-[#0a192f] p-3 text-on-surface">
            {plans.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-on-surface-variant">
        <input name="active" type="checkbox" defaultChecked={plan.active} className="accent-tertiary" />
        Plano ativo para novos clientes
      </label>

      <button type="submit" disabled={saving} className="w-fit rounded-full bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary disabled:opacity-60">
        {saving ? "Salvando..." : "Salvar configuração"}
      </button>
    </form>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 pb-2 last:border-b-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className={strong ? "font-semibold text-tertiary" : "text-on-surface"}>{value}</span>
    </div>
  );
}
