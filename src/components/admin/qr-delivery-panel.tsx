"use client";

import { useCallback, useEffect, useState } from "react";
import type { QrDeliveryMode, QrDeliveryOverride } from "@/src/lib/platform-types";

type FuneralHomeRow = {
  id: string;
  name: string;
  approvalStatus: "pending" | "approved" | "rejected";
  qrDeliveryMode?: QrDeliveryOverride;
};

const MODE_LABELS: Record<QrDeliveryOverride, string> = {
  inherit: "Seguir global",
  admin: "Eu envio",
  self: "Família imprime",
};
const MODE_ICONS: Record<QrDeliveryOverride, string> = {
  inherit: "sync",
  admin: "local_shipping",
  self: "print",
};

export function QrDeliveryPanel({ initialMode }: { initialMode?: QrDeliveryMode }) {
  const [globalMode, setGlobalMode] = useState<QrDeliveryMode>(initialMode ?? "self");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const [homes, setHomes] = useState<FuneralHomeRow[]>([]);
  const [loadingHomes, setLoadingHomes] = useState(true);
  const [savingFh, setSavingFh] = useState<string | null>(null);

  const loadHomes = useCallback(async () => {
    setLoadingHomes(true);
    const res = await fetch("/api/admin/funeral-homes");
    if (res.ok) {
      const d = await res.json();
      setHomes((d.funeralHomes ?? []) as FuneralHomeRow[]);
    }
    setLoadingHomes(false);
  }, []);

  useEffect(() => { loadHomes(); }, [loadHomes]);

  async function saveGlobal(mode: QrDeliveryMode) {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch("/api/platform-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "qr_delivery", qrDeliveryMode: mode }),
    });
    if (res.ok) {
      setGlobalMode(mode);
      setSavedMsg("Configuração global salva.");
      setTimeout(() => setSavedMsg(""), 3000);
    }
    setSaving(false);
  }

  async function saveFuneralHome(id: string, mode: QrDeliveryOverride) {
    setSavingFh(id);
    const res = await fetch(`/api/admin/funeral-homes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_qr_delivery", qrDeliveryMode: mode }),
    });
    if (res.ok) {
      setHomes((prev) =>
        prev.map((h) => (h.id === id ? { ...h, qrDeliveryMode: mode } : h))
      );
    }
    setSavingFh(null);
  }

  /** Modo efetivo para uma funerária (leva override em conta) */
  function effectiveMode(fh: FuneralHomeRow): QrDeliveryMode {
    if (fh.qrDeliveryMode && fh.qrDeliveryMode !== "inherit") {
      return fh.qrDeliveryMode;
    }
    return globalMode;
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── Configuração global ─────────────────────────────────────────── */}
      <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
        <div className="mb-4">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Configuração global</p>
          <h2 className="font-h3 text-xl text-on-surface">Quem entrega o QR Code?</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Define o comportamento padrão para TODAS as funerárias. Você pode sobrescrever por funerária abaixo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Opção: Eu envio */}
          <button
            onClick={() => saveGlobal("admin")}
            disabled={saving}
            className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition hover:border-tertiary/40 ${
              globalMode === "admin"
                ? "border-tertiary bg-tertiary/8 shadow-[0_0_16px_rgba(233,195,73,0.08)]"
                : "border-outline-variant/30 bg-surface-container/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${globalMode === "admin" ? "bg-tertiary/15" : "bg-surface-container/60"}`}>
                <span className={`material-symbols-outlined text-xl ${globalMode === "admin" ? "text-tertiary" : "text-on-surface-variant"}`}>
                  local_shipping
                </span>
              </div>
              <div>
                <p className={`font-semibold ${globalMode === "admin" ? "text-tertiary" : "text-on-surface"}`}>
                  Eu sou responsável pelo envio
                </p>
                {globalMode === "admin" && (
                  <span className="text-[10px] uppercase tracking-widest text-tertiary">● Ativo</span>
                )}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Você imprime e envia o QR Code físico para cada família. Durante o cadastro do memorial,
              a família preenche o <strong className="text-on-surface">endereço de entrega</strong>.
            </p>
          </button>

          {/* Opção: Família imprime */}
          <button
            onClick={() => saveGlobal("self")}
            disabled={saving}
            className={`flex flex-col gap-3 rounded-xl border p-5 text-left transition hover:border-tertiary/40 ${
              globalMode === "self"
                ? "border-tertiary bg-tertiary/8 shadow-[0_0_16px_rgba(233,195,73,0.08)]"
                : "border-outline-variant/30 bg-surface-container/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${globalMode === "self" ? "bg-tertiary/15" : "bg-surface-container/60"}`}>
                <span className={`material-symbols-outlined text-xl ${globalMode === "self" ? "text-tertiary" : "text-on-surface-variant"}`}>
                  print
                </span>
              </div>
              <div>
                <p className={`font-semibold ${globalMode === "self" ? "text-tertiary" : "text-on-surface"}`}>
                  Família imprime o próprio QR
                </p>
                {globalMode === "self" && (
                  <span className="text-[10px] uppercase tracking-widest text-tertiary">● Ativo</span>
                )}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              A família baixa e imprime o QR Code por conta própria. Nenhum formulário de endereço é exibido
              durante o cadastro.
            </p>
          </button>
        </div>

        {savedMsg && (
          <p className="mt-3 text-sm text-emerald-400">{savedMsg}</p>
        )}

        <div className={`mt-4 flex items-start gap-2 rounded-lg border p-3 text-xs ${
          globalMode === "admin"
            ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
        }`}>
          <span className="material-symbols-outlined shrink-0 text-[1rem]">
            {globalMode === "admin" ? "info" : "check_circle"}
          </span>
          <span>
            {globalMode === "admin"
              ? "Modo ativo: as famílias verão um formulário de endereço de entrega ao criar o memorial. Você verá esse endereço no painel de memoriais."
              : "Modo ativo: nenhum formulário de entrega será exibido. A família recebe um link para download do QR Code após o pagamento."}
          </span>
        </div>
      </section>

      {/* ── Override por funerária ──────────────────────────────────────── */}
      <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
        <div className="mb-4">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Por funerária</p>
          <h2 className="font-h3 text-xl text-on-surface">Exceções individuais</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Sobrescreva a configuração global para funerárias específicas.
            &quot;Seguir global&quot; herda o modo definido acima.
          </p>
        </div>

        {loadingHomes ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">Carregando funerárias...</p>
        ) : homes.filter((h) => h.approvalStatus === "approved").length === 0 ? (
          <div className="rounded-lg border border-dashed border-outline-variant/40 py-10 text-center text-sm text-on-surface-variant">
            Nenhuma funerária aprovada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {homes
              .filter((h) => h.approvalStatus === "approved")
              .map((fh) => {
                const current = fh.qrDeliveryMode ?? "inherit";
                const effective = effectiveMode(fh);
                return (
                  <div
                    key={fh.id}
                    className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface">{fh.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        Modo efetivo:&nbsp;
                        <span className={effective === "admin" ? "text-amber-400" : "text-emerald-400"}>
                          <span className="material-symbols-outlined align-middle text-[0.85rem]">
                            {effective === "admin" ? "local_shipping" : "print"}
                          </span>
                          &nbsp;{effective === "admin" ? "Admin envia" : "Família imprime"}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {(["inherit", "admin", "self"] as QrDeliveryOverride[]).map((mode) => (
                        <button
                          key={mode}
                          disabled={savingFh === fh.id}
                          onClick={() => saveFuneralHome(fh.id, mode)}
                          title={MODE_LABELS[mode]}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                            current === mode
                              ? "border-tertiary bg-tertiary/10 text-tertiary"
                              : "border-outline-variant/40 text-on-surface-variant hover:border-tertiary/40 hover:text-on-surface"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[0.85rem]">
                            {savingFh === fh.id ? "progress_activity" : MODE_ICONS[mode]}
                          </span>
                          <span className="hidden sm:inline">{MODE_LABELS[mode]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
