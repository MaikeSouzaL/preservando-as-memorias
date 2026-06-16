"use client";

import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FuneralSettingsPanel } from "@/src/components/admin/funeral-settings-panel";
import { QrDeliveryPanel } from "@/src/components/admin/qr-delivery-panel";
import { ConvitesPageClient } from "@/src/components/admin/convites-page-client";
import { centsToBRL, cycleLabel, type PlatformConfig, type QrDeliveryMode } from "@/src/lib/platform-types";
import { type FuneralHomeOfferLink } from "@/src/lib/platform-data";

type Tab = "cadastros" | "planos" | "ofertas" | "convites" | "qrcodes";

// ─── Error Boundary ───────────────────────────────────────────────────────────

class TabErrorBoundary extends Component<
  { children: ReactNode; tabName: string },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode; tabName: string }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 py-12 text-center">
          <span className="material-symbols-outlined text-4xl text-red-400">error</span>
          <div>
            <p className="font-semibold text-red-300">Erro ao carregar: {this.props.tabName}</p>
            <p className="mt-1 max-w-sm text-sm text-red-400/70">{this.state.error}</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: "" })}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  adminCommissionPercent: number;
  activePlanId: string | null;
  planRenewsAt: string | null;
  memorialCountMonth: number;
  createdAt: string;
};

type FuneralPlanSummary = {
  id: string;
  name: string;
  priceCents: number;
  memorialLimit: number | null;
};

// ─── Tab info banner ──────────────────────────────────────────────────────────

function TabInfo({ icon, title, description, tip }: { icon: string; title: string; description: string; tip?: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-outline-variant/20 bg-surface-variant/20 px-5 py-4">
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-xl text-tertiary">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
        {tip && (
          <p className="mt-1 text-xs text-tertiary/70">💡 {tip}</p>
        )}
      </div>
    </div>
  );
}

// ─── Aba Cadastros ────────────────────────────────────────────────────────────

function CadastrosTab() {
  const [homes, setHomes] = useState<FuneralHome[]>([]);
  const [funeralPlans, setFuneralPlans] = useState<FuneralPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [commissionEditing, setCommissionEditing] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState<Record<string, string>>({});
  const [planEditing, setPlanEditing] = useState<string | null>(null);
  const [planRenewsAt, setPlanRenewsAt] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/funeral-homes");
    if (res.ok) {
      const data = await res.json();
      setHomes(data.funeralHomes ?? []);
      setFuneralPlans(data.funeralPlans ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      await load();
    };
    init();
  }, [load]);

  async function act(id: string, action: "approve" | "reject") {
    setActing(id);
    await fetch(`/api/admin/funeral-homes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(true);
    await load();
    setActing(null);
  }

  async function savePlan(id: string, planId: string | null) {
    setActing(id);
    const renewsAt = planId ? (planRenewsAt[id] || null) : null;
    await fetch(`/api/admin/funeral-homes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_plan", planId, planRenewsAt: renewsAt }),
    });
    setPlanEditing(null);
    setLoading(true);
    await load();
    setActing(null);
  }

  async function saveCommission(id: string) {
    const val = Number(commissionValue[id]);
    if (isNaN(val) || val < 0 || val > 100) return;
    setActing(id);
    await fetch(`/api/admin/funeral-homes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_commission", adminCommissionPercent: val }),
    });
    setCommissionEditing(null);
    setLoading(true);
    await load();
    setActing(null);
  }

  const pending = homes.filter((h) => h.approvalStatus === "pending");
  const active = homes.filter((h) => h.approvalStatus === "approved");
  const rejected = homes.filter((h) => h.approvalStatus === "rejected");

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="space-y-8">
      <TabInfo
        icon="store"
        title="Gerenciamento de funerárias parceiras"
        description="Aqui ficam todas as funerárias cadastradas na plataforma. Aprove ou rejeite novos cadastros, defina a comissão (%) que você cobra de cada uma e atribua um plano de assinatura mensal. Funerárias aprovadas podem criar memoriais diretamente pelo painel delas."
        tip="A comissão configurada aqui determina o percentual retido de cada memorial pago criado por esta funerária."
      />
      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Pendentes" value={pending.length} color="yellow" />
        <Metric label="Ativas" value={active.length} color="green" />
        <Metric label="Rejeitadas" value={rejected.length} color="red" />
      </div>

      {/* Pendentes */}
      {pending.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-yellow-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            Aguardando aprovação ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((fh) => (
              <FuneralCard key={fh.id} fh={fh} acting={acting} onAct={act} showActions />
            ))}
          </div>
        </section>
      )}

      {/* Ativas */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-400">
          Funerárias ativas ({active.length})
        </h3>
        {active.length === 0 ? (
          <p className="text-sm text-on-surface-variant">Nenhuma funerária aprovada ainda.</p>
        ) : (
          <div className="space-y-3">
            {active.map((fh) => (
              <FuneralCard
                key={fh.id}
                fh={fh}
                acting={acting}
                onAct={act}
                showReject
                commissionEditing={commissionEditing}
                commissionValue={commissionValue[fh.id] ?? String(fh.adminCommissionPercent)}
                onCommissionEdit={(id) => {
                  setCommissionEditing(id);
                  setCommissionValue((p) => ({ ...p, [id]: String(fh.adminCommissionPercent) }));
                }}
                onCommissionChange={(id, val) => setCommissionValue((p) => ({ ...p, [id]: val }))}
                onCommissionSave={saveCommission}
                onCommissionCancel={() => setCommissionEditing(null)}
                funeralPlans={funeralPlans}
                planEditing={planEditing}
                planRenewsAtValue={planRenewsAt[fh.id] ?? ""}
                onPlanEdit={(id) => setPlanEditing(id)}
                onPlanRenewsAtChange={(id, val) => setPlanRenewsAt((p) => ({ ...p, [id]: val }))}
                onPlanSave={savePlan}
                onPlanCancel={() => setPlanEditing(null)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Rejeitadas */}
      {rejected.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
            Rejeitadas ({rejected.length})
          </h3>
          <div className="space-y-3">
            {rejected.map((fh) => (
              <FuneralCard key={fh.id} fh={fh} acting={acting} onAct={act} showApprove />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: "yellow" | "green" | "red" }) {
  const colors = {
    yellow: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    green: "border-green-500/20 bg-green-500/5 text-green-400",
    red: "border-red-500/20 bg-red-500/5 text-red-400",
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-xs uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function FuneralCard({
  fh, acting, onAct, showActions, showReject, showApprove,
  commissionEditing, commissionValue, onCommissionEdit, onCommissionChange, onCommissionSave, onCommissionCancel,
  funeralPlans, planEditing, planRenewsAtValue, onPlanEdit, onPlanRenewsAtChange, onPlanSave, onPlanCancel,
}: {
  fh: FuneralHome;
  acting: string | null;
  onAct: (id: string, action: "approve" | "reject") => void;
  showActions?: boolean;
  showReject?: boolean;
  showApprove?: boolean;
  commissionEditing?: string | null;
  commissionValue?: string;
  onCommissionEdit?: (id: string) => void;
  onCommissionChange?: (id: string, val: string) => void;
  onCommissionSave?: (id: string) => void;
  onCommissionCancel?: () => void;
  funeralPlans?: FuneralPlanSummary[];
  planEditing?: string | null;
  planRenewsAtValue?: string;
  onPlanEdit?: (id: string) => void;
  onPlanRenewsAtChange?: (id: string, val: string) => void;
  onPlanSave?: (id: string, planId: string | null) => void;
  onPlanCancel?: () => void;
}) {
  const isEditingCommission = commissionEditing === fh.id;
  const isEditingPlan = planEditing === fh.id;
  const activePlan = funeralPlans?.find((p) => p.id === fh.activePlanId);

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container/40 p-5 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-on-surface">{fh.name}</p>
          <p className="text-sm text-on-surface-variant">{fh.contactName} · {fh.email}</p>
          <p className="text-xs text-outline">
            {fh.phone}
            {fh.city ? ` · ${fh.city}${fh.state ? `/${fh.state}` : ""}` : ""}
            {fh.cnpj ? ` · ${fh.cnpj}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-outline">
            Cadastro: {new Date(fh.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {(showActions || showApprove) && (
            <button
              disabled={acting === fh.id}
              onClick={() => onAct(fh.id, "approve")}
              className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-500/20 disabled:opacity-50"
            >
              {acting === fh.id ? "..." : "Aprovar"}
            </button>
          )}
          {(showActions || showReject) && (
            <button
              disabled={acting === fh.id}
              onClick={() => onAct(fh.id, "reject")}
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
            >
              {acting === fh.id ? "..." : "Rejeitar"}
            </button>
          )}
        </div>
      </div>

      {/* Plano de assinatura — só para funerárias aprovadas */}
      {onPlanEdit && funeralPlans && (
        <div className="border-t border-outline-variant/20 pt-3">
          {isEditingPlan ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                  Plano:
                  <select
                    defaultValue={fh.activePlanId ?? ""}
                    id={`plan-select-${fh.id}`}
                    className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-1.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                  >
                    <option value="">Sem plano (avulso)</option>
                    {funeralPlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {centsToBRL(p.priceCents)}/mês
                        {p.memorialLimit !== null ? `, ${p.memorialLimit} memoriais` : ", ilimitado"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                  Renova em:
                  <input
                    type="date"
                    value={planRenewsAtValue}
                    onChange={(e) => onPlanRenewsAtChange?.(fh.id, e.target.value)}
                    className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-1.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={acting === fh.id}
                  onClick={() => {
                    const sel = document.getElementById(`plan-select-${fh.id}`) as HTMLSelectElement;
                    onPlanSave?.(fh.id, sel.value || null);
                  }}
                  className="rounded-lg bg-tertiary/20 px-3 py-1.5 text-xs font-semibold text-tertiary hover:bg-tertiary/30 disabled:opacity-50"
                >
                  {acting === fh.id ? "..." : "Salvar plano"}
                </button>
                <button
                  onClick={onPlanCancel}
                  className="rounded-lg px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                Plano:{" "}
                {activePlan ? (
                  <>
                    <span className="font-semibold text-tertiary">{activePlan.name}</span>
                    {fh.planRenewsAt && (
                      <span className="ml-1 text-outline">
                        · renova {new Date(fh.planRenewsAt).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span className="ml-2 rounded bg-tertiary/10 px-1.5 py-0.5 text-[0.6rem] font-bold text-tertiary uppercase tracking-wider">
                      {fh.memorialCountMonth ?? 0}
                      {activePlan.memorialLimit !== null ? `/${activePlan.memorialLimit}` : ""} memo
                    </span>
                  </>
                ) : (
                  <span className="text-outline">Sem plano (avulso)</span>
                )}
              </p>
              <button
                onClick={() => onPlanEdit(fh.id)}
                className="rounded-lg px-3 py-1 text-xs text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/60 transition"
              >
                {activePlan ? "Alterar" : "Atribuir plano"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comissão — só para funerárias aprovadas */}
      {onCommissionEdit && (
        <div className="border-t border-outline-variant/20 pt-3">
          {isEditingCommission ? (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                Minha comissão:
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={commissionValue ?? ""}
                    onChange={(e) => onCommissionChange?.(fh.id, e.target.value)}
                    className="w-20 rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-1.5 pr-6 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-outline">%</span>
                </div>
              </label>
              <button
                disabled={acting === fh.id}
                onClick={() => onCommissionSave?.(fh.id)}
                className="rounded-lg bg-tertiary/20 px-3 py-1.5 text-xs font-semibold text-tertiary hover:bg-tertiary/30 disabled:opacity-50"
              >
                {acting === fh.id ? "..." : "Salvar"}
              </button>
              <button
                onClick={onCommissionCancel}
                className="rounded-lg px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                Minha comissão desta funerária:{" "}
                <span className="font-semibold text-tertiary">{fh.adminCommissionPercent}%</span>
                <span className="ml-1 text-outline">
                  (funerária fica com {100 - fh.adminCommissionPercent}%)
                </span>
              </p>
              <button
                onClick={() => onCommissionEdit(fh.id)}
                className="rounded-lg px-3 py-1 text-xs text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/60 transition"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Aba Ofertas ──────────────────────────────────────────────────────────────

function OfertasTab() {
  const [offers, setOffers] = useState<FuneralHomeOfferLink[]>([]);
  const [funeralHomes, setFuneralHomes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", cycle: "one_time" as "monthly" | "annual" | "one_time",
    priceCents: 9900, funeralHomeId: "",
  });
  const [priceInput, setPriceInput] = useState("99,00");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/offer-links");
    if (res.ok) {
      const d = await res.json();
      setOffers(d.offerLinks ?? []);
      setFuneralHomes(d.funeralHomes ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      await load();
    };
    init();
  }, [load]);

  function handlePriceChange(val: string) {
    setPriceInput(val);
    const clean = val.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const parsed = parseFloat(clean);
    setFormData((p) => ({ ...p, priceCents: isNaN(parsed) ? 0 : Math.round(parsed * 100) }));
  }

  function handlePriceBlur() {
    setPriceInput((formData.priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/offer-links", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowForm(false);
      setFormData({ title: "", description: "", cycle: "one_time", priceCents: 9900, funeralHomeId: "" });
      setPriceInput("99,00");
      load();
    }
  }

  async function toggle(offer: FuneralHomeOfferLink) {
    await fetch("/api/admin/offer-links", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offer.id, status: offer.status === "active" ? "paused" : "active" }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta oferta?")) return;
    await fetch(`/api/admin/offer-links?id=${id}`, { method: "DELETE" });
    load();
  }

  async function copyLink(offer: FuneralHomeOfferLink) {
    await navigator.clipboard.writeText(`${window.location.origin}/oferta/${offer.slug}`).catch(() => {});
    setCopiedId(offer.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando ofertas...</p>;

  return (
    <div className="space-y-6">
      <TabInfo
        icon="link"
        title="Links de oferta para famílias"
        description="Cada funerária parceira pode ter links personalizados com preço próprio para oferecer memoriais às famílias enlutadas. A família acessa o link, paga o memorial e o sistema registra a conversão vinculada à funerária. Use para campanhas e parcerias com preço diferenciado."
        tip="Os endereços de entrega preenchidos pelas famílias ficam salvos em cada memorial — acesse em Memoriais para ver os dados de envio."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-tertiary/10 bg-surface-container/40 p-5">
          <p className="text-xs uppercase tracking-wider text-outline">Ativas</p>
          <p className="mt-1 text-3xl font-semibold text-on-surface">{offers.filter((o) => o.status === "active").length}</p>
        </article>
        <article className="rounded-xl border border-tertiary/10 bg-surface-container/40 p-5">
          <p className="text-xs uppercase tracking-wider text-outline">Total de acessos</p>
          <p className="mt-1 text-3xl font-semibold text-on-surface">{offers.reduce((s, o) => s + o.accessCount, 0)}</p>
        </article>
        <article className="rounded-xl border border-tertiary/10 bg-surface-container/40 p-5">
          <p className="text-xs uppercase tracking-wider text-tertiary">Conversões</p>
          <p className="mt-1 text-3xl font-semibold text-tertiary">{offers.reduce((s, o) => s + o.conversionCount, 0)}</p>
        </article>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-on-surface">Links de oferta</h3>
          <p className="text-sm text-on-surface-variant">Cada link tem preço próprio e pode ser vinculado a uma funerária específica.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-tertiary px-5 py-2.5 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088]"
        >
          {showForm ? "Cancelar" : "Nova oferta"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-outline-variant/30 bg-surface-container/40 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider text-outline">Funerária (opcional)</span>
              <select
                value={formData.funeralHomeId}
                onChange={(e) => {
                  const id = e.target.value;
                  const fh = funeralHomes.find((f) => f.id === id);
                  setFormData((p) => ({ ...p, funeralHomeId: id, title: fh ? fh.name : "" }));
                }}
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              >
                <option value="">Nenhuma (oferta geral)</option>
                {funeralHomes.map((fh) => <option key={fh.id} value={fh.id}>{fh.name}</option>)}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider text-outline">Título da oferta</span>
              <input
                type="text" required disabled={Boolean(formData.funeralHomeId)}
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder={formData.funeralHomeId ? "Nome da funerária (automático)" : "Ex: Memorial Completo"}
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none disabled:opacity-60"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider text-outline">Ciclo</span>
              <select
                value={formData.cycle}
                onChange={(e) => setFormData((p) => ({ ...p, cycle: e.target.value as "monthly" | "annual" | "one_time" }))}
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              >
                <option value="one_time">Pagamento único</option>
                <option value="monthly">Mensal</option>
                <option value="annual">Anual</option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider text-outline">Preço (R$)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-outline">R$</span>
                <input
                  type="text" required value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onBlur={handlePriceBlur}
                  className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 py-2.5 pl-9 pr-3 text-sm font-semibold text-on-surface focus:border-tertiary focus:outline-none"
                />
              </div>
              <span className="text-xs text-outline">{centsToBRL(formData.priceCents)}</span>
            </label>

            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-xs uppercase tracking-wider text-outline">Descrição (opcional)</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
              />
            </label>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-tertiary px-6 py-2.5 text-sm font-semibold text-[#1c1b1b] hover:bg-[#ffe088] transition">
            Criar oferta
          </button>
        </form>
      )}

      {offers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-12 text-center text-on-surface-variant">
          Nenhuma oferta criada ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container/40 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-semibold text-on-surface">{offer.title}</p>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${offer.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {offer.status === "active" ? "Ativa" : "Pausada"}
                  </span>
                </div>
                {offer.description && <p className="mb-2 text-sm text-on-surface-variant">{offer.description}</p>}
                <code className="mb-2 inline-block rounded border border-outline-variant/30 bg-surface-container-low/70 px-3 py-1 text-xs text-tertiary">
                  /oferta/{offer.slug}
                </code>
                <div className="flex flex-wrap gap-4 text-xs text-outline">
                  <span><strong className="text-on-surface">{centsToBRL(offer.priceCents)}</strong> · {cycleLabel(offer.cycle)}</span>
                  <span>{offer.accessCount} acessos · {offer.conversionCount} conversões</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button onClick={() => copyLink(offer)} className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface transition hover:bg-surface-variant">
                  {copiedId === offer.id ? "Copiado!" : "Copiar link"}
                </button>
                <button onClick={() => toggle(offer)} className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface transition hover:bg-surface-variant">
                  {offer.status === "active" ? "Pausar" : "Ativar"}
                </button>
                <button onClick={() => remove(offer.id)} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Aba Planos ───────────────────────────────────────────────────────────────

function PlanosTab() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/platform-config")
      .then((r) => r.json())
      .then((d) => setConfig(d.config ?? null))
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) return (
    <p className="py-10 text-center text-red-400 text-sm">
      Não foi possível carregar os planos. Recarregue a página.
    </p>
  );
  if (!config) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <TabInfo
        icon="subscriptions"
        title="Planos de assinatura para funerárias"
        description="Crie planos mensais com cota de memoriais. Uma funerária com plano ativo cria memoriais sem custo individual até atingir o limite mensal do plano — a partir daí, cobra-se o valor de excedente configurado. Funerárias sem plano pagam o preço avulso definido em Comercial."
        tip="Atribua o plano a cada funerária na aba Cadastros. O contador de memoriais reseta automaticamente todo mês."
      />
      <FuneralSettingsPanel initialConfig={config} />
    </div>
  );
}

// ─── Aba QR Codes ─────────────────────────────────────────────────────────────

function QrCodesTab() {
  const [config, setConfig] = useState<{ qrDeliveryMode?: QrDeliveryMode; funeralHomeQrDeliveryMode?: QrDeliveryMode } | null>(null);

  useEffect(() => {
    fetch("/api/platform-config")
      .then((r) => r.json())
      .then((d) => setConfig({
        qrDeliveryMode: d.config?.qrDeliveryMode ?? "self",
        funeralHomeQrDeliveryMode: d.config?.funeralHomeQrDeliveryMode ?? "self",
      }))
      .catch(() => setConfig({ qrDeliveryMode: "self", funeralHomeQrDeliveryMode: "self" }));
  }, []);

  if (!config) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <TabInfo
        icon="local_shipping"
        title="Configuração de entrega do QR Code físico"
        description="Define quem é responsável por imprimir e entregar o QR Code físico após o pagamento. Você pode configurar separadamente para famílias e funerárias. Quando você é o responsável (modo 'Eu envio'), o endereço de entrega é coletado durante o cadastro do memorial e fica salvo no registro — acesse em Memoriais para ver os dados de envio de cada pedido."
        tip="Os endereços ficam visíveis na página Memoriais → coluna de ações de cada memorial, com ícone de localização."
      />
      <QrDeliveryPanel
        initialMode={config.qrDeliveryMode}
        initialFuneralHomeMode={config.funeralHomeQrDeliveryMode}
      />
    </div>
  );
}

// ─── Aba Convites ─────────────────────────────────────────────────────────────

function ConvitesTab() {
  return (
    <div className="flex flex-col gap-6">
      <TabInfo
        icon="handshake"
        title="Links de convite para funerárias"
        description="Crie links personalizados para convidar funerárias a se cadastrar na plataforma com condições comerciais pré-configuradas: comissão %, plano de assinatura e data de renovação. Ao clicar no link, a funerária vê os termos e se registra automaticamente com esses valores aplicados."
        tip="Use um convite diferente para cada funerária ou parceria — assim você rastreia quem veio por qual canal e com quais condições."
      />
      <ConvitesPageClient />
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "cadastros", label: "Cadastros", icon: "store" },
  { id: "planos", label: "Planos de assinatura", icon: "subscriptions" },
  { id: "ofertas", label: "Ofertas (links)", icon: "sell" },
  { id: "convites", label: "Convites", icon: "handshake" },
  { id: "qrcodes", label: "Entrega de QR Code", icon: "qr_code_2" },
];

export function FunerariasPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab") as Tab | null;
  const tab: Tab = rawTab && ["cadastros", "planos", "ofertas", "convites", "qrcodes"].includes(rawTab) ? rawTab : "cadastros";

  function setTab(id: Tab) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin do sistema</p>
        <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Funerárias</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Gerencie cadastros, configure os planos de assinatura e crie ofertas com preços personalizados por funerária.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container/40 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "border border-tertiary/20 bg-tertiary/10 text-tertiary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das tabs — cada uma isolada por ErrorBoundary */}
      {tab === "cadastros" && (
        <TabErrorBoundary tabName="Cadastros">
          <CadastrosTab />
        </TabErrorBoundary>
      )}
      {tab === "planos" && (
        <TabErrorBoundary tabName="Planos de assinatura">
          <PlanosTab />
        </TabErrorBoundary>
      )}
      {tab === "ofertas" && (
        <TabErrorBoundary tabName="Ofertas (links)">
          <OfertasTab />
        </TabErrorBoundary>
      )}
      {tab === "convites" && (
        <TabErrorBoundary tabName="Convites">
          <ConvitesTab />
        </TabErrorBoundary>
      )}
      {tab === "qrcodes" && (
        <TabErrorBoundary tabName="Entrega de QR Code">
          <QrCodesTab />
        </TabErrorBoundary>
      )}
    </div>
  );
}
