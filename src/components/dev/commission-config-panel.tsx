"use client";

import { useState } from "react";

export function CommissionConfigPanel({ initialCommission }: { initialCommission: number }) {
  const [value, setValue] = useState(String(initialCommission));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "commission",
          ownerCommissionPercent: parseFloat(value),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar.");
      setValue(String(data.config.ownerCommissionPercent));
      setMessage({ text: `Taxa atualizada para ${data.config.ownerCommissionPercent}%.`, ok: true });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Erro ao salvar.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  const parsed = parseFloat(value);
  const adminPct = Number.isFinite(parsed) ? 100 - parsed : 85;

  return (
    <div className="rounded-xl border border-[#e9c349]/20 bg-[#0d1b2a]/60 p-6">
      <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-[#e9c349]">Taxa do sistema</p>
      <p className="mb-5 text-sm text-on-surface-variant">
        Percentual que você retém de cada venda. O admin da plataforma recebe o restante.
      </p>

      <form onSubmit={handleSave} className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-on-surface-variant">Minha taxa (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-28 rounded-lg border border-[#e9c349]/30 bg-[#0b0f0f] px-3 py-2.5 text-sm text-[#e9c349] focus:border-[#e9c349] focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-on-surface-variant">Repasse ao admin</span>
          <div className="rounded-lg border border-outline-variant/30 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-on-surface-variant">
            {Number.isFinite(parsed) && parsed >= 0 && parsed <= 100
              ? `${adminPct.toFixed(1).replace(/\.0$/, "")}%`
              : "—"}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#e9c349] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088] disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar taxa"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            message.ok
              ? "border border-green-500/20 bg-green-500/10 text-green-300"
              : "border border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
