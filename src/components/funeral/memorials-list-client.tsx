"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FuneralMemorial } from "@/src/components/funeral/memorial-data";
import { MemorialStatusBadge } from "@/src/components/funeral/status-badge";
import { FuneralEmptyState } from "@/src/components/funeral/empty-state";
import { fmtDateBR } from "@/src/components/funeral/format";

type Filter = "todos" | "ativo" | "rascunho";

export function MemorialsListClient({ memorials }: { memorials: FuneralMemorial[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return memorials.filter((m) => {
      if (filter !== "todos" && m.status !== filter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      );
    });
  }, [memorials, query, filter]);

  if (memorials.length === 0) {
    return (
      <FuneralEmptyState
        icon="auto_stories"
        title="Nenhum memorial cadastrado ainda"
        description="Cadastre o primeiro falecido para gerar um memorial digital com QR Code."
        actionHref="/funeraria/dashboard/novo-memorial"
        actionLabel="Cadastrar falecido"
      />
    );
  }

  const counts = {
    todos: memorials.length,
    ativo: memorials.filter((m) => m.status === "ativo").length,
    rascunho: memorials.filter((m) => m.status === "rascunho").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#c4c7c7]/40">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="w-full rounded-lg border border-white/10 bg-[#0a192f66] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-[#e9c349]/40 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5">
          {(["todos", "ativo", "rascunho"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                filter === f
                  ? "border-[#e9c349]/40 bg-[#e9c349]/10 text-[#e9c349]"
                  : "border-white/10 text-[#c4c7c7]/60 hover:text-white"
              }`}
            >
              {f === "todos" ? "Todos" : f === "ativo" ? "Publicados" : "Rascunhos"} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-[#c4c7c7]/50">
          Nenhum memorial encontrado para essa busca.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MemorialCard key={m.id} memorial={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function yearOf(iso: string): string {
  if (!iso) return "?";
  const year = new Date(iso).getFullYear();
  return Number.isFinite(year) ? String(year) : "?";
}

function MemorialCard({ memorial }: { memorial: FuneralMemorial }) {
  const years = memorial.birthDate || memorial.deathDate ? `${yearOf(memorial.birthDate)} – ${yearOf(memorial.deathDate)}` : null;
  const publicUrl = `/memorial-publico?memorial=${memorial.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a192f66] transition hover:border-[#e9c349]/20">
      <div className="relative h-32 shrink-0 bg-black/30">
        <Image
          src={memorial.imageUrl || "/images/hero-bg.png"}
          alt={memorial.name}
          fill
          className="object-cover grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-3.5 right-3.5">
          <h3 className="truncate font-semibold text-white">{memorial.name}</h3>
          {years && <p className="text-xs text-white/50">{years}</p>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <MemorialStatusBadge status={memorial.status} />
          <span className="text-[0.65rem] text-[#c4c7c7]/40">{fmtDateBR(memorial.createdAt)}</span>
        </div>
        {memorial.city && <p className="text-xs text-[#c4c7c7]/60">{memorial.city}</p>}

        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={`/funeraria/dashboard/novo-memorial/${memorial.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e9c349]/30 py-2 text-xs font-medium text-[#e9c349] transition hover:bg-[#e9c349]/5"
          >
            <span className="material-symbols-outlined text-sm">{memorial.status === "rascunho" ? "edit_note" : "edit"}</span>
            {memorial.status === "rascunho" ? "Continuar" : "Editar"}
          </Link>

          {memorial.status === "ativo" && (
            <>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver memorial público"
                className="flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-[#c4c7c7]/70 transition hover:border-white/20 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
              <Link
                href={`/funeraria/dashboard/imprimir?select=${memorial.id}`}
                title="Imprimir QR"
                className="flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-[#c4c7c7]/70 transition hover:border-white/20 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
