"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuickCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", nickname: "", birthDate: "", deathDate: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/funeral-auth/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Erro ao criar memorial.");
      router.push(`/funeraria/dashboard/novo-memorial/${payload.memorial.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar memorial.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-5 rounded-xl border border-white/10 bg-[#0a192f66] p-6 shadow-2xl md:p-8"
    >
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Nome completo *</label>
        <input
          type="text"
          autoFocus
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Nome completo do falecido"
          className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-3 text-base text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Como era chamado(a) (opcional)</label>
        <input
          type="text"
          value={form.nickname}
          onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
          placeholder="Ex: Seu João, Vovó Maria..."
          className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-3 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Nascimento</label>
          <input
            type="date"
            value={form.birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-3 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Falecimento</label>
          <input
            type="date"
            value={form.deathDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm((p) => ({ ...p, deathDate: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-3 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Cidade (opcional)</label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          placeholder="Ex: Belo Horizonte - MG"
          className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-3 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !form.name.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e9c349] px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#101414] shadow-xl shadow-[#e9c349]/10 transition hover:bg-[#ffe088] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
        {submitting ? "Criando..." : "Continuar"}
      </button>
      <p className="text-center text-[0.7rem] text-[#c4c7c7]/40">
        O rascunho já fica salvo — você pode completar foto, epitáfio e história a qualquer momento.
      </p>
    </form>
  );
}
