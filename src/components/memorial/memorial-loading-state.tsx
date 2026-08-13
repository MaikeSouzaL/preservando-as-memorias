"use client";

import Link from "next/link";

/**
 * Estado de carregamento rápido — sem espera artificial. Quem escaneia o QR
 * Code está de pé, no cemitério, com uma mão só e talvez 4G ruim; o conteúdo
 * precisa aparecer assim que os dados chegarem, não depois de uma "cerimônia"
 * cronometrada.
 */
export function MemorialLoading() {
  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-[#101414] px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="material-symbols-outlined animate-spin text-4xl text-[#e9c349]" aria-hidden="true">
        progress_activity
      </span>
      <p className="font-label-caps text-xs uppercase tracking-[0.15em] text-[#e9c349]">
        Carregando memorial...
      </p>
    </div>
  );
}

export function MemorialNotFound() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-[#101414] px-6 text-center">
      <span className="material-symbols-outlined text-5xl text-red-400" aria-hidden="true">
        error
      </span>
      <h1 className="font-h1 text-[clamp(1.75rem,5vw,2.5rem)] font-light text-[#e5e2e1]">
        Memorial não encontrado
      </h1>
      <p className="max-w-md text-sm text-[#c4c7c7]">
        O link de acesso ou QR Code é inválido ou expirou.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-[#e9c349] px-8 py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
      >
        Voltar para a página principal
      </Link>
    </div>
  );
}
