"use client";

import { useMemo, useState } from "react";

export type OwnerUserRow = {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
  plan: string;
  memorialsCount: number;
  createdAt: string;
  lastSeenAt: string | null;
};

function lastSeenLabel(lastSeenAt: string | null) {
  if (!lastSeenAt) return { text: "Nunca entrou", tone: "text-outline" };
  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);
  if (diffH < 1) return { text: "Agora há pouco", tone: "text-emerald-400" };
  if (diffH < 24) return { text: `Há ${diffH}h`, tone: "text-emerald-400" };
  if (diffD === 1) return { text: "Ontem", tone: "text-on-surface-variant" };
  if (diffD < 30) return { text: `Há ${diffD} dias`, tone: "text-on-surface-variant" };
  return { text: `Há ${diffD} dias`, tone: "text-outline" };
}

export function UsersPageClient({ users }: { users: OwnerUserRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, search]);

  const active30d = users.filter((u) => {
    if (!u.lastSeenAt) return false;
    return Date.now() - new Date(u.lastSeenAt).getTime() <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Usuários</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Todas as contas cadastradas na plataforma.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
          <p className="text-xs uppercase tracking-wider text-outline">Total cadastrados</p>
          <p className="mt-1 text-2xl font-semibold text-on-surface">{users.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-xs uppercase tracking-wider text-emerald-400/80">Ativos nos últimos 30 dias</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">{active30d}</p>
        </div>
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
          <p className="text-xs uppercase tracking-wider text-outline">Nunca entraram</p>
          <p className="mt-1 text-2xl font-semibold text-on-surface">{users.filter((u) => !u.lastSeenAt).length}</p>
        </div>
      </div>

      <div className="flex items-center rounded-full border border-outline-variant/40 bg-surface-container-low px-4 py-2 sm:max-w-sm">
        <span className="material-symbols-outlined mr-2 text-outline text-[18px]">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline">
                <th className="px-5 py-3 font-normal">Nome</th>
                <th className="px-5 py-3 font-normal">E-mail</th>
                <th className="px-5 py-3 font-normal">Memoriais</th>
                <th className="px-5 py-3 font-normal">Cadastro</th>
                <th className="px-5 py-3 font-normal">Última entrada</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-on-surface-variant">
                    {users.length === 0 ? "Nenhum usuário cadastrado ainda." : "Nenhum usuário encontrado para essa busca."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const seen = lastSeenLabel(u.lastSeenAt);
                  return (
                    <tr key={u.id} className="border-b border-outline-variant/15 hover:bg-surface-variant/20">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-on-surface">{u.name}</span>
                          {u.isOwner && (
                            <span className="rounded bg-tertiary/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-tertiary">
                              Dono
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-on-surface-variant">{u.email}</td>
                      <td className="px-5 py-4 text-on-surface-variant">{u.memorialsCount}</td>
                      <td className="px-5 py-4 text-outline">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td className={`px-5 py-4 ${seen.tone}`}>{seen.text}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
