"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function NovaSenhaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const payload = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(payload.error ?? "Não foi possível redefinir a senha.");
      return;
    }

    setDone(true);
  }

  if (!token) {
    return (
      <Section>
        <p className="text-center text-on-surface-variant">Link inválido ou incompleto.</p>
        <Link href="/recuperar-senha" className="mt-4 block text-center text-sm text-tertiary hover:underline">
          Solicitar novo link
        </Link>
      </Section>
    );
  }

  if (done) {
    return (
      <Section>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9c349]/10 text-[#e9c349]">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h1 className="font-h3 text-[1.75rem] text-on-surface">Senha redefinida!</h1>
          <p className="mt-3 text-on-surface-variant">
            Sua senha foi atualizada com sucesso. Faça login para continuar.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-[#e9c349] px-8 py-3 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-[#1c1b1b] transition hover:bg-[#ffe088]"
          >
            Ir para o login
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="mb-8 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Redefinição de senha
        </p>
        <h1 className="font-h3 text-[1.75rem] text-on-surface">Criar nova senha</h1>
        <p className="mt-2 text-on-surface-variant">Escolha uma senha forte com pelo menos 8 caracteres.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="grid gap-2">
          <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
            Nova senha
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.12em] text-on-surface-variant">
            Confirmar nova senha
          </span>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repita a senha"
            className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#e9c349] py-3 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </Section>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1200px] items-center px-gutter py-14">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-tertiary/15 bg-surface-container/75 p-8 backdrop-blur-xl">
        {children}
      </section>
    </main>
  );
}

export default function NovaSenhaPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-on-surface-variant">Carregando...</p>
      </main>
    }>
      <NovaSenhaContent />
    </Suspense>
  );
}
