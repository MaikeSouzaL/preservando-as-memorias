"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FunerariaCadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    cnpj: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/funeral-auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Erro ao cadastrar.");
      }

      // Auto-login after register
      const loginResponse = await fetch("/api/funeral-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (loginResponse.ok) {
        router.push("/funeraria/dashboard");
      } else {
        router.push("/funeraria/login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-16 px-4 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#e9c349]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 animate-fade-in">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 mb-4 shadow-[0_0_20px_rgba(233,195,73,0.15)]">
            <span className="material-symbols-outlined text-3xl text-[#e9c349] animate-pulse">add_business</span>
          </div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e9c349]">Seja um Parceiro</p>
          <h1 className="font-h2 text-[clamp(2rem,4vw,2.75rem)] text-white mt-1.5 font-light">
            Cadastro de Funerária
          </h1>
          <p className="text-[#c4c7c7] text-xs max-w-md mx-auto mt-2 leading-relaxed">
            Crie sua conta corporativa para gerenciar memoriais digitais interativos e oferecer essa inovação aos seus clientes.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400 text-xs tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#0a192f66] backdrop-blur-[20px] p-6 md:p-10 shadow-2xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Nome da Funerária *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">store</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Funerária Florescer"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Nome do Responsável *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">person</span>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                CNPJ (Opcional)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">badge</span>
                <input
                  type="text"
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                E-mail Corporativo *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">mail</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contato@funeraria.com"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Telefone de Contato *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">call</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(00) 99999-9999"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Cidade
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">location_on</span>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Sua cidade"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Estado (UF)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">map</span>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Ex: SP"
                  maxLength={2}
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Senha de Acesso *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">lock</span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-white/15 bg-black/30 pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#c4c7c7]/40 focus:border-[#e9c349] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-[#c4c7c7] font-semibold">
                Confirmar Senha *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#c4c7c7]/50">lock_reset</span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a senha"
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
            {isLoading ? "Criando Credenciais..." : "Finalizar Cadastro Corporativo"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#c4c7c7]/60">
              Sua funerária já possui cadastro?{" "}
              <Link href="/funeraria/login" className="text-[#e9c349] hover:underline font-semibold transition">
                Faça login
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
