"use client";

import { useState } from "react";
import { fmtDateBR } from "@/src/components/funeral/format";

export type PrintableMemorial = {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string;
  city: string;
  qr: { dark: string; light: string };
};

export function QrPrintClient({
  memorials,
  initialSelectedId,
}: {
  memorials: PrintableMemorial[];
  initialSelectedId?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelectedId ? [initialSelectedId] : memorials.map((m) => m.id))
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(memorials.map((m) => m.id)));
  }

  function clearAll() {
    setSelected(new Set());
  }

  function printOnly(id: string) {
    setSelected(new Set([id]));
    // Espera o re-render pintar o print-sheet só com essa placa antes de abrir o diálogo.
    requestAnimationFrame(() => window.print());
  }

  function downloadSvg(memorial: PrintableMemorial) {
    const a = document.createElement("a");
    a.href = memorial.qr.light;
    a.download = `qrcode-${memorial.name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    a.click();
  }

  return (
    <>
      {/* ── Tela: seleção e grade interativa ───────────────────────────── */}
      <div className="print:hidden space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0a192f66] p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">
              {selected.size} de {memorials.length} selecionados
            </span>
            <button onClick={selectAll} className="text-xs font-semibold text-[#e9c349] hover:underline">
              Selecionar todos
            </button>
            <button onClick={clearAll} className="text-xs font-semibold text-[#c4c7c7]/60 hover:text-white">
              Limpar seleção
            </button>
          </div>
          <button
            onClick={() => window.print()}
            disabled={selected.size === 0}
            className="flex items-center gap-2 rounded-lg bg-[#e9c349] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Imprimir selecionados ({selected.size})
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memorials.map((m) => {
            const isSelected = selected.has(m.id);
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition ${
                  isSelected ? "border-[#e9c349]/40 bg-[#e9c349]/5" : "border-white/10 bg-[#0a192f66]"
                }`}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(m.id)}
                    className="h-4 w-4 rounded border-white/20 accent-[#e9c349]"
                  />
                  <span className="truncate">{m.name}</span>
                </label>

                <div className="mx-auto flex aspect-square w-32 items-center justify-center rounded-lg bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.qr.light} alt={`QR Code de ${m.name}`} className="h-full w-full object-contain" />
                </div>

                {(m.birthDate || m.deathDate) && (
                  <p className="text-center text-xs text-[#c4c7c7]/50">
                    {fmtDateBR(m.birthDate)} — {fmtDateBR(m.deathDate)}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => printOnly(m.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 py-1.5 text-[0.7rem] font-semibold text-[#c4c7c7] transition hover:border-white/20 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Imprimir
                  </button>
                  <button
                    onClick={() => downloadSvg(m)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 py-1.5 text-[0.7rem] font-semibold text-[#c4c7c7] transition hover:border-white/20 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Baixar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Impressão: só as placas selecionadas, layout limpo ─────────── */}
      <div className="hidden print:block">
        <div className="grid grid-cols-2 gap-8">
          {memorials
            .filter((m) => selected.has(m.id))
            .map((m) => (
              <div key={m.id} className="flex flex-col items-center break-inside-avoid rounded-xl border border-dashed border-black/30 p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.qr.light} alt={`QR Code de ${m.name}`} className="h-56 w-56 object-contain" />
                <p className="mt-3 text-center text-base font-semibold text-black">{m.name}</p>
                {(m.birthDate || m.deathDate) && (
                  <p className="text-center text-xs text-black/60">
                    {fmtDateBR(m.birthDate)} — {fmtDateBR(m.deathDate)}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
