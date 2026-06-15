"use client";

import { useState } from "react";

type QrCodeViewerProps = {
  qrDataUrl: string;
  memorialName: string;
};

export function QrCodeViewer({ qrDataUrl, memorialName }: QrCodeViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1.5 text-xs font-semibold text-tertiary transition-colors hover:bg-tertiary/20"
      >
        <span className="material-symbols-outlined text-[16px]">visibility</span>
        Visualizar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-tertiary/20 bg-[#0a192f] p-8 text-center shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant transition hover:text-on-surface"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h4 className="mb-1 font-h3 text-xl text-on-surface">QR Code</h4>
            <p className="mb-6 text-sm text-on-surface-variant">Memorial: {memorialName}</p>

            <div className="mx-auto flex aspect-square w-[240px] items-center justify-center rounded-2xl bg-[#0b1120] p-4 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={`QR Code para ${memorialName}`} className="h-full w-full object-contain" />
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={qrDataUrl}
                download={`qrcode-${memorialName.toLowerCase().replace(/\s+/g, "-")}.svg`}
                className="flex items-center gap-2 rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-background transition hover:bg-tertiary-fixed shadow-lg shadow-tertiary/20"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Baixar QR Code
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
