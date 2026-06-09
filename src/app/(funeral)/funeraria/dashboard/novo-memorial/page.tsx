"use client";

import Link from "next/link";
import { useState } from "react";
import { MemorialForm, type MemorialFormData } from "@/src/components/memorial-form";

export default function NovoMemorialPage() {
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState("");

  async function handleSubmit(data: MemorialFormData) {
    const response = await fetch("/api/funeral-auth/memorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Erro ao criar memorial.");

    setCreatedName(payload.memorial.name);
    setPaymentLink(`/checkout?memorialId=${payload.memorial.id}&payerType=funeral_home`);
  }

  async function handleCopyLink() {
    if (!paymentLink) return;
    const full = `${window.location.origin}${paymentLink}`;
    try {
      await navigator.clipboard.writeText(full);
      alert("Link copiado! Envie para a família.");
    } catch {
      alert("Não foi possível copiar.");
    }
  }

  if (paymentLink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] px-4 py-12">
        <div className="w-full max-w-2xl rounded-xl border border-green-500/30 bg-[#0a192f66] p-8 text-center">
          <span className="material-symbols-outlined mb-4 block text-6xl text-green-400">check_circle</span>
          <h1 className="mb-2 text-2xl font-medium text-on-surface">Memorial Criado!</h1>
          <p className="mb-6 text-on-surface-variant">
            O memorial de <strong className="text-on-surface">{createdName}</strong> aguarda pagamento para liberar o QR Code.
          </p>
          <div className="mb-6 space-y-3">
            <Link
              href={paymentLink}
              className="block w-full rounded-lg bg-tertiary px-6 py-3 text-center text-sm font-semibold text-on-surface transition hover:bg-tertiary/90"
            >
              Pagar Agora
            </Link>
            <button
              onClick={handleCopyLink}
              className="w-full rounded-lg border border-tertiary/50 px-6 py-3 text-sm font-semibold text-tertiary transition hover:bg-tertiary/10"
            >
              Copiar Link de Pagamento para a Família
            </button>
          </div>
          <Link href="/funeraria/dashboard" className="text-sm text-on-surface-variant transition hover:text-tertiary">
            Voltar ao painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/funeraria/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-tertiary hover:underline">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao painel
          </Link>
          <h1 className="mb-2 text-[clamp(2rem,4vw,3rem)] font-light text-on-surface">Novo Memorial</h1>
          <p className="text-on-surface-variant">Preencha os dados do ente querido. O QR Code será liberado após o pagamento.</p>
        </div>

        <MemorialForm onSubmit={handleSubmit} submitLabel="Salvar Memorial" />
      </div>
    </div>
  );
}
