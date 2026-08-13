"use client";

import { useEffect, useMemo, useState } from "react";

type Tribute = {
  id: string;
  memorialId: string;
  memorialName: string;
  author: string;
  message: string;
  createdAt: string;
  status: "aprovada" | "pendente";
  tag?: string;
};

type Complaint = {
  id: string;
  target: string;
  reason: string;
  reporter: string;
  status: "Pendente" | "Resolvido";
  createdAt: string;
};

function AutoApproveToggle() {
  const [autoApprove, setAutoApprove] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/platform-config")
      .then((r) => r.json())
      .then((d) => setAutoApprove(d.config?.autoApproveTributes ?? true))
      .catch(() => setAutoApprove(true));
  }, []);

  async function toggle() {
    if (autoApprove === null) return;
    setSaving(true);
    const next = !autoApprove;
    try {
      const res = await fetch("/api/platform-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: "moderation", autoApproveTributes: next }),
      });
      if (res.ok) setAutoApprove(next);
    } finally {
      setSaving(false);
    }
  }

  if (autoApprove === null) return null;

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-h3 text-lg text-on-surface">Aprovação automática de homenagens</h2>
          <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
            {autoApprove
              ? "Homenagens enviadas nos memoriais aparecem publicadas imediatamente."
              : "Homenagens enviadas ficam pendentes até você aprovar aqui embaixo."}
          </p>
        </div>
        <button
          disabled={saving}
          onClick={toggle}
          className={`shrink-0 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50 ${
            autoApprove ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          {saving ? "..." : autoApprove ? "Automática — ligada" : "Automática — desligada"}
        </button>
      </div>
    </section>
  );
}

function TributesTab() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pendingCount = useMemo(() => tributes.filter((t) => t.status === "pendente").length, [tributes]);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/tributes")
      .then((r) => r.json())
      .then((d) => {
        if (active) setTributes(Array.isArray(d.tributes) ? d.tributes : []);
      })
      .catch(() => active && setError("Não foi possível carregar as homenagens."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(id: string, status: Tribute["status"]) {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/tributes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao atualizar homenagem.");
      setTributes(data.tributes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar homenagem.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteTribute(id: string) {
    if (!confirm("Remover esta homenagem da plataforma?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/tributes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao excluir.");
      setTributes(data.tributes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir homenagem.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando homenagens...</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-tertiary/10 px-3.5 py-1 text-xs font-semibold text-tertiary">{tributes.length} homenagens</span>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
          {pendingCount} pendentes
        </span>
      </div>
      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}
      {tributes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-12 text-center text-on-surface-variant">
          Nenhuma homenagem cadastrada ainda.
        </div>
      ) : (
        <div className="space-y-2">
          {tributes.map((t) => (
            <div key={t.id} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-on-surface">{t.author}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${t.status === "aprovada" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400" : "border-amber-400/20 bg-amber-400/10 text-amber-300"}`}>
                      {t.status === "aprovada" ? "Aprovada" : "Pendente"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">&quot;{t.message}&quot;</p>
                  <p className="mt-1 text-xs text-outline">
                    Memorial: <span className="text-tertiary">{t.memorialName}</span> · {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {t.status === "pendente" ? (
                    <button
                      disabled={updatingId === t.id}
                      onClick={() => updateStatus(t.id, "aprovada")}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-50"
                    >
                      Aprovar
                    </button>
                  ) : (
                    <button
                      disabled={updatingId === t.id}
                      onClick={() => updateStatus(t.id, "pendente")}
                      className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 disabled:opacity-50"
                    >
                      Reverter
                    </button>
                  )}
                  <button
                    disabled={updatingId === t.id}
                    onClick={() => deleteTribute(t.id)}
                    className="rounded-lg border border-outline-variant/40 p-1.5 text-on-surface-variant hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplaintsTab() {
  const [reports, setReports] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/complaints")
      .then((r) => r.json())
      .then((d) => {
        if (active) setReports(Array.isArray(d.complaints) ? d.complaints : []);
      })
      .catch(() => active && setError("Não foi possível carregar as denúncias."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function toggleStatus(id: string, current: Complaint["status"]) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: current === "Pendente" ? "Resolvido" : "Pendente" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao atualizar.");
      setReports(data.complaints ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar denúncia.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover esta denúncia?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/complaints?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao excluir.");
      setReports(data.complaints ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir denúncia.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <p className="py-10 text-center text-on-surface-variant">Carregando denúncias...</p>;

  return (
    <div className="flex flex-col gap-4">
      <span className="w-fit rounded-full bg-error/10 px-3.5 py-1 text-xs font-semibold text-error">{reports.length} registros</span>
      {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}
      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 py-12 text-center text-on-surface-variant">
          Nenhuma denúncia registrada.
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-on-surface">{r.target}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{r.reason}</p>
                  <p className="mt-1 text-xs text-outline">
                    Reportado por {r.reporter} · {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    disabled={updatingId === r.id}
                    onClick={() => toggleStatus(r.id, r.status)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                      r.status === "Pendente" ? "border-error/30 bg-error/10 text-error hover:bg-error/20" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
                    }`}
                  >
                    {r.status === "Pendente" ? "Resolver" : "Reabrir"}
                  </button>
                  <button
                    disabled={updatingId === r.id}
                    onClick={() => remove(r.id)}
                    className="rounded-lg border border-outline-variant/40 p-1.5 text-on-surface-variant hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ModerationPageClient() {
  const [tab, setTab] = useState<"tributes" | "complaints">("tributes");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Moderação</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Homenagens e denúncias de conteúdo enviadas nos memoriais.</p>
      </header>

      <AutoApproveToggle />

      <div className="flex gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-low p-1 sm:w-fit">
        <button
          onClick={() => setTab("tributes")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "tributes" ? "bg-tertiary/10 text-tertiary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          <span className="material-symbols-outlined text-base">rate_review</span>
          Homenagens
        </button>
        <button
          onClick={() => setTab("complaints")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "complaints" ? "bg-tertiary/10 text-tertiary" : "text-on-surface-variant hover:text-on-surface"}`}
        >
          <span className="material-symbols-outlined text-base">flag</span>
          Denúncias
        </button>
      </div>

      {tab === "tributes" ? <TributesTab /> : <ComplaintsTab />}
    </div>
  );
}
