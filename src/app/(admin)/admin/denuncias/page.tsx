"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: string;
  target: string;
  reason: string;
  reporter: string;
  status: "Pendente" | "Resolvido";
  createdAt: string;
};

export default function AdminComplaintsPage() {
  const [reports, setReports] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);



  useEffect(() => {
    let active = true;
    
    async function init() {
      try {
        const res = await fetch("/api/admin/complaints");
        const data = await res.json();
        if (active && data.complaints) {
          setReports(data.complaints);
        }
      } catch {}
      if (active) setLoading(false);
    }

    init();

    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: "Pendente" | "Resolvido") => {
    setUpdatingId(id);
    const nextStatus = currentStatus === "Pendente" ? "Resolvido" : "Pendente";
    try {
      const res = await fetch("/api/admin/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.complaints) {
        setReports(data.complaints);
      }
    } catch {}
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta denúncia de moderação?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/complaints?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && data.complaints) {
        setReports(data.complaints);
      }
    } catch {}
    setUpdatingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-h3 text-2xl text-on-surface">Denúncias de Moderação</h3>
          <p className="text-sm text-outline mt-1">Monitore e analise conteúdos reportados por curadores e visitantes da plataforma.</p>
        </div>
        <span className="rounded-full bg-error/10 px-4 py-1 text-sm font-semibold text-error border border-error/20">
          Total: {reports.length} registros
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline border-t-tertiary" />
          <p className="text-sm text-outline">Carregando denúncias em tempo real...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/50 text-outline">
                  <th className="pb-3 font-normal">Identificador</th>
                  <th className="pb-3 font-normal">Alvo Denunciado</th>
                  <th className="pb-3 font-normal">Motivo da Denúncia</th>
                  <th className="pb-3 font-normal">Autor da Denúncia</th>
                  <th className="pb-3 font-normal">Data Envio</th>
                  <th className="pb-3 text-right font-normal">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-outline text-xs uppercase tracking-wider">
                      Nenhuma denúncia ou moderação pendente na plataforma no momento.
                    </td>
                  </tr>
                ) : (
                  reports.map((rep) => {
                    const dateStr = new Date(rep.createdAt).toLocaleDateString("pt-BR");
                    const isUpdating = updatingId === rep.id;

                    return (
                      <tr key={rep.id} className="border-b border-outline-variant/20 transition-colors hover:bg-surface-variant/30">
                        <td className="py-4 font-mono text-xs text-on-surface-variant">
                          {rep.id}
                        </td>
                        <td className="py-4 font-medium text-on-surface">
                          {rep.target}
                        </td>
                        <td className="py-4 text-on-surface-variant max-w-xs truncate">
                          {rep.reason}
                        </td>
                        <td className="py-4 text-outline">{rep.reporter}</td>
                        <td className="py-4 text-outline">{dateStr}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={isUpdating}
                              onClick={() => handleToggleStatus(rep.id, rep.status)}
                              className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide border transition cursor-pointer disabled:opacity-50 ${
                                rep.status === "Pendente"
                                  ? "bg-error/10 text-error border-error/30 hover:bg-error/20"
                                  : "bg-emerald-400/10 text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/20"
                              }`}
                            >
                              {isUpdating ? "..." : rep.status === "Pendente" ? "Resolver" : "Reabrir"}
                            </button>
                            
                            <button
                              disabled={isUpdating}
                              onClick={() => handleDelete(rep.id)}
                              className="p-1.5 rounded border border-outline-variant hover:border-red-400 text-outline hover:text-red-400 transition cursor-pointer disabled:opacity-50 flex items-center justify-center"
                              title="Excluir Denúncia"
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
