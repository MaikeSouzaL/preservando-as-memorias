"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkSentButton({ memorialId }: { memorialId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/memorial/${memorialId}/delivery`, { method: "PATCH" });
      if (res.ok) {
        setDone(true);
        // Recarrega os dados do servidor para esconder o item da lista
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400">
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        Enviado
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="shrink-0 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/25 disabled:opacity-50"
    >
      {loading ? "Registrando..." : "Marcar como enviado"}
    </button>
  );
}
