"use client";

import { useState } from "react";
import { centsToBRL, estimateStripeFeeCents } from "@/src/lib/platform-types";
import type { PlatformConfig } from "@/src/lib/platform-types";

export function PriceConfigPanel({ initialConfig }: { initialConfig: PlatformConfig }) {
  const [familyPrice, setFamilyPrice] = useState((initialConfig.familyMemorialPriceCents / 100).toFixed(2));
  const [funeralPrice, setFuneralPrice] = useState((initialConfig.funeralHomeMemorialPriceCents / 100).toFixed(2));
  const [candlePrice, setCandlePrice] = useState((initialConfig.candlePriceCents / 100).toFixed(2));
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
          candlePriceCents: Math.round(parseFloat(candlePrice) * 100),
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
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
      <div className="mb-6">
        <p className="text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Configuração</p>
        <h2 className="font-h3 text-2xl text-on-surface">Preços da plataforma</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Valores cobrados por memorial e por vela — pagamento único.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PriceInput
          label="Memorial — Família"
          hint={`Atual: ${centsToBRL(initialConfig.familyMemorialPriceCents)}`}
          value={familyPrice}
          onChange={setFamilyPrice}
        />
        <PriceInput
          label="Memorial — Funerária"
          hint={`Atual: ${centsToBRL(initialConfig.funeralHomeMemorialPriceCents)}`}
          value={funeralPrice}
          onChange={setFuneralPrice}
        />
        <PriceInput
          label="Vela avulsa"
          hint={`Atual: ${centsToBRL(initialConfig.candlePriceCents)}`}
          value={candlePrice}
          onChange={setCandlePrice}
        />
      </div>

      <div className="mt-6 rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
        <p className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-tertiary">Simulação de recebimento por venda</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <BreakdownCard label="Memorial Família" priceCents={Math.round(parseFloat(familyPrice || "0") * 100) || 0} />
          <BreakdownCard label="Memorial Funerária" priceCents={Math.round(parseFloat(funeralPrice || "0") * 100) || 0} />
        </div>
        <p className="mt-3 text-[0.68rem] leading-relaxed text-outline">
          <span className="text-tertiary">★</span> Todo o valor da venda é seu — não há mais divisão com operador. A taxa Stripe é
          descontada automaticamente. Taxa estimada — cartão nacional: 3,49% + R$0,39 · PIX: 0,99%. Confirme em{" "}
          <a href="https://stripe.com/br/pricing" target="_blank" rel="noopener noreferrer" className="text-tertiary underline underline-offset-2">
            stripe.com/br/pricing
          </a>
          .
        </p>
      </div>

      {message && <p className={`mt-4 text-sm ${message.ok ? "text-emerald-400" : "text-error"}`}>{message.text}</p>}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-tertiary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-background transition hover:bg-tertiary/85 disabled:opacity-50"
        >
          {isSaving ? "Salvando..." : "Salvar preços"}
        </button>
      </div>
    </section>
  );
}

function PriceInput({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
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
          className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest py-2.5 pl-9 pr-3 text-sm text-on-surface focus:border-tertiary focus:outline-none"
        />
      </div>
      <p className="text-xs text-outline">{hint}</p>
    </div>
  );
}

function BreakdownCard({ label, priceCents }: { label: string; priceCents: number }) {
  if (priceCents <= 0) {
    return (
      <div className="rounded-lg border border-dashed border-outline-variant/30 p-4 text-center text-xs text-outline">
        {label} — preço não configurado
      </div>
    );
  }

  const stripeCard = estimateStripeFeeCents(priceCents, "card");
  const stripePix = estimateStripeFeeCents(priceCents, "pix");
  const youReceiveCard = priceCents - stripeCard;
  const youReceivePix = priceCents - stripePix;

  const row = (desc: string, value: number, tone?: "green" | "red") => (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-outline">{desc}</span>
      <span className={tone === "green" ? "font-semibold text-emerald-400" : tone === "red" ? "text-red-400" : "text-on-surface-variant"}>
        {centsToBRL(value)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
      <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-on-surface">{label}</p>
      {row("Cliente paga", priceCents)}
      <div className="my-1 border-t border-outline-variant/20" />
      {row("Taxa Stripe (cartão)", stripeCard, "red")}
      {row("Você recebe (cartão)", youReceiveCard, "green")}
      <div className="my-1 border-t border-outline-variant/20" />
      {row("Taxa Stripe (PIX)", stripePix, "red")}
      {row("Você recebe (PIX)", youReceivePix, "green")}
    </div>
  );
}
