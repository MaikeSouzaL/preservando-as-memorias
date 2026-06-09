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
  qrDataUrl: string | null;
};

const statusLabel: Record<string, { text: string; color: string }> = {
  ativo: { text: "Publicado", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: { text: "Aguardando pagamento", color: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20" },
  rascunho: { text: "Rascunho", color: "text-outline bg-outline/10 border-outline/20" },
};

export function MemorialCard({ id, name, years, imageUrl, status, publicUrl, editUrl, qrDataUrl }: Props) {
  const [showQr, setShowQr] = useState(false);
  const s = statusLabel[status] ?? statusLabel.rascunho;
  const isActive = status === "ativo";

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
      <article className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0a192f] transition duration-300 hover:-translate-y-0.5 hover:border-[#e9c349]/15">
        {/* Foto */}
        <div className="relative h-48 shrink-0">
          <Image
            src={imageUrl || "/images/hero-bg.png"}
            alt={name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/20 to-transparent" />
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#c4c7c7]/60 transition hover:border-white/20 hover:text-[#e0e3e2]"
          >
            <span className="material-symbols-outlined text-[1.1rem]">edit</span>
          </a>

          {/* QR Code */}
          {isActive && qrDataUrl && (
            <button
              type="button"
              title="Ver QR Code"
              onClick={() => setShowQr(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#c4c7c7]/60 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#c4c7c7]/60 transition hover:border-[#e9c349]/30 hover:text-[#e9c349]"
            >
              <span className="material-symbols-outlined text-[1.1rem]">share</span>
            </button>
          )}
        </div>
      </article>

      {/* Modal QR Code */}
      {showQr && qrDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowQr(false)}
        >
          <div
            className="flex w-full max-w-xs flex-col items-center gap-5 rounded-2xl border border-white/10 bg-[#0a192f] p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#c4c7c7]/50">QR Code</p>
              <h3 className="mt-1 font-semibold text-[#e0e3e2]">{name}</h3>
            </div>

            <div className="rounded-xl bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR Code — ${name}`} width={200} height={200} />
            </div>

            <p className="text-center text-xs text-[#c4c7c7]/50">
              Escaneie com a câmera do celular para abrir o memorial
            </p>

            <div className="flex w-full gap-3">
              <a
                href={qrDataUrl}
                download={`qrcode-${name.toLowerCase().replace(/\s+/g, "-")}.png`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#e9c349]/30 py-2.5 text-xs font-semibold text-[#e9c349] transition hover:bg-[#e9c349]/10"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Baixar
              </a>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="flex flex-1 items-center justify-center rounded-full border border-white/10 py-2.5 text-xs text-[#c4c7c7]/60 transition hover:border-white/20 hover:text-[#e0e3e2]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
