"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ManagedMemorial } from "@/src/lib/platform-data";

type DashboardData = {
  funeralHome: {
    id: string;
    name: string;
    email: string;
    contactName: string;
    phone: string;
    cnpj?: string;
    city?: string;
    state?: string;
  };
  memorials: ManagedMemorial[];
};

const statusLabel: Record<string, { text: string; color: string }> = {
  ativo: { text: "Publicado", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: {
    text: "Aguardando pagamento",
    color: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20",
  },
  rascunho: { text: "Rascunho", color: "text-[#c4c7c7]/60 bg-white/5 border-white/10" },
};

export default function FunerariaDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/funeral-auth/me");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/funeraria/login");
          return;
        }
        throw new Error("Erro ao carregar dados.");
      }
      const payload = await response.json();
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleLogout() {
    await fetch("/api/funeral-auth/logout", { method: "POST" });
    router.push("/funeraria/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a192f]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e9c349] border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a192f] px-4">
        <div className="text-center">
          <p className="mb-4 text-[#c4c7c7]">{error || "Erro ao carregar dados."}</p>
          <button
            onClick={() => void loadData()}
            className="rounded-xl bg-[#e9c349] px-6 py-2 text-sm font-semibold text-[#101414]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { funeralHome, memorials } = data;
  const publishedCount = memorials.filter((m) => m.status === "ativo").length;
  const pendingCount = memorials.filter((m) => m.status === "pending_payment").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a192f]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#e9c349]">
              Painel da Funerária
            </p>
            <h1 className="text-lg font-semibold text-white">{funeralHome.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/funeraria/dados-bancarios"
              className="flex items-center gap-1.5 rounded-lg border border-[#e9c349]/20 bg-[#e9c349]/5 px-3 py-1.5 text-xs text-[#e9c349] transition hover:bg-[#e9c349]/10"
            >
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              Dados PIX
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#c4c7c7] transition hover:border-white/20 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: memorials.length, icon: "auto_stories" },
            { label: "Publicados", value: publishedCount, icon: "check_circle" },
            { label: "Pendentes", value: pendingCount, icon: "hourglass_top" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-[#0a192f66] p-4 text-center"
            >
              <span className="material-symbols-outlined text-2xl text-[#e9c349]">{stat.icon}</span>
              <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#c4c7c7]/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Memoriais Cadastrados</h2>
          <Link
            href="/funeraria/dashboard/novo-memorial"
            className="flex items-center gap-2 rounded-xl bg-[#e9c349] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe28a]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Cadastrar falecido
          </Link>
        </div>

        {/* Memorial list */}
        {memorials.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e9c349]/20 py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#e9c349]/40">
              auto_stories
            </span>
            <h3 className="mb-2 text-lg font-semibold text-white">Nenhum memorial cadastrado</h3>
            <p className="mb-6 max-w-sm text-sm text-[#c4c7c7]/60">
              Cadastre o primeiro falecido para criar um memorial digital com QR Code.
            </p>
            <Link
              href="/funeraria/dashboard/novo-memorial"
              className="rounded-xl bg-[#e9c349] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe28a]"
            >
              Cadastrar falecido
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memorials.map((memorial) => {
              const status = statusLabel[memorial.status] ?? statusLabel.rascunho;
              const deathYear = memorial.deathDate
                ? new Date(memorial.deathDate).getFullYear()
                : null;
              const birthYear = memorial.birthDate
                ? new Date(memorial.birthDate).getFullYear()
                : null;
              const years =
                birthYear || deathYear ? `${birthYear ?? "?"} – ${deathYear ?? "?"}` : null;
              const publicUrl = `/memorial-publico?memorial=${memorial.id}`;

              return (
                <article
                  key={memorial.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a192f66] transition hover:border-[#e9c349]/20"
                >
                  <div className="relative h-40 shrink-0">
                    <Image
                      src={memorial.imageUrl || "/images/hero-bg.png"}
                      alt={memorial.name}
                      fill
                      className="object-cover grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-semibold text-white line-clamp-1">{memorial.name}</h3>
                      {years && <p className="text-xs text-white/50">{years}</p>}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <span
                      className={`self-start rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${status.color}`}
                    >
                      {status.text}
                    </span>

                    <div className="mt-auto flex gap-2">
                      {memorial.status === "ativo" ? (
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e9c349]/30 py-2 text-xs font-medium text-[#e9c349] transition hover:bg-[#e9c349]/5"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Ver memorial
                        </a>
                      ) : (
                        <a
                          href={`/checkout?memorialId=${memorial.id}&payerType=funeral_home`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e9c349] py-2 text-xs font-bold uppercase tracking-wide text-[#101414] transition hover:bg-[#ffe28a]"
                        >
                          <span className="material-symbols-outlined text-sm">payment</span>
                          Pagar para publicar
                        </a>
                      )}

                      {memorial.status === "ativo" && (
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="QR Code"
                          className="flex items-center justify-center rounded-lg border border-[#e9c349]/30 px-3 py-2 text-[#e9c349] transition hover:bg-[#e9c349]/5"
                        >
                          <span className="material-symbols-outlined text-sm">qr_code_2</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
