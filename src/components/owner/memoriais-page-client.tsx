"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CriarMemorialForm } from "@/src/components/owner/criar-memorial-form";
import type { ManagedMemorial } from "@/src/lib/platform-data";

type Props = {
  memorials: ManagedMemorial[];
};

function StatusBadge({ status }: { status: ManagedMemorial["status"] }) {
  const label = status === "ativo" ? "Ativo" : status === "pending_payment" ? "Aguardando pagamento" : "Rascunho";
  const tone =
    status === "ativo"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
      : status === "pending_payment"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
        : "border-outline-variant/30 bg-surface-variant text-on-surface-variant";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
}

function MemorialRow({ memorial }: { memorial: ManagedMemorial }) {
  const birthStr = memorial.birthDate ? new Date(memorial.birthDate).toLocaleDateString("pt-BR") : "—";
  const deathStr = memorial.deathDate ? new Date(memorial.deathDate).toLocaleDateString("pt-BR") : "—";

  return (
    <tr className="border-b border-outline-variant/15 hover:bg-surface-variant/20">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-variant">
            <Image src={memorial.imageUrl || "/images/hero-bg.png"} alt={memorial.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-on-surface">{memorial.name}</p>
            {memorial.nickname && <p className="truncate text-xs text-outline">&quot;{memorial.nickname}&quot;</p>}
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-xs text-outline">{birthStr} — {deathStr}</td>
      <td className="px-5 py-4 text-on-surface-variant">{memorial.city || "—"}</td>
      <td className="px-5 py-4">
        <span className="flex items-center gap-1 text-tertiary">
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span className="font-semibold">{memorial.visits}</span>
        </span>
      </td>
      <td className="px-5 py-4"><StatusBadge status={memorial.status} /></td>
      <td className="px-5 py-4">
        <a
          href={`/memorial-publico?memorial=${memorial.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-on-surface-variant transition hover:text-tertiary"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          Ver
        </a>
      </td>
    </tr>
  );
}

export function MemoriaisPageClient({ memorials }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ManagedMemorial["status"]>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return memorials.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (!term) return true;
      return (
        m.name.toLowerCase().includes(term) ||
        (m.nickname ?? "").toLowerCase().includes(term) ||
        (m.city ?? "").toLowerCase().includes(term)
      );
    });
  }, [memorials, search, statusFilter]);

  function handleClose() {
    setShowForm(false);
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
          <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Memoriais</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Todos os memoriais criados na plataforma.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-tertiary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-tertiary/85"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Criar memorial
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center rounded-full border border-outline-variant/40 bg-surface-container-low px-4 py-2">
          <span className="material-symbols-outlined mr-2 text-outline text-[18px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, apelido ou cidade..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          {([
            { id: "all", label: "Todos" },
            { id: "ativo", label: "Ativos" },
            { id: "pending_payment", label: "Aguardando" },
            { id: "rascunho", label: "Rascunhos" },
          ] as const).map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                statusFilter === f.id ? "border-tertiary/40 bg-tertiary/10 text-tertiary" : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="rounded-full bg-tertiary/10 px-3.5 py-1.5 text-xs font-semibold text-tertiary">
          {filtered.length} de {memorials.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline">
                <th className="px-5 py-3 font-normal">Ente querido</th>
                <th className="px-5 py-3 font-normal">Nascimento — Falecimento</th>
                <th className="px-5 py-3 font-normal">Cidade</th>
                <th className="px-5 py-3 font-normal">Visitas</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal">Link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-on-surface-variant">
                    {memorials.length === 0 ? "Nenhum memorial cadastrado na plataforma ainda." : "Nenhum memorial encontrado para essa busca."}
                  </td>
                </tr>
              ) : (
                filtered.map((m) => <MemorialRow key={m.id} memorial={m} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-outline-variant/30 bg-surface-container p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary/10">
                  <span className="material-symbols-outlined text-base text-tertiary">local_fire_department</span>
                </div>
                <div>
                  <h2 className="font-h3 text-lg text-on-surface">Novo memorial</h2>
                  <p className="text-xs text-on-surface-variant">Criação gratuita — acesso imediato</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <CriarMemorialForm onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
}
