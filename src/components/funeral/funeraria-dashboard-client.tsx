"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { ManagedMemorial } from "@/src/lib/platform-data";

type FuneralHomeData = {
  id: string;
  name: string;
  email: string;
  contactName: string;
  phone: string;
  cnpj?: string;
  city?: string;
  state?: string;
};

type ActivePlan = {
  id: string;
  name: string;
  memorialLimit: number | null;
  extraMemorialPriceCents: number;
  priceCents: number;
};

type EnrichedMemorial = ManagedMemorial & { tributeCount?: number; candleCount?: number };

type Props = {
  funeralHome: FuneralHomeData;
  memorials: EnrichedMemorial[];
  qrMap: Record<string, { dark: string; light: string }>;
  activePlan: ActivePlan | null;
  memorialCountMonth: number;
  subscriptionRenewsAt: string | null;
  subscriptionExpired: boolean;
};

const statusLabel: Record<string, { text: string; color: string }> = {
  ativo: { text: "Publicado", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: {
    text: "Aguardando pagamento",
    color: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20",
  },
  rascunho: { text: "Rascunho", color: "text-[#c4c7c7]/60 bg-white/5 border-white/10" },
};

function QrModal({
  memorialName,
  qrDark,
  qrLight,
  onClose,
}: {
  memorialName: string;
  qrDark: string;
  qrLight: string;
  onClose: () => void;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const activeUrl = theme === "dark" ? qrDark : qrLight;
  const filename = `qrcode-${memorialName.toLowerCase().replace(/\s+/g, "-")}-${theme}.svg`;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-[#e9c349]/20 bg-[#0a192f] p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#c4c7c7] transition hover:text-white"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <h4 className="mb-1 text-lg font-semibold text-white">QR Code</h4>
        <p className="mb-5 text-sm text-[#c4c7c7]/70">Memorial: {memorialName}</p>

        {/* Toggle */}
        <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              theme === "dark" ? "bg-[#0b1120] text-white shadow" : "text-[#c4c7c7] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">dark_mode</span>
            Escuro
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              theme === "light" ? "bg-white text-[#1c1b1b] shadow" : "text-[#c4c7c7] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">light_mode</span>
            Claro
          </button>
        </div>

        {/* Preview */}
        <div
          className={`mx-auto flex aspect-square w-[240px] items-center justify-center rounded-2xl p-4 shadow-inner transition-colors ${
            theme === "dark" ? "bg-[#0b1120]" : "bg-white"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeUrl} alt={`QR Code para ${memorialName}`} className="h-full w-full object-contain" />
        </div>

        <p className="mt-3 text-[0.7rem] text-[#c4c7c7]/60">
          {theme === "dark"
            ? "Coração branco — ideal para fundo escuro"
            : "Coração dourado — ideal para impressão em papel"}
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href={activeUrl}
            download={filename}
            className="flex items-center gap-2 rounded-full bg-[#e9c349] px-6 py-2.5 text-sm font-semibold text-[#0d1010] transition hover:bg-[#ffe088] shadow-lg shadow-[#e9c349]/20"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Baixar QR ({theme === "dark" ? "Escuro" : "Claro"})
          </a>
        </div>
      </div>
    </div>
  , document.body);
}

export function FunerariaDashboardClient({
  funeralHome, memorials, qrMap,
  activePlan, memorialCountMonth, subscriptionRenewsAt, subscriptionExpired,
}: Props) {
  const router = useRouter();
  const [qrModal, setQrModal] = useState<{ name: string; dark: string; light: string } | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  async function handleLogout() {
    await fetch("/api/funeral-auth/logout", { method: "POST" });
    router.push("/funeraria/login");
  }

  async function handlePublishWithQuota(memorialId: string) {
    setPublishing(memorialId);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: funeralHome.contactName,
        email: funeralHome.email,
        cpf: "00000000000",
        phone: "00000000000",
        paymentMethod: "pix",
        memorialId,
        payerType: "funeral_home",
        source: "funeral_home",
      }),
    });
    if (res.ok) {
      router.refresh();
    }
    setPublishing(null);
  }

  const publishedCount = memorials.filter((m) => m.status === "ativo").length;
  const pendingCount = memorials.filter((m) => m.status === "pending_payment").length;

  const quotaUsed = memorialCountMonth;
  const quotaLimit = activePlan?.memorialLimit ?? null;
  const quotaRemaining = quotaLimit !== null ? Math.max(0, quotaLimit - quotaUsed) : null;
  const withinQuota = activePlan && !subscriptionExpired && (quotaLimit === null || quotaUsed < quotaLimit);

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

        {/* Card do plano de assinatura */}
        {activePlan && (
          <div className={`mb-6 rounded-xl border p-4 ${
            subscriptionExpired
              ? "border-red-500/30 bg-red-500/5"
              : "border-[#e9c349]/20 bg-[#e9c349]/5"
          }`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349]">
                  {subscriptionExpired ? "Assinatura expirada" : "Plano ativo"}
                </p>
                <p className="font-semibold text-white">{activePlan.name}</p>
                {subscriptionRenewsAt && (
                  <p className="text-xs text-white/50">
                    {subscriptionExpired ? "Expirou em " : "Renova em "}
                    {new Date(subscriptionRenewsAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
              {!subscriptionExpired && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {quotaLimit === null ? "∞" : `${quotaUsed}/${quotaLimit}`}
                    </p>
                    <p className="text-[0.65rem] text-white/50 uppercase tracking-wider">
                      {quotaLimit === null ? "Ilimitado" : "Memoriais este mês"}
                    </p>
                  </div>
                  {quotaLimit !== null && (
                    <div className="w-32">
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#e9c349] transition-all"
                          style={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[0.6rem] text-white/40 text-right">
                        {quotaRemaining} restantes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
              const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : null;
              const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : null;
              const years = birthYear || deathYear ? `${birthYear ?? "?"} – ${deathYear ?? "?"}` : null;
              const publicUrl = `/memorial-publico?memorial=${memorial.id}`;
              const qr = qrMap[memorial.id];

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

                    {memorial.status === "ativo" && (
                      <div className="flex items-center gap-3 text-xs text-[#c4c7c7]/60">
                        <span title="Homenagens">🕊️ {memorial.tributeCount ?? 0}</span>
                        <span title="Velas">🕯️ {memorial.candleCount ?? 0}</span>
                        <span title="Flores">🌸 {memorial.flowers ?? 0}</span>
                        <span title="Corações">❤️ {memorial.hearts ?? 0}</span>
                      </div>
                    )}

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
                      ) : withinQuota ? (
                        <button
                          type="button"
                          disabled={publishing === memorial.id}
                          onClick={() => handlePublishWithQuota(memorial.id)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e9c349] py-2 text-xs font-bold uppercase tracking-wide text-[#101414] transition hover:bg-[#ffe28a] disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {publishing === memorial.id ? "progress_activity" : "check_circle"}
                          </span>
                          {publishing === memorial.id ? "Publicando..." : "Publicar (plano)"}
                        </button>
                      ) : (
                        <a
                          href={`/checkout?memorialId=${memorial.id}&payerType=funeral_home`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e9c349] py-2 text-xs font-bold uppercase tracking-wide text-[#101414] transition hover:bg-[#ffe28a]"
                        >
                          <span className="material-symbols-outlined text-sm">payment</span>
                          Pagar para publicar
                        </a>
                      )}

                      {memorial.status === "ativo" && qr && (
                        <button
                          type="button"
                          title="Ver QR Code"
                          onClick={() =>
                            setQrModal({ name: memorial.name, dark: qr.dark, light: qr.light })
                          }
                          className="flex items-center justify-center rounded-lg border border-[#e9c349]/30 px-3 py-2 text-[#e9c349] transition hover:bg-[#e9c349]/5"
                        >
                          <span className="material-symbols-outlined text-sm">qr_code_2</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {qrModal && (
        <QrModal
          memorialName={qrModal.name}
          qrDark={qrModal.dark}
          qrLight={qrModal.light}
          onClose={() => setQrModal(null)}
        />
      )}
    </div>
  );
}
