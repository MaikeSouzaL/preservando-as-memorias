"use client";

import { useState } from "react";
import Image from "next/image";
import { CriarMemorialForm } from "@/src/components/admin/criar-memorial-form";
import type { ManagedMemorial } from "@/src/lib/platform-data";

type Props = {
  memorials: ManagedMemorial[];
  adminUserId: string;
};

function MemorialTable({ rows, emptyLabel }: { rows: ManagedMemorial[]; emptyLabel: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant/50 text-outline">
            <th className="pb-3 font-normal">Ente Querido</th>
            <th className="pb-3 font-normal">Epitáfio</th>
            <th className="pb-3 font-normal">Nascimento / Falecimento</th>
            <th className="pb-3 font-normal">Cidade</th>
            <th className="pb-3 font-normal">Visitas</th>
            <th className="pb-3 font-normal">Status</th>
            <th className="pb-3 font-normal">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-sm text-on-surface-variant/60">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((memorial) => {
              const birthStr = memorial.birthDate
                ? new Date(memorial.birthDate).toLocaleDateString("pt-BR")
                : "---";
              const deathStr = memorial.deathDate
                ? new Date(memorial.deathDate).toLocaleDateString("pt-BR")
                : "---";

              return (
                <tr
                  key={memorial.id}
                  className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-outline-variant bg-surface-variant">
                        <Image
                          src={memorial.imageUrl || "/images/hero-bg.png"}
                          alt={memorial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">{memorial.name}</span>
                        {memorial.nickname && (
                          <span className="text-xs text-outline">"{memorial.nickname}"</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs truncate py-4 text-on-surface-variant">
                    {memorial.epitaph}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col text-xs text-outline">
                      <span>Nasceu: {birthStr}</span>
                      <span>Faleceu: {deathStr}</span>
                    </div>
                  </td>
                  <td className="py-4 text-outline">{memorial.city || "Não informada"}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-tertiary">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span className="font-semibold">{memorial.visits}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        memorial.status === "ativo"
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                          : memorial.status === "pending_payment"
                          ? "border border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                          : "bg-surface-variant text-outline"
                      }`}
                    >
                      {memorial.status === "ativo"
                        ? "Ativo"
                        : memorial.status === "pending_payment"
                        ? "Aguardando pagamento"
                        : "Rascunho"}
                    </span>
                  </td>
                  <td className="py-4">
                    <a
                      href={`/memorial-publico?memorial=${memorial.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-on-surface-variant transition hover:text-[#e9c349]"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Ver
                    </a>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function MemoriaisPageClient({ memorials, adminUserId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState(memorials);

  const myMemorials = list.filter((m) => m.ownerId === adminUserId);
  const clientMemorials = list.filter((m) => m.ownerId !== adminUserId);

  function handleClose() {
    setShowForm(false);
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-h3 text-2xl text-on-surface">Memoriais</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            Gerencie todos os memoriais da plataforma.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-tertiary/10 px-4 py-1 text-sm font-semibold text-tertiary">
            Total: {list.length}
          </span>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-[#e9c349] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088]"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Criar memorial
          </button>
        </div>
      </div>

      {/* Seção: Meus memoriais */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-[18px] text-tertiary">manage_accounts</span>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-tertiary">
            Criados por mim
          </h4>
          <span className="rounded-full bg-tertiary/10 px-2.5 py-0.5 text-xs font-semibold text-tertiary">
            {myMemorials.length}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
          <MemorialTable
            rows={myMemorials}
            emptyLabel='Nenhum memorial criado por você ainda. Clique em "Criar memorial" para começar.'
          />
        </div>
      </section>

      {/* Seção: Memoriais de clientes */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">group</span>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Memoriais de clientes
          </h4>
          <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant">
            {clientMemorials.length}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-[#0a192f66] p-6 backdrop-blur-md">
          <MemorialTable
            rows={clientMemorials}
            emptyLabel="Nenhum cliente cadastrou memoriais ainda."
          />
        </div>
      </section>

      {/* Modal: Criar Memorial */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-outline-variant/20 bg-[#0f1c1c] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c349]/10">
                  <span className="material-symbols-outlined text-base text-[#e9c349]">
                    local_fire_department
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-light text-[#e9c349]">Novo Memorial</h2>
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
