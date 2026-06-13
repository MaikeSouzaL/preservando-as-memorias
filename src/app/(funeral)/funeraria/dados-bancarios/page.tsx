"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BankData = {
  bankPixKey: string | null;
  bankHolderName: string | null;
  bankCpfCnpj: string | null;
  adminCommissionPercent: number;
};

export default function DadosBancariosPage() {
  const router = useRouter();
  const [data, setData] = useState<BankData | null>(null);
  const [form, setForm] = useState({ bankPixKey: "", bankHolderName: "", bankCpfCnpj: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/funeral-auth/bank-data");
    if (res.status === 401) { router.push("/funeraria/login"); return; }
    if (res.ok) {
      const d: BankData = await res.json();
      setData(d);
      setForm({
        bankPixKey: d.bankPixKey ?? "",
        bankHolderName: d.bankHolderName ?? "",
        bankCpfCnpj: d.bankCpfCnpj ?? "",
      });
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/funeral-auth/bank-data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erro ao salvar.");
        return;
      }
      setSaved(true);
      await load();
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <p className="text-[#c4c7c7]/60">Carregando...</p>
      </div>
    );
  }

  const receivePercent = 100 - data.adminCommissionPercent;

  return (
    <div className="min-h-screen bg-[#0a1628] px-4 py-10">
      <div className="mx-auto max-w-xl space-y-8">
        {/* Voltar */}
        <Link
          href="/funeraria/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#c4c7c7]/60 hover:text-[#c4c7c7] transition"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar ao painel
        </Link>

        <header>
          <h1 className="text-2xl font-semibold text-[#e0e3e2]">Dados para Recebimento</h1>
          <p className="mt-1 text-sm text-[#c4c7c7]/60">
            Informe sua chave PIX para receber os repasses após cada pagamento confirmado.
          </p>
        </header>

        {/* Resumo de comissão */}
        <div className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-5 space-y-2">
          <p className="text-sm font-semibold text-[#e9c349]">Como funciona o repasse</p>
          <p className="text-sm text-[#c4c7c7]/70 leading-relaxed">
            Sobre cada venda, o seu administrador parceiro retém{" "}
            <strong className="text-[#e9c349]">{data.adminCommissionPercent}%</strong> de comissão.
            Você recebe os{" "}
            <strong className="text-[#e0e3e2]">{receivePercent}%</strong> restantes diretamente
            na chave PIX cadastrada abaixo, em até 5 dias úteis.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/60">
                Nome do titular da conta
              </label>
              <input
                type="text"
                value={form.bankHolderName}
                onChange={(e) => setForm((p) => ({ ...p, bankHolderName: e.target.value }))}
                placeholder="Nome completo ou razão social"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0e3e2] placeholder-[#c4c7c7]/30 focus:border-[#e9c349]/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/60">
                CPF / CNPJ do titular
              </label>
              <input
                type="text"
                value={form.bankCpfCnpj}
                onChange={(e) => setForm((p) => ({ ...p, bankCpfCnpj: e.target.value }))}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0e3e2] placeholder-[#c4c7c7]/30 focus:border-[#e9c349]/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/60">
                Chave PIX
              </label>
              <input
                type="text"
                value={form.bankPixKey}
                onChange={(e) => setForm((p) => ({ ...p, bankPixKey: e.target.value }))}
                placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0e3e2] placeholder-[#c4c7c7]/30 focus:border-[#e9c349]/40 focus:outline-none"
              />
              <p className="text-xs text-[#c4c7c7]/40">
                Esta é a chave que receberá os repasses da plataforma.
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {saved && (
            <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              Dados salvos com sucesso!
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#e9c349] py-3.5 text-sm font-semibold text-[#0d1010] transition hover:bg-[#e9c349]/90 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar dados de recebimento"}
          </button>
        </form>
      </div>
    </div>
  );
}
