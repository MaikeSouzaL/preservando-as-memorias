"use client";

import { useEffect, useState } from "react";
import type { FuneralHomeInvite, FuneralPlan } from "@/src/lib/platform-types";

type InviteWithPlan = FuneralHomeInvite & { planName?: string };

function statusLabel(status: FuneralHomeInvite["status"]) {
  if (status === "active") return { text: "Ativo", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  if (status === "used") return { text: "Usado", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  return { text: "Expirado", color: "text-red-400 bg-red-400/10 border-red-400/20" };
}

export function ConvitesPageClient() {
  const [invites, setInvites] = useState<InviteWithPlan[]>([]);
  const [plans, setPlans] = useState<FuneralPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [commissionPct, setCommissionPct] = useState("");
  const [activePlanId, setActivePlanId] = useState("");
  const [planRenewsAt, setPlanRenewsAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/admin/funeral-home-invites")
      .then((r) => r.json())
      .then((d) => {
        const planMap: Record<string, string> = {};
        (d.funeralPlans ?? []).forEach((p: FuneralPlan) => { planMap[p.id] = p.name; });
        const enriched = (d.invites ?? []).map((i: FuneralHomeInvite) => ({
          ...i,
          planName: i.activePlanId ? planMap[i.activePlanId] : undefined,
        }));
        setInvites(enriched);
        setPlans(d.funeralPlans ?? []);
      })
      .catch(() => setError("Não foi possível carregar os convites."))
      .finally(() => setLoading(false));
  }, []);

  function buildInviteUrl(inviteSlug: string) {
    return `${window.location.origin}/convite/${inviteSlug}`;
  }

  async function copyLink(inviteSlug: string) {
    await navigator.clipboard.writeText(buildInviteUrl(inviteSlug));
    setCopied(inviteSlug);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/funeral-home-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          slug: slug || undefined,
          adminCommissionPercent: commissionPct !== "" ? Number(commissionPct) : undefined,
          activePlanId: activePlanId || null,
          planRenewsAt: planRenewsAt || null,
          notes,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Erro ao criar convite.");

      const newInvite: InviteWithPlan = {
        ...d.invite,
        planName: d.invite.activePlanId
          ? plans.find((p) => p.id === d.invite.activePlanId)?.name
          : undefined,
      };
      setInvites((prev) => [newInvite, ...prev]);
      setShowForm(false);
      setLabel(""); setSlug(""); setCommissionPct(""); setActivePlanId(""); setPlanRenewsAt(""); setNotes("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erro ao criar convite.");
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: FuneralHomeInvite["status"]) {
    const res = await fetch(`/api/admin/funeral-home-invites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setInvites((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    }
  }

  async function deleteInvite(id: string) {
    if (!confirm("Remover este convite permanentemente?")) return;
    const res = await fetch(`/api/admin/funeral-home-invites/${id}`, { method: "DELETE" });
    if (res.ok) setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando...</p>;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin</p>
          <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Links de Convite</h1>
          <p className="mt-2 max-w-2xl text-on-surface-variant text-sm">
            Crie links personalizados para funerárias se cadastrarem com termos pré-configurados
            (comissão %, plano de assinatura, data de renovação).
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-[#e9c349] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe28a]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Novo convite
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-white/10 bg-surface-variant/40 p-6 flex flex-col gap-4"
        >
          <h2 className="text-lg font-medium text-on-surface">Novo link de convite</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                Nome do convite *
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                placeholder="Ex: Funerária São João"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-[#e9c349]/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                Slug do link (opcional)
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="ex: sao-joao (gerado auto se vazio)"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-[#e9c349]/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                Comissão Admin % (deixe vazio para padrão)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
                placeholder="Ex: 20"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-[#e9c349]/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                Plano pré-atribuído (opcional)
              </label>
              <select
                value={activePlanId}
                onChange={(e) => setActivePlanId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0b1012] px-3 py-2.5 text-sm text-on-surface outline-none focus:border-[#e9c349]/40"
              >
                <option value="">Sem plano</option>
                {plans.filter((p) => p.active).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {activePlanId && (
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                  Data de renovação do plano
                </label>
                <input
                  type="date"
                  value={planRenewsAt ? planRenewsAt.slice(0, 10) : ""}
                  onChange={(e) => setPlanRenewsAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-on-surface outline-none focus:border-[#e9c349]/40"
                />
              </div>
            )}

            <div className={activePlanId ? "" : "sm:col-span-2"}>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-on-surface-variant">
                Observações internas (não visível para a funerária)
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: parceria feira regional 2026"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-on-surface placeholder-white/20 outline-none focus:border-[#e9c349]/40"
              />
            </div>
          </div>

          {saveError && (
            <p className="text-sm text-red-400">{saveError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); setSaveError(""); }}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:border-white/30"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#e9c349] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe28a] disabled:opacity-50"
            >
              {saving ? "Criando..." : "Criar convite"}
            </button>
          </div>
        </form>
      )}

      {/* Invites list */}
      {invites.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-surface-variant/20 py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/40">link</span>
          <p className="text-sm text-on-surface-variant">Nenhum convite criado ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {invites.map((invite) => {
            const { text, color } = statusLabel(invite.status);
            return (
              <div
                key={invite.id}
                className="rounded-2xl border border-white/8 bg-surface-variant/30 p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-on-surface">{invite.label}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${color}`}>
                        {text}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">
                      /convite/{invite.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {invite.status === "active" && (
                      <button
                        onClick={() => copyLink(invite.slug)}
                        title="Copiar link"
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-on-surface-variant transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copied === invite.slug ? "check" : "content_copy"}
                        </span>
                        {copied === invite.slug ? "Copiado!" : "Copiar link"}
                      </button>
                    )}
                    {invite.status === "active" && (
                      <button
                        onClick={() => setStatus(invite.id, "expired")}
                        title="Expirar convite"
                        className="rounded-lg border border-white/10 p-1.5 text-on-surface-variant/50 transition hover:border-red-400/30 hover:text-red-400"
                      >
                        <span className="material-symbols-outlined text-sm">block</span>
                      </button>
                    )}
                    {invite.status !== "active" && (
                      <button
                        onClick={() => setStatus(invite.id, "active")}
                        title="Reativar"
                        className="rounded-lg border border-white/10 p-1.5 text-on-surface-variant/50 transition hover:border-emerald-400/30 hover:text-emerald-400"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvite(invite.id)}
                      title="Remover"
                      className="rounded-lg border border-white/10 p-1.5 text-on-surface-variant/50 transition hover:border-red-400/30 hover:text-red-400"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
                  {invite.adminCommissionPercent !== undefined && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.9rem]">percent</span>
                      Comissão: <strong className="text-on-surface">{invite.adminCommissionPercent}%</strong>
                    </span>
                  )}
                  {invite.planName && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.9rem]">star</span>
                      Plano: <strong className="text-on-surface">{invite.planName}</strong>
                    </span>
                  )}
                  {invite.planRenewsAt && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.9rem]">event</span>
                      Renova: <strong className="text-on-surface">{new Date(invite.planRenewsAt).toLocaleDateString("pt-BR")}</strong>
                    </span>
                  )}
                  {invite.usedAt && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[0.9rem]">check_circle</span>
                      Usado em: <strong className="text-on-surface">{new Date(invite.usedAt).toLocaleDateString("pt-BR")}</strong>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[0.9rem]">schedule</span>
                    Criado: {new Date(invite.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {invite.notes && (
                  <p className="text-xs text-on-surface-variant/60 italic">{invite.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
