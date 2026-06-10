"use client";

import { useState } from "react";
import { CriarMemorialForm } from "@/src/components/admin/criar-memorial-form";

export function CriarMemorialButton() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-[#e9c349] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088]"
      >
        <span className="material-symbols-outlined text-sm">add_circle</span>
        Criar memorial gratuito
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-outline-variant/20 bg-[#0f1c1c] p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c349]/10">
                  <span className="material-symbols-outlined text-base text-[#e9c349]">
                    local_fire_department
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-light text-[#e9c349]">Novo Memorial</h2>
                  <p className="text-xs text-on-surface-variant">
                    Criação pelo dev — sem cobrança, ativo imediatamente
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <CriarMemorialForm onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
}
