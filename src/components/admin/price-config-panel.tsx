"use client";

import { useState } from "react";
import { centsToBRL, estimateStripeFeeCents } from "@/src/lib/platform-types";
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

      {/* ── Breakdown estimado por venda ─────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-outline-variant/30 bg-[#0a192f33] p-4">
        <p className="mb-3 text-[0.7rem] uppercase tracking-[0.14em] text-tertiary">
          Simulação de repasse por venda
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <BreakdownCard
            label="Memorial Família"
            priceCents={Math.round(parseFloat(familyPrice || "0") * 100) || 0}
            commissionPercent={initialConfig.ownerCommissionPercent}
          />
          <BreakdownCard
            label="Memorial Funerária"
            priceCents={Math.round(parseFloat(funeralPrice || "0") * 100) || 0}
            commissionPercent={initialConfig.ownerCommissionPercent}
          />
        </div>
        <p className="mt-3 text-[0.68rem] leading-relaxed text-outline">
          <span className="text-amber-400">★</span> A comissão da plataforma ({initialConfig.ownerCommissionPercent}%) é calculada sobre o{" "}
          <strong className="text-on-surface-variant">valor bruto</strong> (antes da taxa Stripe). A taxa Stripe é deduzida do seu repasse.{" "}
          Taxa estimada — cartão nacional: 3,49% + R$0,39 · PIX: 0,99%. Confirme em{" "}
          <a
            href="https://stripe.com/br/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary underline underline-offset-2"
          >
            stripe.com/br/pricing
          </a>
          .
        </p>
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

/** Exibe a simulação de repasse para um preço, mostrando dedução Stripe + comissão plataforma */
function BreakdownCard({
  label,
  priceCents,
  commissionPercent,
}: {
  label: string;
  priceCents: number;
  commissionPercent: number;
}) {
  if (priceCents <= 0) {
    return (
      <div className="rounded-lg border border-dashed border-outline-variant/30 p-4 text-center text-xs text-outline">
        {label} — preço não configurado
      </div>
    );
  }

  // Taxa Stripe estimada (cartão nacional)
  const stripeCard = estimateStripeFeeCents(priceCents, "card");
  const stripePix  = estimateStripeFeeCents(priceCents, "pix");

  // Comissão da plataforma (dev admin) — calculada sobre o BRUTO
  const platformCommission = Math.round((priceCents * commissionPercent) / 100);

  // Repasse ao parceiro para cada método
  const parceiroCreditCard = priceCents - stripeCard - platformCommission;
  const parceiroPix        = priceCents - stripePix  - platformCommission;

  const row = (desc: string, value: number, highlight?: "green" | "amber" | "red") => (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-outline">{desc}</span>
      <span
        className={
          highlight === "green"
            ? "font-semibold text-emerald-400"
            : highlight === "amber"
            ? "font-semibold text-tertiary"
            : highlight === "red"
            ? "text-red-400"
            : "text-on-surface-variant"
        }
      >
        {value < 0 ? "—" : centsToBRL(value)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-outline-variant/30 bg-[#0b0f0f]/60 p-4">
      <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-on-surface">
        {label}
      </p>
      {row("Cliente paga", priceCents)}
      <div className="my-1 border-t border-outline-variant/20" />

      <p className="text-[0.62rem] uppercase tracking-wider text-outline">Via cartão</p>
      {row("Taxa Stripe (cartão)", stripeCard, "red")}
      {row(`Comissão plataforma (${commissionPercent}%)`, platformCommission, "amber")}
      {row("Você recebe (parceiro)", parceiroCreditCard, parceiroCreditCard > 0 ? "green" : "red")}

      <div className="my-1 border-t border-outline-variant/20" />
      <p className="text-[0.62rem] uppercase tracking-wider text-outline">Via PIX</p>
      {row("Taxa Stripe (PIX)", stripePix, "red")}
      {row(`Comissão plataforma (${commissionPercent}%)`, platformCommission, "amber")}
      {row("Você recebe (parceiro)", parceiroPix, parceiroPix > 0 ? "green" : "red")}
    </div>
  );
}
