"use client";

import { useEffect, useMemo, useState } from "react";

type AdminTribute = {
  id: string;
  memorialId: string;
  memorialName: string;
  author: string;
  message: string;
  createdAt: string;
  status: "aprovada" | "pendente";
  tag?: string;
};

export default function AdminTributesPage() {
  const [tributes, setTributes] = useState<AdminTribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const pendingCount = useMemo(() => tributes.filter((tribute) => tribute.status === "pendente").length, [tributes]);

  useEffect(() => {
    let active = true;

    async function loadTributes() {
      try {
        const response = await fetch("/api/admin/tributes");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Não foi possível carregar as homenagens.");
        }

        if (active) {
          setTributes(Array.isArray(payload.tributes) ? payload.tributes : []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as homenagens.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTributes();

    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(id: string, status: AdminTribute["status"]) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/tributes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Não foi possível atualizar a homenagem.");
      }

      setTributes(Array.isArray(payload.tributes) ? payload.tributes : []);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Não foi possível atualizar a homenagem.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteTribute(id: string) {
    if (!confirm("Remover esta homenagem da plataforma?")) return;

    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/tributes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Não foi possível excluir a homenagem.");
      }

      setTributes(Array.isArray(payload.tributes) ? payload.tributes : []);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir a homenagem.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-h3 text-2xl text-on-surface">Homenagens e Tributos</h3>
          <p className="mt-1 text-sm text-outline">Aprove mensagens públicas antes que apareçam nos memoriais.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-tertiary/10 px-4 py-1 text-sm font-semibold text-tertiary">
            Total: {tributes.length} homenagens
          </span>
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1 text-sm font-semibold text-amber-300">
            Pendentes: {pendingCount}
          </span>
        </div>
      </div>

      {error ? <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p> : null}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline border-t-tertiary" />
          <p className="text-sm text-outline">Carregando homenagens em tempo real...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/50 text-outline">
                  <th className="pb-3 font-normal">Autor</th>
                  <th className="pb-3 font-normal">Mensagem</th>
                  <th className="pb-3 font-normal">Memorial Alvo</th>
                  <th className="pb-3 font-normal">Símbolo / Tag</th>
                  <th className="pb-3 font-normal">Data Envio</th>
                  <th className="pb-3 font-normal">Status</th>
                  <th className="pb-3 text-right font-normal">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tributes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs font-semibold uppercase tracking-wider text-outline">
                      Nenhuma homenagem ou tributo cadastrado na plataforma ainda.
                    </td>
                  </tr>
                ) : (
                  tributes.map((tribute) => {
                    const dateStr = new Date(tribute.createdAt).toLocaleDateString("pt-BR");
                    const isUpdating = updatingId === tribute.id;

                    return (
                      <tr key={tribute.id} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            </div>
                            <span className="font-medium text-on-surface">{tribute.author}</span>
                          </div>
                        </td>
                        <td className="max-w-sm py-4 text-on-surface-variant">
                          <span className="line-clamp-2">{`"${tribute.message}"`}</span>
                        </td>
                        <td className="py-4 font-medium text-tertiary">{tribute.memorialName}</td>
                        <td className="py-4 text-outline">
                          <span className="rounded bg-surface-container-high px-2 py-1 text-xs font-semibold">
                            {tribute.tag || "Sem ícone"}
                          </span>
                        </td>
                        <td className="py-4 text-outline">{dateStr}</td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              tribute.status === "aprovada"
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {tribute.status === "aprovada" ? "Aprovada" : "Pendente"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {tribute.status === "pendente" ? (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => updateStatus(tribute.id, "aprovada")}
                                className="rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-50"
                              >
                                {isUpdating ? "..." : "Aprovar"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => updateStatus(tribute.id, "pendente")}
                                className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-300 transition hover:bg-amber-400/20 disabled:opacity-50"
                              >
                                {isUpdating ? "..." : "Reabrir"}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => deleteTribute(tribute.id)}
                              className="flex items-center justify-center rounded border border-outline-variant p-1.5 text-outline transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                              title="Excluir homenagem"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
