"use client";

import { useCallback, useEffect, useState } from "react";

type Delivery = {
  id: string;
  memorialId: string;
  memorialName: string;
  responsible: "platform" | "funeral_home";
  status: "pending" | "printing" | "shipped" | "delivered" | "cancelled";
  recipientName: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  trackingCode: string | null;
  carrier: string | null;
  createdAt: string;
};

const STATUS_FLOW: Record<Delivery["status"], Delivery["status"] | null> = {
  pending: "printing",
  printing: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

const NEXT_ACTION_LABEL: Record<string, string> = {
  printing: "Marcar em impressão",
  shipped: "Marcar como enviado",
  delivered: "Marcar como entregue",
};

function address(d: Delivery) {
  if (!d.logradouro) return null;
  return [`${d.logradouro}, ${d.numero ?? "s/n"}`, d.complemento || null, d.bairro, `${d.cidade}/${d.estado}`, d.cep]
    .filter(Boolean)
    .join(" — ");
}

function DeliveryCard({
  delivery,
  busy,
  onAdvance,
  onCancel,
  onSaveTracking,
}: {
  delivery: Delivery;
  busy: boolean;
  onAdvance: () => void;
  onCancel: () => void;
  onSaveTracking: (tracking: string, carrier: string) => void;
}) {
  const [editingTracking, setEditingTracking] = useState(false);
  const [tracking, setTracking] = useState(delivery.trackingCode ?? "");
  const [carrier, setCarrier] = useState(delivery.carrier ?? "");
  const next = STATUS_FLOW[delivery.status];

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-on-surface">{delivery.memorialName}</p>
          {delivery.recipientName && <p className="text-xs text-on-surface-variant">Para: {delivery.recipientName}</p>}
          {address(delivery) && <p className="mt-0.5 text-xs text-outline">{address(delivery)}</p>}
          <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-outline">
            {delivery.responsible === "platform" ? "Responsabilidade: plataforma" : "Responsabilidade: funerária"} ·{" "}
            {new Date(delivery.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {(delivery.trackingCode || delivery.carrier || editingTracking) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          {editingTracking ? (
            <>
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Transportadora"
                className="w-32 rounded border border-outline-variant/40 bg-surface-container-lowest px-2 py-1 text-xs text-on-surface focus:border-tertiary focus:outline-none"
              />
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Código de rastreio"
                className="w-40 rounded border border-outline-variant/40 bg-surface-container-lowest px-2 py-1 text-xs text-on-surface focus:border-tertiary focus:outline-none"
              />
              <button
                onClick={() => {
                  onSaveTracking(tracking, carrier);
                  setEditingTracking(false);
                }}
                className="rounded bg-tertiary/15 px-2 py-1 text-xs font-semibold text-tertiary hover:bg-tertiary/25"
              >
                Salvar
              </button>
            </>
          ) : (
            <>
              {delivery.carrier && <span>{delivery.carrier}</span>}
              {delivery.trackingCode && <span className="font-mono">{delivery.trackingCode}</span>}
            </>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 border-t border-outline-variant/20 pt-3">
        {next && (
          <button
            disabled={busy}
            onClick={onAdvance}
            className="rounded-lg bg-tertiary/15 px-3 py-1.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary/25 disabled:opacity-50"
          >
            {busy ? "..." : NEXT_ACTION_LABEL[next]}
          </button>
        )}
        {(delivery.status === "shipped" || delivery.status === "printing") && !editingTracking && (
          <button
            onClick={() => setEditingTracking(true)}
            className="rounded-lg border border-outline-variant/40 px-3 py-1.5 text-xs text-on-surface-variant transition hover:border-outline-variant"
          >
            {delivery.trackingCode ? "Editar rastreio" : "Adicionar rastreio"}
          </button>
        )}
        {delivery.status !== "delivered" && delivery.status !== "cancelled" && (
          <button
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

function ResponsibleModeCard() {
  const [mode, setMode] = useState<"admin" | "self" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/platform-config")
      .then((r) => r.json())
      .then((d) => setMode(d.config?.funeralHomeQrDeliveryMode ?? "self"))
      .catch(() => setMode("self"));
  }, []);

  async function save(next: "admin" | "self") {
    setSaving(true);
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "funeral_home_qr_delivery", funeralHomeQrDeliveryMode: next }),
      });
      if (res.ok) setMode(next);
    } finally {
      setSaving(false);
    }
  }

  if (mode === null) return null;

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
      <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Padrão para memoriais criados por funerárias</p>
      <h2 className="font-h3 text-lg text-on-surface">Quem entrega o QR à família?</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          disabled={saving}
          onClick={() => save("admin")}
          className={`rounded-lg border p-4 text-left transition disabled:opacity-50 ${
            mode === "admin" ? "border-tertiary bg-tertiary/8" : "border-outline-variant/30 hover:border-tertiary/40"
          }`}
        >
          <p className={`text-sm font-semibold ${mode === "admin" ? "text-tertiary" : "text-on-surface"}`}>Eu (plataforma) envio</p>
          <p className="mt-1 text-xs text-on-surface-variant">Entra na sua fila de entregas abaixo.</p>
        </button>
        <button
          disabled={saving}
          onClick={() => save("self")}
          className={`rounded-lg border p-4 text-left transition disabled:opacity-50 ${
            mode === "self" ? "border-tertiary bg-tertiary/8" : "border-outline-variant/30 hover:border-tertiary/40"
          }`}
        >
          <p className={`text-sm font-semibold ${mode === "self" ? "text-tertiary" : "text-on-surface"}`}>A funerária entrega</p>
          <p className="mt-1 text-xs text-on-surface-variant">A própria funerária cuida da entrega à família.</p>
        </button>
      </div>
    </section>
  );
}

export function QrDeliveriesPageClient() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/owner/deliveries");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao carregar entregas.");
      setDeliveries(data.deliveries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar entregas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/owner/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao atualizar entrega.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar entrega.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  const columns: { status: Delivery["status"]; label: string }[] = [
    { status: "pending", label: "Pendente" },
    { status: "printing", label: "Imprimindo" },
    { status: "shipped", label: "Enviado" },
    { status: "delivered", label: "Entregue" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Entregas de QR</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
          Fila de trabalho para imprimir e despachar as placas de QR Code físicas.
        </p>
      </header>

      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}

      <ResponsibleModeCard />

      {deliveries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-16 text-center text-on-surface-variant">
          Nenhuma entrega de QR Code pendente no momento.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-4">
          {columns.map((col) => {
            const items = deliveries.filter((d) => d.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {col.label}
                  <span className="rounded-full bg-surface-variant px-2 py-0.5 text-[0.65rem] text-on-surface-variant">{items.length}</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {items.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-outline-variant/20 py-6 text-center text-xs text-outline">Vazio</p>
                  ) : (
                    items.map((d) => (
                      <DeliveryCard
                        key={d.id}
                        delivery={d}
                        busy={busyId === d.id}
                        onAdvance={() => {
                          const next = STATUS_FLOW[d.status];
                          if (next) patch(d.id, { status: next });
                        }}
                        onCancel={() => patch(d.id, { status: "cancelled" })}
                        onSaveTracking={(tracking, carrier) => patch(d.id, { trackingCode: tracking, carrier })}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
