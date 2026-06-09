"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");

    setSaving(true);
    try {
      const res = await fetch("/api/auth/definir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? "Não foi possível salvar a senha.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-[#0b0f0f] px-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-[#e9c349]/4 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Ícone */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10">
            <span className="material-symbols-outlined text-3xl text-[#e9c349]">lock</span>
          </div>
          <h1 className="font-serif text-2xl font-light text-[#e9c349]">Bem-vindo!</h1>
          <p className="mt-2 text-sm text-[#c4c7c7]/70">
            Seu memorial foi criado. Agora defina uma senha para acessar seu dashboard sempre que precisar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-[#0a192f]/60 p-7"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Nova senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoFocus
              className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Confirmar senha</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e9c349] py-3 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Acessar meu dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
