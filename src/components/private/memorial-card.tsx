"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  id: string;
  name: string;
  years: string | null;
  imageUrl: string;
  status: "ativo" | "pending_payment" | "rascunho";
  publicUrl: string;
  editUrl: string;
  qrDataUrlDark: string | null;
  qrDataUrlLight: string | null;
};

const statusLabel: Record<string, { text: string; color: string }> = {
  ativo: { text: "Publicado", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: { text: "Aguardando pagamento", color: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20" },
  rascunho: { text: "Rascunho", color: "text-outline bg-outline/10 border-outline/20" },
};

export function MemorialCard({ id, name, years, imageUrl, status, publicUrl, editUrl, qrDataUrlDark, qrDataUrlLight }: Props) {
  const [showQr, setShowQr] = useState(false);
  const [qrTheme, setQrTheme] = useState<"dark" | "light">("dark");
  const s = statusLabel[status] ?? statusLabel.rascunho;
  const isActive = status === "ativo";
  const activeQrUrl = qrTheme === "dark" ? qrDataUrlDark : qrDataUrlLight;
  const hasQr = !!(qrDataUrlDark || qrDataUrlLight);

  function handleShare() {
    const url = `${window.location.origin}${publicUrl}`;
    if (navigator.share) {
      navigator.share({ title: `Memorial — ${name}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  }

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--pm-border-faint)] bg-[var(--pm-card-solid)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e9c349]/15">
        {/* Foto */}
        <div className="relative h-48 shrink-0">
          <Image
            src={imageUrl || "/images/hero-bg.png"}
            alt={name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-card-img-from)] via-[var(--pm-card-img-mid)] to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-semibold text-white line-clamp-1">{name}</h3>
            {years && <p className="text-xs text-white/50">{years}</p>}
          </div>
          <div className="absolute right-3 top-3">
            <span className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${s.color}`}>
              {s.text}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 p-3">
          {isActive ? (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#e9c349] py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d1010] transition hover:bg-[#ffe088]"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Abrir memorial
            </a>
          ) : (
            <a
              href={`/checkout?memorialId=${id}&payerType=family`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#e9c349] py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d1010] transition hover:bg-[#ffe088]"
            >
              <span className="material-symbols-outlined text-sm">payment</span>
              Pagar para publicar
            </a>
          )}

          {/* Editar */}
          <a
            href={editUrl}
            title="Editar memorial"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--pm-border-subtle)] text-on-surface-variant/60 transition hover:border-outline/30 hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[1.1rem]">edit</span>
          </a>

          {/* QR Code */}
          {isActive && hasQr && (
            <button
              type="button"
              title="Ver QR Code"
              onClick={() => setShowQr(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--pm-border-subtle)] text-on-surface-variant/60 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              <span className="material-symbols-outlined text-[1.1rem]">qr_code_2</span>
            </button>
          )}

          {/* Compartilhar */}
          {isActive && (
            <button
              type="button"
              title="Compartilhar"
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--pm-border-subtle)] text-on-surface-variant/60 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              <span className="material-symbols-outlined text-[1.1rem]">share</span>
            </button>
          )}
        </div>
      </article>

      {/* Modal QR Code */}
      {showQr && hasQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowQr(false)}
        >
          <div
            className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-[var(--pm-border-subtle)] bg-[#0a192f] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQr(false)}
              className="absolute right-4 top-4 text-on-surface-variant transition hover:text-on-surface"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-on-surface-variant/50">QR Code</p>
              <h3 className="mt-1 font-semibold text-on-surface">{name}</h3>
            </div>

            {/* Dark / Light toggle */}
            <div className="inline-flex rounded-full border border-outline-variant/40 bg-surface-container/60 p-1">
              <button
                onClick={() => setQrTheme("dark")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  qrTheme === "dark"
                    ? "bg-[#0b1120] text-white shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">dark_mode</span>
                Escuro
              </button>
              <button
                onClick={() => setQrTheme("light")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  qrTheme === "light"
                    ? "bg-white text-[#1c1b1b] shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">light_mode</span>
                Claro
              </button>
            </div>

            {/* QR preview */}
            <div
              className={`mx-auto flex aspect-square w-[240px] items-center justify-center rounded-2xl p-4 shadow-inner transition-colors ${
                qrTheme === "dark" ? "bg-[#0b1120]" : "bg-white"
              }`}
            >
              {activeQrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeQrUrl}
                  alt={`QR Code — ${name}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <p className="text-xs text-on-surface-variant">Não disponível</p>
              )}
            </div>

            <p className="text-[0.7rem] text-on-surface-variant">
              {qrTheme === "dark"
                ? "Coração branco — ideal para fundo escuro"
                : "Coração dourado — ideal para impressão em papel"}
            </p>

            <div className="flex w-full justify-center">
              {activeQrUrl && (
                <a
                  href={activeQrUrl}
                  download={`qrcode-${name.toLowerCase().replace(/\s+/g, "-")}-${qrTheme}.svg`}
                  className="flex items-center gap-2 rounded-full bg-[#e9c349] px-6 py-2.5 text-sm font-semibold text-[#0d1010] transition hover:bg-[#ffe088] shadow-lg shadow-[#e9c349]/20"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Baixar QR ({qrTheme === "dark" ? "Escuro" : "Claro"})
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
