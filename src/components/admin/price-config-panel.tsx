"use client";

import { useState } from "react";
import { centsToBRL } from "@/src/lib/platform-types";
import type { PlatformConfig } from "@/src/lib/platform-types";

export function PriceConfigPanel({ initialConfig }: { initialConfig: PlatformConfig }) {
  const [familyPrice, setFamilyPrice] = useState(
    (initialConfig.familyMemorialPriceCents / 100).toFixed(2)
  );
  const [funeralPrice, setFuneralPrice] = useState(
    (initialConfig.funeralHomeMemorialPriceCents / 100).toFixed(2)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "prices",
          familyMemorialPriceCents: Math.round(parseFloat(familyPrice) * 100),
          funeralHomeMemorialPriceCents: Math.round(parseFloat(funeralPrice) * 100),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Erro ao salvar.");
      setMessage({ text: "Preços atualizados com sucesso.", ok: true });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Erro ao salvar.", ok: false });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
      <div className="mb-6">
        <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Configuração</p>
        <h2 className="font-h3 text-2xl text-on-surface">Preços dos Memoriais</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Valor cobrado por memorial publicado — pagamento único.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PriceInput
          label="Preço para Família"
          hint={`Atual: ${centsToBRL(initialConfig.familyMemorialPriceCents)}`}
          value={familyPrice}
          onChange={setFamilyPrice}
        />
        <PriceInput
          label="Preço para Funerária"
          hint={`Atual: ${centsToBRL(initialConfig.funeralHomeMemorialPriceCents)}`}
          value={funeralPrice}
          onChange={setFuneralPrice}
        />
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${message.ok ? "text-emerald-400" : "text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-tertiary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-tertiary/80 disabled:opacity-50"
        >
          {isSaving ? "Salvando..." : "Salvar preços"}
        </button>
      </div>
    </section>
  );
}

function PriceInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.14em] text-outline">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">R$</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-outline-variant/30 bg-[#0b0f0f] py-2.5 pl-9 pr-3 text-sm text-on-surface focus:border-tertiary focus:outline-none"
        />
      </div>
      <p className="text-xs text-outline">{hint}</p>
    </div>
  );
}
