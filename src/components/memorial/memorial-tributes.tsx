"use client";

import type { TributeView } from "@/src/components/memorial/types";

export type MemorialTributesProps = {
  tributes: TributeView[];
  onWriteMessage?: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
}

export function MemorialTributes({ tributes, onWriteMessage }: MemorialTributesProps) {
  const sorted = [...tributes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-16 text-center">
        <h2 className="font-h2 text-3xl text-[#e5e2e1] md:text-4xl">Santuário de Homenagens</h2>
        <div className="mx-auto mt-4 h-[1px] w-16 bg-[#e9c349]" />
        <p className="mt-3 text-sm text-[#c4c7c7]">
          Flores de carinho e palavras enviadas por aqueles que mantêm sua chama acesa.
        </p>
      </div>

      {sorted.length > 0 ? (
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {sorted.map((item) => (
            <article
              key={item.id}
              className={`memorial-glass-panel relative flex flex-col justify-between rounded-xl p-6 transition-all duration-500 ${
                item.isPinned
                  ? "border-[#ffd700] bg-[#e9c349]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                  : "border-[#e9c349]/10 bg-[#1c2020]/20"
              }`}
            >
              {item.isPinned ? (
                <div className="absolute right-4 top-4 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#ffd700]">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    workspace_premium
                  </span>
                  <span>Destaque</span>
                </div>
              ) : (
                <span className="material-symbols-outlined absolute right-6 top-6 text-3xl text-[#e9c349] opacity-20" aria-hidden="true">
                  format_quote
                </span>
              )}
              <p className={`mb-4 pr-8 italic leading-7 ${item.isPinned ? "font-medium text-white" : "text-[#e0e3e2]"}`}>
                &quot;{item.message}&quot;
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <p className={`text-xs font-semibold ${item.isPinned ? "text-[#ffd700]" : "text-[#e9c349]"}`}>
                    {item.author}
                  </p>
                  {item.tag && (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${
                        item.isPinned
                          ? "border-[#ffd700]/30 bg-[#ffd700]/20 text-[#ffd700]"
                          : "border-[#e9c349]/20 bg-[#e9c349]/10 text-[#e9c349]"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-[0.65rem] uppercase tracking-wider text-[#c4c7c7]/80">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mb-12 text-center text-sm italic text-[#c4c7c7]/80">
          Ainda não há homenagens. Seja a primeira pessoa a deixar uma mensagem.
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onWriteMessage}
          disabled={!onWriteMessage}
          title={onWriteMessage ? undefined : "Disponível após a publicação do memorial"}
          className="rounded-full bg-[#e9c349] px-8 py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#101414] shadow-xl shadow-[#e9c349]/10 transition hover:bg-[#ffe088] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Escrever Mensagem no Livro de Condolências
        </button>
      </div>
    </div>
  );
}
