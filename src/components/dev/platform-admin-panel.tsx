"use client";

import { useEffect, useState } from "react";

type AdminInfo = {
  email: string;
  name: string | null;
  createdAt: string | null;
} | null;

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Props = {
  grossRevenueCents: number;
  systemCutCents: number;
  adminRepasseCents: number;
};

export function PlatformAdminPanel({ grossRevenueCents, systemCutCents, adminRepasseCents }: Props) {
  const [admin, setAdmin] = useState<AdminInfo>(undefined as unknown as AdminInfo);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/dev/platform-admin")
      .then((r) => r.json())
      .then((d) => {
        setAdmin(d.admin);
        if (d.admin?.email) setEmail(d.admin.email);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDesignar(e: React.FormEvent) {
    e.preventDefault();
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
    setMessage({ text: `${data.admin.name ?? data.admin.email} é agora o admin da plataforma.`, ok: true });
  }

  async function handleRevogar() {
    if (!confirm("Remover o admin atual? O painel admin ficará sem dono até você designar outro.")) return;
    setSaving(true);
    await fetch("/api/dev/platform-admin", { method: "DELETE" });
    setAdmin(null);
    setEmail("");
    setSaving(false);
    setMessage({ text: "Admin removido com sucesso.", ok: true });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue summary */}
      <div className="rounded-xl border border-[#e9c349]/15 bg-[#0d1b2a]/60 p-6">
        <p className="mb-4 text-[0.7rem] uppercase tracking-[0.15em] text-[#e9c349]">Receita do sistema</p>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Bruto" value={brl(grossRevenueCents)} />
          <Stat label="Meu repasse (15%)" value={brl(systemCutCents)} highlight />
          <Stat label="Admin (85%)" value={brl(adminRepasseCents)} />
        </div>
      </div>

      {/* Admin designation */}
      <div className="rounded-xl border border-tertiary/15 bg-surface-container/50 p-6">
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Admin da plataforma</p>
        <p className="mb-4 text-sm text-on-surface-variant">
          O admin gerencia preços, funerárias e recebe 85% das vendas.
        </p>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Carregando...</p>
        ) : (
          <>
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

            <form onSubmit={handleDesignar} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@operador.com"
                className="min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-tertiary focus:outline-none"
              />
              <button
                type="submit"
                disabled={saving}
                className="shrink-0 rounded-lg bg-tertiary px-4 py-2 text-sm font-semibold text-[#1c1b1b] transition hover:bg-[#ffe088] disabled:opacity-50"
              >
                {admin ? "Trocar" : "Designar"}
              </button>
            </form>

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
