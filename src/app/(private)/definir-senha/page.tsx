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

    if (password.length < 8) {
      return setError("A senha precisa ter pelo menos 8 caracteres.");
    }
    if (password !== confirm) {
      return setError("As senhas não coincidem.");
    }

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
    <main className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tertiary/10">
            <span className="material-symbols-outlined text-2xl text-tertiary">lock</span>
          </div>
          <h1 className="font-h2 text-2xl text-on-surface">Crie sua senha</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Defina uma senha para acessar seu dashboard quando quiser.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-tertiary/10 bg-[#0a192f]/60 p-7"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant">Nova senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-tertiary/40"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant">Confirmar senha</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-tertiary/40"
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-tertiary py-3 text-sm font-bold uppercase tracking-widest text-[#101414] transition hover:bg-tertiary/80 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
