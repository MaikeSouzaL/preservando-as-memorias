"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type QrCodeViewerProps = {
  qrDataUrlDark: string;
  qrDataUrlLight: string;
  memorialName: string;
};

export function QrCodeViewer({ qrDataUrlDark, qrDataUrlLight, memorialName }: QrCodeViewerProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const activeUrl = theme === "dark" ? qrDataUrlDark : qrDataUrlLight;
  const filename = `qrcode-${memorialName.toLowerCase().replace(/\s+/g, "-")}-${theme}.svg`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1.5 text-xs font-semibold text-tertiary transition-colors hover:bg-tertiary/20"
      >
        <span className="material-symbols-outlined text-[16px]">visibility</span>
        Visualizar
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-sm rounded-3xl border border-tertiary/20 bg-[#0a192f] p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant transition hover:text-on-surface"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h4 className="mb-1 font-h3 text-xl text-on-surface">QR Code</h4>
            <p className="mb-5 text-sm text-on-surface-variant">Memorial: {memorialName}</p>

            {/* Theme toggle */}
            <div className="mb-5 inline-flex rounded-full border border-outline-variant/40 bg-surface-container/60 p-1">
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  theme === "dark"
                    ? "bg-[#0b1120] text-white shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">dark_mode</span>
                Escuro
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  theme === "light"
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
                theme === "dark" ? "bg-[#0b1120]" : "bg-white"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeUrl} alt={`QR Code para ${memorialName}`} className="h-full w-full object-contain" />
            </div>

            <p className="mt-3 text-[0.7rem] text-on-surface-variant">
              {theme === "dark"
                ? "Coração branco — ideal para fundo escuro"
                : "Coração dourado — ideal para impressão em papel"}
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href={activeUrl}
                download={filename}
                className="flex items-center gap-2 rounded-full bg-tertiary px-6 py-2.5 text-sm font-semibold text-background transition hover:bg-tertiary-fixed shadow-lg shadow-tertiary/20"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Baixar QR ({theme === "dark" ? "Escuro" : "Claro"})
              </a>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
