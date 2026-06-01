"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FunerariaLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/funeral-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Credenciais inválidas.");
      }

      router.push("/funeraria/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#e9c349]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 mb-4 shadow-[0_0_20px_rgba(233,195,73,0.15)]">
            <span className="material-symbols-outlined text-3xl text-[#e9c349] animate-pulse">corporate_fare</span>
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e9c349]">Painel do Parceiro</p>
          <h1 className="font-h2 text-3xl text-white mt-1.5 font-light">Acesso Funerária</h1>
          <p className="text-[#c4c7c7] text-xs max-w-xs mx-auto mt-2 leading-relaxed">
            Entre com suas credenciais corporativas para gerenciar memoriais digitais e serviços.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400 text-xs tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#0a192f66] backdrop-blur-[20px] p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">E-mail Corporativo</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">mail</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="parceiro@suafuneraria.com"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">Senha de Acesso</label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">lock</span>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Sua senha de segurança"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full rounded-xl bg-[#e9c349] hover:bg-[#ffe28a] text-[#101414] py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-wait shadow-[0_4px_20px_rgba(233,195,73,0.15)] hover:shadow-[0_4px_25px_rgba(233,195,73,0.3)] cursor-pointer"
          >
            {isLoading ? "Autenticando..." : "Entrar no Painel"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#c4c7c7]/60">
              Sua funerária ainda não é parceira?{" "}
              <Link href="/funeraria/cadastro" className="text-[#e9c349] hover:underline font-semibold transition">
                Cadastre-se grátis
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#c4c7c7]/40 hover:text-[#e9c349] transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
