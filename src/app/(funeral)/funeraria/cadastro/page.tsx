"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskCnpj(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function cleanCnpj(masked: string) {
  return masked.replace(/\D/g, "");
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { label: "Empresa", icon: "store" },
  { label: "Responsável", icon: "person" },
  { label: "Acesso", icon: "lock" },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                i < current
                  ? "border-[#e9c349] bg-[#e9c349] text-[#0d1010]"
                  : i === current
                  ? "border-[#e9c349] bg-[#e9c349]/10 text-[#e9c349]"
                  : "border-white/20 bg-transparent text-[#c4c7c7]/40"
              }`}
            >
              {i < current ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                <span className="material-symbols-outlined text-sm">{s.icon}</span>
              )}
            </div>
            <span
              className={`text-[0.6rem] font-semibold uppercase tracking-wider ${
                i === current ? "text-[#e9c349]" : i < current ? "text-[#e9c349]/60" : "text-[#c4c7c7]/30"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-3 mb-5 h-px w-16 transition-all ${
                i < current ? "bg-[#e9c349]/60" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1 — CNPJ / Empresa ──────────────────────────────────────────────────

type CompanyData = {
  name: string;
  fantasia?: string;
  city: string;
  state: string;
};

function Step1({
  cnpj,
  setCnpj,
  company,
  setCompany,
  onNext,
}: {
  cnpj: string;
  setCnpj: (v: string) => void;
  company: CompanyData | null;
  setCompany: (v: CompanyData | null) => void;
  onNext: () => void;
}) {
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  async function lookup() {
    const digits = cleanCnpj(cnpj);
    if (digits.length !== 14) {
      setFetchError("Digite um CNPJ completo (14 dígitos).");
      return;
    }
    setFetching(true);
    setFetchError("");
    setCompany(null);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
      if (!res.ok) throw new Error("CNPJ não encontrado na Receita Federal.");
      const d = await res.json();
      setCompany({
        name: d.razao_social ?? "",
        fantasia: d.nome_fantasia || undefined,
        city: d.municipio ?? "",
        state: d.uf ?? "",
      });
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Erro ao consultar CNPJ.");
    } finally {
      setFetching(false);
    }
  }

  function handleCnpjChange(raw: string) {
    setCnpj(maskCnpj(raw));
    setCompany(null);
    setFetchError("");
  }

  const digits = cleanCnpj(cnpj);
  const canLookup = digits.length === 14;
  const canProceed = company !== null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c349] mb-1">Etapa 1 de 3</p>
        <h2 className="text-2xl font-light text-white">Dados da Empresa</h2>
        <p className="mt-1 text-xs text-[#c4c7c7]/60">
          Informe o CNPJ e buscaremos automaticamente os dados cadastrais.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">
          CNPJ *
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">
              badge
            </span>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => handleCnpjChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canLookup && lookup()}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-[#c4c7c7]/30 focus:border-[#e9c349] focus:outline-none transition-all"
            />
          </div>
          <button
            type="button"
            onClick={lookup}
            disabled={!canLookup || fetching}
            className="rounded-xl border border-[#e9c349]/30 bg-[#e9c349]/10 px-5 text-xs font-bold uppercase tracking-widest text-[#e9c349] transition hover:bg-[#e9c349]/20 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {fetching ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border border-[#e9c349] border-t-transparent" />
                Buscando...
              </span>
            ) : "Buscar dados"}
          </button>
        </div>
        {fetchError && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="material-symbols-outlined text-sm">error</span>
            {fetchError}
          </p>
        )}
      </div>

      {company && (
        <div className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-sm text-[#e9c349]">verified</span>
            <p className="text-xs font-semibold text-[#e9c349] uppercase tracking-wider">Empresa encontrada</p>
          </div>

          <div className="space-y-3">
            <ReadonlyField label="Razão Social" value={company.name} icon="store" />
            {company.fantasia && (
              <ReadonlyField label="Nome Fantasia" value={company.fantasia} icon="label" />
            )}
            <div className="grid grid-cols-2 gap-3">
              <ReadonlyField label="Cidade" value={company.city} icon="location_city" />
              <ReadonlyField label="Estado" value={company.state} icon="map" />
            </div>
          </div>

          <p className="text-[0.65rem] text-[#c4c7c7]/40 leading-relaxed">
            Dados obtidos da Receita Federal via BrasilAPI. Se houver divergência, entre em contato com suporte.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="w-full rounded-xl bg-[#e9c349] hover:bg-[#ffe28a] text-[#101414] py-3.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(233,195,73,0.15)]"
      >
        Continuar
      </button>
    </div>
  );
}

function ReadonlyField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div>
      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-widest text-[#c4c7c7]/50">{label}</p>
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
        <span className="material-symbols-outlined text-sm text-[#e9c349]/60">{icon}</span>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

// ─── Step 2 — Responsável ─────────────────────────────────────────────────────

function Step2({
  contactName, setContactName,
  email, setEmail,
  phone, setPhone,
  onBack, onNext,
}: {
  contactName: string; setContactName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c349] mb-1">Etapa 2 de 3</p>
        <h2 className="text-2xl font-light text-white">Responsável pelo Acesso</h2>
        <p className="mt-1 text-xs text-[#c4c7c7]/60">Dados de quem vai administrar a conta.</p>
      </div>

      <div className="space-y-4">
        <InputField
          label="Nome do Responsável *"
          icon="person"
          type="text"
          value={contactName}
          onChange={setContactName}
          placeholder="Nome completo"
          required
        />
        <InputField
          label="E-mail Corporativo *"
          icon="mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="contato@funeraria.com"
          required
        />
        <InputField
          label="Telefone de Contato *"
          icon="call"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="(00) 99999-9999"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 px-5 py-3.5 text-xs font-semibold text-[#c4c7c7] transition hover:border-white/30"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-[#e9c349] hover:bg-[#ffe28a] text-[#101414] py-3.5 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(233,195,73,0.15)]"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}

// ─── Step 3 — Senha ───────────────────────────────────────────────────────────

function Step3({
  password, setPassword,
  confirmPassword, setConfirmPassword,
  onBack,
  onSubmit,
  isLoading,
  error,
}: {
  password: string; setPassword: (v: string) => void;
  confirmPassword: string; setConfirmPassword: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c349] mb-1">Etapa 3 de 3</p>
        <h2 className="text-2xl font-light text-white">Crie sua Senha</h2>
        <p className="mt-1 text-xs text-[#c4c7c7]/60">Mínimo 8 caracteres. Guarde-a em local seguro.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">
            Senha de Acesso *
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">lock</span>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-12 py-3.5 text-sm text-white placeholder:text-[#c4c7c7]/30 focus:border-[#e9c349] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c7c7]/40 hover:text-[#c4c7c7] transition"
            >
              <span className="material-symbols-outlined text-sm">{showPwd ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">
            Confirmar Senha *
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">lock_reset</span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
              placeholder="Repita a senha"
              className={`w-full rounded-xl border bg-black/30 pl-10 pr-12 py-3.5 text-sm text-white placeholder:text-[#c4c7c7]/30 focus:outline-none transition-all ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500/60 focus:border-red-500"
                  : "border-white/15 focus:border-[#e9c349]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c7c7]/40 hover:text-[#c4c7c7] transition"
            >
              <span className="material-symbols-outlined text-sm">{showConfirm ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <span className="material-symbols-outlined text-sm">error</span>
              As senhas não conferem.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 px-5 py-3.5 text-xs font-semibold text-[#c4c7c7] transition hover:border-white/30 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar
        </button>
        <button
          type="submit"
          disabled={isLoading || !password || password !== confirmPassword}
          className="flex-1 rounded-xl bg-[#e9c349] hover:bg-[#ffe28a] text-[#101414] py-3.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(233,195,73,0.15)]"
        >
          {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
        </button>
      </div>
    </form>
  );
}

// ─── Generic input helper ─────────────────────────────────────────────────────

function InputField({
  label, icon, type, value, onChange, placeholder, required,
}: {
  label: string;
  icon: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-[#c4c7c7]/30 focus:border-[#e9c349] focus:outline-none transition-all"
        />
      </div>
    </div>
  );
}

// ─── Pending screen ───────────────────────────────────────────────────────────

function PendingScreen() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 mb-6">
          <span className="material-symbols-outlined text-4xl text-[#e9c349]">hourglass_top</span>
        </div>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e9c349] mb-2">Cadastro enviado</p>
        <h1 className="text-3xl font-light text-white mb-4">Aguardando aprovação</h1>
        <p className="text-[#c4c7c7] text-sm leading-relaxed mb-8">
          Seu cadastro foi recebido com sucesso. O administrador será notificado e
          liberará seu acesso em breve. Você receberá confirmação por e-mail.
        </p>
        <Link
          href="/funeraria/login"
          className="inline-block rounded-xl border border-[#e9c349]/30 px-8 py-3 text-sm font-semibold text-[#e9c349] transition hover:bg-[#e9c349]/10"
        >
          Ir para o login
        </Link>
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPendente = searchParams.get("status") === "pendente";
  const inviteSlug = searchParams.get("invite") ?? "";

  const [step, setStep] = useState(0);

  // Step 1
  const [cnpj, setCnpj] = useState("");
  const [company, setCompany] = useState<CompanyData | null>(null);

  // Step 2
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 3
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (password !== confirmPassword) { setError("As senhas não conferem."); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/funeral-auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: company?.fantasia || company?.name || "",
          contactName,
          email,
          phone,
          cnpj: cleanCnpj(cnpj),
          city: company?.city || "",
          state: company?.state || "",
          password,
          confirmPassword,
          inviteSlug: inviteSlug || undefined,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Erro ao cadastrar.");
      router.push("/funeraria/cadastro?status=pendente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isPendente) return <PendingScreen />;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-16 px-4 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#e9c349]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 mb-3 shadow-[0_0_20px_rgba(233,195,73,0.15)]">
            <span className="material-symbols-outlined text-2xl text-[#e9c349]">add_business</span>
          </div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c349]">Seja um Parceiro</p>
          <h1 className="font-h2 text-[clamp(1.75rem,4vw,2.5rem)] text-white mt-1 font-light">
            Cadastro de Funerária
          </h1>
        </div>

        {inviteSlug && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 px-4 py-3">
            <span className="material-symbols-outlined text-[#e9c349]">handshake</span>
            <p className="text-xs text-[#c4c7c7]/80">
              Cadastro via <strong className="text-[#e9c349]">convite exclusivo</strong> — condições
              comerciais pré-configuradas serão aplicadas automaticamente ao finalizar.
            </p>
          </div>
        )}

        <StepBar current={step} />

        <div className="rounded-2xl border border-white/10 bg-[#0a192f66] backdrop-blur-[20px] p-6 md:p-8 shadow-2xl">
          {step === 0 && (
            <Step1
              cnpj={cnpj}
              setCnpj={setCnpj}
              company={company}
              setCompany={setCompany}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <Step2
              contactName={contactName} setContactName={setContactName}
              email={email} setEmail={setEmail}
              phone={phone} setPhone={setPhone}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step3
              password={password} setPassword={setPassword}
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/funeraria/login" className="text-xs text-[#c4c7c7]/40 hover:text-[#e9c349] transition">
            Já tenho cadastro → Login
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#c4c7c7]/30 hover:text-[#c4c7c7]/60 transition">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FunerariaCadastroPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0a192f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e9c349] border-t-transparent" />
      </div>
    }>
      <CadastroContent />
    </Suspense>
  );
}
