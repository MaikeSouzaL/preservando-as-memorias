"use client";

import { useEffect, useState } from "react";

type BankData = {
  holderName: string;
  bankName: string;
  agency: string;
  account: string;
  accountType: "corrente" | "poupança";
  cpfCnpj: string;
  pixKey?: string;
};

const emptyForm: BankData = {
  holderName: "",
  bankName: "",
  agency: "",
  account: "",
  accountType: "corrente",
  cpfCnpj: "",
  pixKey: "",
};

export function BankDataPanel({
  grossRevenueCents,
  platformCommissionCents,
}: {
  grossRevenueCents: number;
  platformCommissionCents: number;
}) {
  const adminRepasse = grossRevenueCents - platformCommissionCents;
  const [form, setForm] = useState<BankData>(emptyForm);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/bank-data")
      .then((r) => r.json())
      .then((payload) => {
        if (payload.bankData) setForm({ ...emptyForm, ...payload.bankData });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/bank-data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const payload = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(payload.error ?? "Erro ao salvar.");
    } else {
      setMessage("Dados bancários salvos com segurança.");
    }
  }

  return (
    <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Repasse financeiro</p>
        <h2 className="font-h3 text-2xl text-on-surface">Dados bancários do administrador</h2>
        <p className="text-sm text-on-surface-variant">
          Informações para repasse automático de <strong className="text-[#e9c349]">85%</strong> da receita.
          Os dados são armazenados criptografados (AES-256-GCM).
        </p>
      </div>

      {/* Resumo financeiro */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <RepasseCard
          label="Receita bruta coletada"
          value={formatBRL(grossRevenueCents)}
          sub="100% via Stripe"
        />
        <RepasseCard
          label="Seu repasse (85%)"
          value={formatBRL(adminRepasse)}
          sub="A receber em conta"
          highlight
        />
        <RepasseCard
          label="Taxa da plataforma (15%)"
          value={formatBRL(platformCommissionCents)}
          sub="Dono do sistema"
        />
      </div>

      {!loaded ? (
        <p className="text-sm text-on-surface-variant">Carregando dados bancários...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <Field label="Nome do titular *" name="holderName" value={form.holderName} onChange={handleChange} />
          <Field label="CPF ou CNPJ do titular *" name="cpfCnpj" value={form.cpfCnpj} onChange={handleChange} placeholder="000.000.000-00" />
          <Field label="Banco *" name="bankName" value={form.bankName} onChange={handleChange} placeholder="Ex: Itaú, Nubank, Caixa..." />
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-on-surface-variant">Tipo de conta *</label>
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="rounded border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-on-surface outline-none focus:border-[#e9c349]/40"
            >
              <option value="corrente">Conta Corrente</option>
              <option value="poupança">Conta Poupança</option>
            </select>
          </div>
          <Field label="Agência *" name="agency" value={form.agency} onChange={handleChange} placeholder="0000" />
          <Field label="Conta com dígito *" name="account" value={form.account} onChange={handleChange} placeholder="00000-0" />
          <Field
            label="Chave Pix (opcional)"
            name="pixKey"
            value={form.pixKey ?? ""}
            onChange={handleChange}
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            className="md:col-span-2"
          />

          {error && <p className="md:col-span-2 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {message && <p className="md:col-span-2 rounded-lg border border-green-300/30 bg-green-500/10 p-3 text-sm text-green-200">{message}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-[#e9c349] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              {saving ? "Salvando..." : "Salvar dados criptografados"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</span>
      <input
        {...props}
        className="rounded border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-on-surface placeholder-white/20 outline-none focus:border-[#e9c349]/40"
      />
    </label>
  );
}

function RepasseCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-[#e9c349]/30 bg-[#e9c349]/5" : "border-white/5 bg-[#0b0f0f]/30"}`}>
      <p className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</p>
      <p className={`mt-1 font-h3 text-xl ${highlight ? "text-[#e9c349]" : "text-on-surface"}`}>{value}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{sub}</p>
    </div>
  );
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
