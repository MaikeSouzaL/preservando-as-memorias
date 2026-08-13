"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FuneralNav } from "@/src/components/funeral/funeral-nav";

type CompanyData = {
  name: string;
  email: string;
  cnpj: string | null;
  contactName: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
};

type BankData = {
  bankPixKey: string | null;
  bankHolderName: string | null;
  bankCpfCnpj: string | null;
};

export default function EmpresaPage() {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [companyForm, setCompanyForm] = useState({ contactName: "", phone: "", address: "", city: "", state: "" });
  const [bankForm, setBankForm] = useState({ bankPixKey: "", bankHolderName: "", bankCpfCnpj: "" });

  const [savingCompany, setSavingCompany] = useState(false);
  const [savingBank, setSavingBank] = useState(false);
  const [savedCompany, setSavedCompany] = useState(false);
  const [savedBank, setSavedBank] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [meRes, bankRes] = await Promise.all([
      fetch("/api/funeral-auth/me"),
      fetch("/api/funeral-auth/bank-data"),
    ]);

    if (meRes.status === 401 || meRes.status === 403 || bankRes.status === 401 || bankRes.status === 403) {
      router.push("/funeraria/login");
      return;
    }

    if (meRes.ok) {
      const { funeralHome }: { funeralHome: CompanyData } = await meRes.json();
      setCompany(funeralHome);
      setCompanyForm({
        contactName: funeralHome.contactName ?? "",
        phone: funeralHome.phone ?? "",
        address: funeralHome.address ?? "",
        city: funeralHome.city ?? "",
        state: funeralHome.state ?? "",
      });
    }

    if (bankRes.ok) {
      const d: BankData = await bankRes.json();
      setBankForm({
        bankPixKey: d.bankPixKey ?? "",
        bankHolderName: d.bankHolderName ?? "",
        bankCpfCnpj: d.bankCpfCnpj ?? "",
      });
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault();
    setSavingCompany(true);
    setError("");
    setSavedCompany(false);
    try {
      const res = await fetch("/api/funeral-auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erro ao salvar dados da empresa.");
        return;
      }
      setSavedCompany(true);
      await load();
    } finally {
      setSavingCompany(false);
    }
  }

  async function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setSavingBank(true);
    setError("");
    setSavedBank(false);
    try {
      const res = await fetch("/api/funeral-auth/bank-data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erro ao salvar dados bancários.");
        return;
      }
      setSavedBank(true);
      await load();
    } finally {
      setSavingBank(false);
    }
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0b0f0f]">
        <p className="text-[#c4c7c7]/60">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f]">
      <FuneralNav funeralHomeName={company.name} />

      <div className="mx-auto max-w-xl space-y-8 px-4 py-10">
        <header>
          <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Empresa</p>
          <h1 className="text-2xl font-semibold text-[#e0e3e2]">Dados da empresa</h1>
          <p className="mt-1 text-sm text-[#c4c7c7]/60">Dados cadastrais e conta para recebimento dos repasses.</p>
        </header>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
        )}

        {/* Dados cadastrais */}
        <form onSubmit={handleSaveCompany} className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#e9c349]">Dados cadastrais</h2>

            <div className="grid grid-cols-2 gap-4">
              <ReadOnlyField label="Razão social" value={company.name} />
              <ReadOnlyField label="CNPJ" value={company.cnpj ?? "—"} />
            </div>
            <ReadOnlyField label="E-mail de acesso" value={company.email} />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Responsável" value={companyForm.contactName} onChange={(v) => setCompanyForm((p) => ({ ...p, contactName: v }))} />
              <Field label="Telefone" value={companyForm.phone} onChange={(v) => setCompanyForm((p) => ({ ...p, phone: v }))} />
            </div>
            <Field label="Endereço" value={companyForm.address} onChange={(v) => setCompanyForm((p) => ({ ...p, address: v }))} />
            <div className="grid grid-cols-[1fr_100px] gap-4">
              <Field label="Cidade" value={companyForm.city} onChange={(v) => setCompanyForm((p) => ({ ...p, city: v }))} />
              <Field
                label="UF"
                value={companyForm.state}
                onChange={(v) => setCompanyForm((p) => ({ ...p, state: v.toUpperCase().slice(0, 2) }))}
                maxLength={2}
              />
            </div>
            <p className="text-xs text-[#c4c7c7]/40">
              Razão social, CNPJ e e-mail de acesso não podem ser alterados por aqui — fale com o suporte se precisar corrigir algum deles.
            </p>
          </div>

          {savedCompany && <SavedNotice text="Dados da empresa salvos com sucesso!" />}

          <button type="submit" disabled={savingCompany} className="w-full rounded-full bg-[#e9c349] py-3.5 text-sm font-semibold text-[#0d1010] transition hover:bg-[#e9c349]/90 disabled:opacity-60">
            {savingCompany ? "Salvando..." : "Salvar dados cadastrais"}
          </button>
        </form>

        {/* Dados bancários */}
        <div className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-5 space-y-2">
          <p className="text-sm font-semibold text-[#e9c349]">Sobre estes dados</p>
          <p className="text-sm text-[#c4c7c7]/70 leading-relaxed">
            Sua chave PIX é usada para eventuais repasses da plataforma. A cobrança da sua mensalidade ou uso, por outro lado,
            é feita separadamente — acompanhe em{" "}
            <a href="/funeraria/dashboard/cobranca" className="font-semibold text-[#e9c349] hover:underline">
              Cobrança
            </a>
            .
          </p>
        </div>

        <form onSubmit={handleSaveBank} className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#e9c349]">Dados bancários</h2>
            <Field label="Nome do titular da conta" value={bankForm.bankHolderName} onChange={(v) => setBankForm((p) => ({ ...p, bankHolderName: v }))} placeholder="Nome completo ou razão social" />
            <Field label="CPF / CNPJ do titular" value={bankForm.bankCpfCnpj} onChange={(v) => setBankForm((p) => ({ ...p, bankCpfCnpj: v }))} placeholder="000.000.000-00 ou 00.000.000/0001-00" />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/60">Chave PIX</label>
              <input
                type="text"
                value={bankForm.bankPixKey}
                onChange={(e) => setBankForm((p) => ({ ...p, bankPixKey: e.target.value }))}
                placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0e3e2] placeholder-[#c4c7c7]/30 focus:border-[#e9c349]/40 focus:outline-none"
              />
              <p className="text-xs text-[#c4c7c7]/40">Esta é a chave que recebe eventuais repasses da plataforma.</p>
            </div>
          </div>

          {savedBank && <SavedNotice text="Dados bancários salvos com sucesso!" />}

          <button type="submit" disabled={savingBank} className="w-full rounded-full bg-[#e9c349] py-3.5 text-sm font-semibold text-[#0d1010] transition hover:bg-[#e9c349]/90 disabled:opacity-60">
            {savingBank ? "Salvando..." : "Salvar dados bancários"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, maxLength,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/60">{label}</label>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0e3e2] placeholder-[#c4c7c7]/30 focus:border-[#e9c349]/40 focus:outline-none"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium uppercase tracking-wider text-[#c4c7c7]/40">{label}</label>
      <p className="rounded-lg border border-white/5 bg-black/20 px-4 py-3 text-sm text-[#c4c7c7]/70">{value}</p>
    </div>
  );
}

function SavedNotice({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">{text}</p>
  );
}
