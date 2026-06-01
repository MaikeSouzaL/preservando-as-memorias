"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Memorial = {
  id: string;
  name: string;
  years: string;
  epitaph: string;
  imageUrl: string;
  visits: number;
  tributes: number;
  candles: number;
  status: string;
  createdAt: string;
};

export default function MemoriaisListaPage() {
  const [search, setSearch] = useState("");
  const [memorials, setMemorials] = useState<Memorial[]>([]);

  useEffect(() => {
    fetch("/api/memorials")
      .then((response) => response.json())
      .then((payload) => {
        if (!Array.isArray(payload.memorials)) return;
        const normalized = payload.memorials.map((item: Memorial & { birthDate?: string; deathDate?: string; biography?: string }) => ({
          id: item.id,
          name: item.name,
          years:
            item.years ||
            [item.birthDate, item.deathDate]
              .filter(Boolean)
              .map((date) => new Date(date as string).getFullYear())
              .join(" - "),
          epitaph: item.epitaph || item.biography || "Memorial preservado com carinho.",
          imageUrl: item.imageUrl || "/images/hero-bg.png",
          visits: item.visits ?? 0,
          tributes: item.tributes ?? 0,
          candles: item.candles ?? 0,
          status: item.status ?? "ativo",
          createdAt: item.createdAt,
        }));
        setMemorials(normalized);
      })
      .catch(() => undefined);
  }, []);

  const filteredMemorials = useMemo(() => {
    return memorials.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.years.includes(search)
    );
  }, [memorials, search]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-tertiary/5 blur-[100px]" />

      <header className="relative mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
            Memoriais
          </p>
          <h1 className="font-h1 text-[clamp(2.3rem,5vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface">
            Meus Memoriais
          </h1>
          <p className="mt-2 max-w-2xl text-on-surface-variant">
            Gerencie e preserve o legado digital e a história dos seus entes queridos de forma integrada.
          </p>
        </div>
        <Link
          href="/memoriais/criar"
          className="rounded-lg bg-tertiary px-6 py-3 text-center text-sm font-semibold text-on-tertiary shadow-[0_0_20px_rgba(233,195,73,0.3)] transition-all duration-300 hover:bg-tertiary-fixed shrink-0"
        >
          + Novo Memorial
        </Link>
      </header>

      {/* Busca */}
      <div className="mb-10 max-w-md relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
        <input
          type="text"
          placeholder="Buscar memorial por nome ou ano..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-tertiary/10 bg-[#0a192f]/40 py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary/40 focus:outline-none focus:ring-1 focus:ring-tertiary/40 backdrop-blur-md transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 text-on-surface-variant hover:text-tertiary"
          >
            <span className="material-symbols-outlined text-[1.2rem]">close</span>
          </button>
        )}
      </div>

      {/* Grid de Memoriais */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredMemorials.map((memorial) => (
          <article
            key={memorial.id}
            className="group overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f]/40 backdrop-blur-[20px] transition duration-500 hover:scale-[1.02]"
          >
            <div className="relative h-60">
              <Image
                src={memorial.imageUrl}
                alt={memorial.name}
                fill
                className="object-cover grayscale-[30%] transition duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,25,47,0.95)_0%,rgba(10,25,47,0.3)_50%,transparent_100%)]" />
              <div className="absolute bottom-4 left-6 right-6">
                <h4 className="font-h2 text-[1.75rem] leading-[1.2] text-on-surface">{memorial.name}</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">{memorial.years}</p>
                <p className="italic text-tertiary/90 text-sm mt-1.5 line-clamp-1">{`"${memorial.epitaph}"`}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 flex items-center justify-between border-b border-tertiary/10 pb-4 text-on-surface-variant text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1.1rem]">visibility</span>
                  <span>{memorial.visits} visitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1.1rem]">volunteer_activism</span>
                  <span>{memorial.tributes} homenagens</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1.1rem]">local_fire_department</span>
                  <span>{memorial.candles} velas</span>
                </div>
              </div>

               <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/memorial-publico?memorial=${memorial.id}`}
                  target="_blank"
                  className="rounded-full border border-tertiary/50 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/5"
                >
                  Abrir memorial
                </Link>
                <div className="flex gap-1.5">
                  <Link
                    href={`/memoriais/criar?edit=${memorial.id}`}
                    title="Editar Memorial"
                    className="p-2 rounded-full hover:bg-tertiary/10 text-on-surface-variant transition hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-[1.2rem]">edit</span>
                  </Link>
                  <a
                    href={`/memorial-publico?memorial=${memorial.id}`}
                    target="_blank"
                    title="Visualizar Memorial & QR Code"
                    className="p-2 rounded-full hover:bg-tertiary/10 text-on-surface-variant transition hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-[1.2rem]">qr_code_2</span>
                  </a>
                  <button
                    title="Compartilhar"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/memorial-publico?memorial=${memorial.id}`);
                      alert("Link do memorial copiado para a área de transferência!");
                    }}
                    className="p-2 rounded-full hover:bg-tertiary/10 text-on-surface-variant transition hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-[1.2rem]">share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Card Criar Novo */}
        <Link
          href="/memoriais/criar"
          className="flex min-h-[22rem] flex-col items-center justify-center rounded-xl border border-dashed border-tertiary/30 bg-[#0a192f]/10 transition hover:bg-tertiary/5 text-center p-6 group"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tertiary/10 text-tertiary group-hover:scale-110 transition duration-300">
            <span className="material-symbols-outlined text-[2rem]">add</span>
          </div>
          <h4 className="mb-2 font-h3 text-[1.5rem] text-on-surface">Criar novo memorial</h4>
          <p className="text-on-surface-variant max-w-[240px] text-sm">
            Inicie a preservação de uma nova história de vida para sua família.
          </p>
        </Link>
      </div>

      {filteredMemorials.length === 0 && (
        <div className="text-center py-20 bg-[#0a192f]/20 rounded-xl border border-tertiary/10">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4">search_off</span>
          <p className="text-on-surface-variant text-lg">{`Nenhum memorial encontrado para "${search}"`}</p>
        </div>
      )}
    </div>
  );
}
