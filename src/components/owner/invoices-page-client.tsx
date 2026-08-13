"use client";

import { useCallback, useEffect, useState } from "react";
import { centsToBRL } from "@/src/lib/platform-types";

type Invoice = {
  id: string;
  funeralHomeId: string;
  funeralHomeName: string;
  periodStart: string;
  periodEnd: string;
  billingMode: "monthly" | "per_qr";
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

type FuneralHomeOption = { id: string; name: string; approvalStatus: string };

const STATUS_LABEL: Record<Invoice["status"], string> = {
  open: "Em aberto",
  sent: "Enviada",
  paid: "Paga",
  overdue: "Vencida",
  cancelled: "Cancelada",
};

const STATUS_TONE: Record<Invoice["status"], string> = {
  open: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  sent: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  overdue: "border-red-500/20 bg-red-500/10 text-red-400",
  cancelled: "border-outline-variant/30 bg-surface-variant text-on-surface-variant",
};

function firstDayOfMonth(offsetMonths = 0) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offsetMonths);
  return d.toISOString().slice(0, 10);
}

function lastDayOfMonth(offsetMonths = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offsetMonths + 1, 0);
  return d.toISOString().slice(0, 10);
}

export function InvoicesPageClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [homes, setHomes] = useState<FuneralHomeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Invoice["status"]>("all");

  const [form, setForm] = useState({
    funeralHomeId: "",
    periodStart: firstDayOfMonth(-1),
    periodEnd: lastDayOfMonth(-1),
    dueDate: "",
  });

  const load = useCallback(async () => {
    try {
      const [invRes, homesRes] = await Promise.all([fetch("/api/owner/invoices"), fetch("/api/admin/funeral-homes")]);
      const invData = await invRes.json();
      const homesData = await homesRes.json();
      if (!invRes.ok) throw new Error(invData.error ?? "Erro ao carregar faturas.");
      setInvoices(invData.invoices ?? []);
      setHomes((homesData.funeralHomes ?? []).filter((h: FuneralHomeOption) => h.approvalStatus === "approved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar faturas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.funeralHomeId) {
      setError("Selecione uma funerária.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/owner/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funeralHomeId: form.funeralHomeId,
          periodStart: form.periodStart,
          periodEnd: form.periodEnd,
          dueDate: form.dueDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao gerar fatura.");
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar fatura.");
    } finally {
      setGenerating(false);
    }
  }

  async function setStatus(id: string, status: Invoice["status"]) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/owner/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao atualizar fatura.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar fatura.");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = statusFilter === "all" ? invoices : invoices.filter((i) => i.status === statusFilter);
  const openTotalCents = invoices.filter((i) => i.status === "open" || i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.totalCents, 0);
  const paidTotalCents = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalCents, 0);

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
          <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Faturas</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Gere a fatura do período de cada funerária a partir do plano de cobrança dela e acompanhe os pagamentos.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-tertiary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-tertiary/85"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Gerar fatura
        </button>
      </header>

      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-xs uppercase tracking-wider text-amber-400/80">Em aberto</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">{centsToBRL(openTotalCents)}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-xs uppercase tracking-wider text-emerald-400/80">Recebido</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">{centsToBRL(paidTotalCents)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleGenerate} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 space-y-4">
          <h2 className="text-lg font-medium text-on-surface">Gerar fatura do período</h2>
          {homes.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Nenhuma funerária aprovada ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-wider text-outline">Funerária</span>
                <select
                  required
                  value={form.funeralHomeId}
                  onChange={(e) => setForm((f) => ({ ...f, funeralHomeId: e.target.value }))}
                  className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                >
                  <option value="">Selecione</option>
                  {homes.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-wider text-outline">Vencimento (opcional)</span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-wider text-outline">Início do período</span>
                <input
                  type="date"
                  required
                  value={form.periodStart}
                  onChange={(e) => setForm((f) => ({ ...f, periodStart: e.target.value }))}
                  className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs uppercase tracking-wider text-outline">Fim do período</span>
                <input
                  type="date"
                  required
                  value={form.periodEnd}
                  onChange={(e) => setForm((f) => ({ ...f, periodEnd: e.target.value }))}
                  className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-tertiary focus:outline-none"
                />
              </label>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-outline-variant/40 px-5 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:border-outline-variant"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={generating || homes.length === 0}
              className="rounded-full bg-tertiary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-tertiary/85 disabled:opacity-50"
            >
              {generating ? "Gerando..." : "Gerar fatura"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {(["all", "open", "sent", "paid", "overdue", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              statusFilter === s ? "border-tertiary/40 bg-tertiary/10 text-tertiary" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
            }`}
          >
            {s === "all" ? "Todas" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-16 text-center text-on-surface-variant">
          Nenhuma fatura {statusFilter === "all" ? "gerada ainda" : `com status "${STATUS_LABEL[statusFilter as Invoice["status"]]}"`}.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline">
                  <th className="px-5 py-3 font-normal">Funerária</th>
                  <th className="px-5 py-3 font-normal">Período</th>
                  <th className="px-5 py-3 font-normal">Modo</th>
                  <th className="px-5 py-3 font-normal">Memoriais</th>
                  <th className="px-5 py-3 text-right font-normal">Total</th>
                  <th className="px-5 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 text-right font-normal">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-outline-variant/15 hover:bg-surface-variant/20">
                    <td className="px-5 py-4 font-medium text-on-surface">{inv.funeralHomeName}</td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {new Date(inv.periodStart).toLocaleDateString("pt-BR")} – {new Date(inv.periodEnd).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">{inv.billingMode === "monthly" ? "Mensal" : "Por QR"}</td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {inv.memorialsCount}
                      {inv.extraCount > 0 && <span className="ml-1 text-xs text-amber-400">(+{inv.extraCount} excedente)</span>}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-on-surface">{centsToBRL(inv.totalCents)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[inv.status]}`}>
                        {STATUS_LABEL[inv.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        {inv.status === "open" && (
                          <button disabled={busyId === inv.id} onClick={() => setStatus(inv.id, "sent")} className="rounded-lg border border-outline-variant/40 px-2.5 py-1 text-xs text-on-surface-variant hover:border-sky-400/40 hover:text-sky-300 disabled:opacity-50">
                            Marcar enviada
                          </button>
                        )}
                        {(inv.status === "open" || inv.status === "sent" || inv.status === "overdue") && (
                          <button disabled={busyId === inv.id} onClick={() => setStatus(inv.id, "paid")} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50">
                            Marcar paga
                          </button>
                        )}
                        {inv.status !== "paid" && inv.status !== "cancelled" && (
                          <button disabled={busyId === inv.id} onClick={() => setStatus(inv.id, "cancelled")} className="rounded-lg border border-red-500/20 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50">
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
