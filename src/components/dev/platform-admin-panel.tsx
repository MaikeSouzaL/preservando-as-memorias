"use client";

import { useEffect, useState } from "react";

type AdminInfo = {
  email: string;
  name: string | null;
  createdAt: string | null;
} | null;

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  is_admin: boolean;
  created_at: string | null;
};

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  grossRevenueCents: number;
  systemCutCents: number;
  adminRepasseCents: number;
  commissionPercent: number;
};

export function PlatformAdminPanel({ grossRevenueCents, systemCutCents, adminRepasseCents, commissionPercent }: Props) {
  const [admin, setAdmin] = useState<AdminInfo>(undefined as unknown as AdminInfo);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dev/platform-admin").then((r) => r.json()),
      fetch("/api/dev/users").then((r) => r.json()),
    ]).then(([adminData, usersData]) => {
      setAdmin(adminData.admin);
      setUsers(usersData.users ?? []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleDesignar(email: string) {
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/dev/platform-admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage({ text: data.error ?? "Erro ao designar admin.", ok: false });
      return;
    }

    setAdmin(data.admin);
    setUsers((prev) => prev.map((u) => ({ ...u, is_admin: u.email === email })));
    setMessage({ text: `${data.admin.name ?? data.admin.email} é agora o admin da plataforma.`, ok: true });
  }

  async function handleRevogar() {
    if (!confirm("Remover o admin atual? O painel admin ficará sem dono até você designar outro.")) return;
    setSaving(true);
    await fetch("/api/dev/platform-admin", { method: "DELETE" });
    setAdmin(null);
    setUsers((prev) => prev.map((u) => ({ ...u, is_admin: false })));
    setSaving(false);
    setMessage({ text: "Admin removido com sucesso.", ok: true });
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Revenue summary */}
      <div className="rounded-xl border border-[#e9c349]/15 bg-[#0d1b2a]/60 p-6">
        <p className="mb-4 text-[0.7rem] uppercase tracking-[0.15em] text-[#e9c349]">Receita do sistema</p>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Bruto" value={brl(grossRevenueCents)} />
          <Stat label={`Meu repasse (${commissionPercent}%)`} value={brl(systemCutCents)} highlight />
          <Stat label={`Admin (${100 - commissionPercent}%)`} value={brl(adminRepasseCents)} />
        </div>
      </div>

      {/* Admin designation */}
      <div className="rounded-xl border border-tertiary/15 bg-surface-container/50 p-6">
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Admin da plataforma</p>
        <p className="mb-4 text-sm text-on-surface-variant">
          O admin gerencia preços, funerárias e recebe {100 - commissionPercent}% das vendas.
        </p>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Carregando...</p>
        ) : (
          <>
            {/* Admin atual */}
            {admin ? (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-on-surface">{admin.name ?? "—"}</p>
                  <p className="truncate text-xs text-on-surface-variant">{admin.email}</p>
                </div>
                <button
                  onClick={handleRevogar}
                  disabled={saving}
                  className="shrink-0 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
                >
                  Revogar
                </button>
              </div>
            ) : (
              <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
                Nenhum admin designado. As rotas do painel admin estão sem dono.
              </div>
            )}

            {/* Lista de usuários */}
            <div>
              <p className="mb-2 text-xs text-on-surface-variant">
                {users.length === 0
                  ? "Nenhum usuário cadastrado ainda."
                  : `${users.length} usuário${users.length > 1 ? "s" : ""} cadastrado${users.length > 1 ? "s" : ""} — selecione para designar como admin:`}
              </p>

              {users.length > 0 && (
                <>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou e-mail..."
                    className="mb-3 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
                  />

                  <div className="max-h-64 overflow-y-auto rounded-lg border border-outline-variant/20 divide-y divide-outline-variant/10">
                    {filtered.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-on-surface-variant">Nenhum resultado.</p>
                    ) : (
                      filtered.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container/50 transition">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary/10 text-tertiary text-sm font-semibold">
                            {(user.name ?? user.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-on-surface">{user.name ?? "—"}</p>
                            <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {user.is_admin && (
                              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-green-400 border border-green-500/20">
                                admin atual
                              </span>
                            )}
                            {!user.is_admin && (
                              <button
                                onClick={() => handleDesignar(user.email)}
                                disabled={saving}
                                className="rounded-lg bg-tertiary/10 border border-tertiary/30 px-3 py-1.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20 disabled:opacity-50"
                              >
                                Designar
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {message && (
              <p
                className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                  message.ok
                    ? "border border-green-500/20 bg-green-500/10 text-green-300"
                    : "border border-red-400/20 bg-red-500/10 text-red-300"
                }`}
              >
                {message.text}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[0.65rem] uppercase tracking-[0.1em] text-on-surface-variant">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? "text-[#e9c349]" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}
