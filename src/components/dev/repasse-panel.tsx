"use client";

import { useState } from "react";
import type { PlatformOrder } from "@/src/lib/platform-data";

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

type Props = {
  orders: PlatformOrder[];
  adminBankConfigured: boolean;
  adminPixKey: string | null;
};

export function RepassePanel({ orders, adminBankConfigured, adminPixKey }: Props) {
  const [localOrders, setLocalOrders] = useState<PlatformOrder[]>(orders);
  const [marking, setMarking] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const pendentes = localOrders.filter(
    (o) => o.status === "paid" && o.repasseStatus !== "realizado"
  );
  const totalPendente = pendentes.reduce((s, o) => s + o.operatorAmountCents, 0);

  async function markOne(orderId: string) {
    setMarking(orderId);
    setMsg(null);
    const res = await fetch("/api/dev/repasse", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    setMarking(null);
    if (res.ok) {
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, repasseStatus: "realizado" as const } : o))
      );
      setMsg({ text: "Repasse marcado como realizado.", ok: true });
    } else {
      setMsg({ text: "Erro ao atualizar.", ok: false });
    }
  }

  async function markAll() {
    if (!confirm(`Confirmar repasse de ${brl(totalPendente)} para o admin parceiro?`)) return;
    setMarkingAll(true);
    setMsg(null);
    const res = await fetch("/api/dev/repasse", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setMarkingAll(false);
    if (res.ok) {
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.status === "paid" && o.repasseStatus !== "realizado"
            ? { ...o, repasseStatus: "realizado" as const }
            : o
        )
      );
      setMsg({ text: "Todos os repasses marcados como realizados.", ok: true });
    } else {
      setMsg({ text: "Erro ao atualizar.", ok: false });
    }
  }

  return (
    <div className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#e9c349]">Repasse ao admin parceiro</p>
          <h2 className="text-xl font-medium text-on-surface">Transferências manuais pendentes</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Como o admin parceiro ainda não tem conta Stripe Connect, todo o valor fica retido no nosso
            Stripe. Após transferir manualmente, marque como realizado.
          </p>
        </div>

        {/* Modo Stripe */}
        <StripeModeBadge />
      </div>

      {/* Dados bancários do admin */}
      {!adminBankConfigured ? (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl shrink-0 mt-0.5">warning</span>
          <span>
            O admin parceiro ainda <strong>não cadastrou os dados bancários</strong>. Quando fizer isso, a chave Pix
            e os dados de conta aparecerão aqui.
          </span>
        </div>
      ) : (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-300 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl shrink-0 mt-0.5">account_balance</span>
          <span>
            Dados bancários configurados.
            {adminPixKey && (
              <> Chave Pix: <strong className="text-green-200">{adminPixKey}</strong></>
            )}
          </span>
        </div>
      )}

      {/* Totais */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <TotalCard
          label="Pendente de repasse"
          value={brl(totalPendente)}
          highlight={totalPendente > 0}
          icon="schedule"
        />
        <TotalCard
          label="Já repassado"
          value={brl(
            localOrders
              .filter((o) => o.status === "paid" && o.repasseStatus === "realizado")
              .reduce((s, o) => s + o.operatorAmountCents, 0)
          )}
          icon="check_circle"
        />
        <TotalCard
          label="Pedidos pendentes"
          value={pendentes.length.toString()}
          icon="pending_actions"
        />
      </div>

      {/* Ação em massa */}
      {pendentes.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-[#e9c349]/15 bg-[#e9c349]/5 px-4 py-3">
          <span className="text-sm text-[#e9c349]">
            {pendentes.length} pedido{pendentes.length > 1 ? "s" : ""} aguardando repasse — total {brl(totalPendente)}
          </span>
          <button
            onClick={markAll}
            disabled={markingAll}
            className="rounded-lg bg-[#e9c349] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50 flex items-center gap-2"
          >
            {markingAll ? (
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">done_all</span>
            )}
            Marcar todos como realizados
          </button>
        </div>
      )}

      {msg && (
        <p className={`text-sm rounded-lg px-3 py-2 ${msg.ok ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-400/20"}`}>
          {msg.text}
        </p>
      )}

      {/* Tabela de pedidos pendentes */}
      {pendentes.length === 0 ? (
        <p className="py-6 text-center text-sm text-on-surface-variant">
          Nenhum repasse pendente. ✓
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="pb-3 font-normal">Cliente</th>
                <th className="pb-3 font-normal">Data</th>
                <th className="pb-3 text-right font-normal">Total pago</th>
                <th className="pb-3 text-right font-normal text-[#e9c349]">A repassar</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {pendentes.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <p className="text-on-surface">{order.userName}</p>
                    <p className="text-xs text-on-surface-variant">{order.userEmail}</p>
                  </td>
                  <td className="py-3 pr-4 text-on-surface-variant">{fmt(order.createdAt)}</td>
                  <td className="py-3 pr-4 text-right text-on-surface">{brl(order.grossAmountCents)}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-[#e9c349]">
                    {brl(order.operatorAmountCents)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => markOne(order.id)}
                      disabled={marking === order.id}
                      className="rounded-lg border border-green-500/30 px-3 py-1.5 text-xs text-green-400 transition hover:bg-green-500/10 disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                    >
                      {marking === order.id ? (
                        <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-xs">check</span>
                      )}
                      Realizado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Badge que lê a env var NEXT_PUBLIC_STRIPE_MODE injetada no build */
function StripeModeBadge() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const isLive = key.startsWith("pk_live_");
  const isTest = key.startsWith("pk_test_");
  const unknown = !isLive && !isTest;

  if (unknown) return null;

  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        isLive
          ? "border border-green-500/30 bg-green-500/10 text-green-300"
          : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isLive ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
      Stripe {isLive ? "PRODUÇÃO (live)" : "DESENVOLVIMENTO (test)"}
    </div>
  );
}

function TotalCard({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-[#e9c349]/30 bg-[#e9c349]/5" : "border-white/5 bg-[#0b0f0f]/30"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-symbols-outlined text-sm ${highlight ? "text-[#e9c349]" : "text-on-surface-variant"}`}>{icon}</span>
        <p className="text-[0.65rem] uppercase tracking-wider text-on-surface-variant">{label}</p>
      </div>
      <p className={`text-xl font-semibold ${highlight ? "text-[#e9c349]" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}
