"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type FuneralHomeOfferLink } from "@/src/lib/platform-data";
import { MemorialForm, type MemorialFormData } from "@/src/components/memorial-form";

export default function OfertaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [offer, setOffer] = useState<FuneralHomeOfferLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdMemorial, setCreatedMemorial] = useState<{ id: string; name: string } | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    fetch(`/api/offer-links/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error ?? "Oferta não encontrada.");
        if (active) setOffer(payload.offerLink);
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, [slug]);

  async function handleSubmit(data: MemorialFormData) {
    if (!offer) throw new Error("Oferta não carregada.");

    const response = await fetch(`/api/offer-links/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Não foi possível criar o memorial.");

    setCreatedMemorial({ id: payload.memorial.id, name: payload.memorial.name });
    setPaymentLink(`${window.location.origin}/checkout?memorialId=${payload.memorial.id}&offerLinkId=${offer.id}&source=funeral_home_offer`);
  }

  async function handleCopyPaymentLink() {
    if (!paymentLink) return;
    try {
      await navigator.clipboard.writeText(paymentLink);
      alert("Link de pagamento copiado! Envie para a família.");
    } catch {
      alert("Não foi possível copiar o link.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0b0f0f]">
        <div className="text-center text-[#e0e3e2]">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#e9c349]" />
          <p>Carregando oferta...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] px-4">
        <div className="max-w-md rounded-xl border border-red-500/30 bg-[#0a192f66] p-8 text-center backdrop-blur-md">
          <p className="mb-4 text-red-400">{error ?? "Oferta não encontrada."}</p>
          <button onClick={() => router.push("/")} className="rounded-lg bg-[#e9c349] px-6 py-2.5 text-sm font-semibold text-[#101414] transition hover:bg-[#ffe088]">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (createdMemorial && paymentLink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] px-4 py-12">
        <div className="w-full max-w-2xl rounded-xl border border-green-500/30 bg-[#0a192f66] p-8 text-center backdrop-blur-md">
          <span className="material-symbols-outlined mb-4 block text-6xl text-green-400">check_circle</span>
          <h1 className="mb-2 text-3xl font-bold text-[#e0e3e2]">Memorial Criado!</h1>
          <p className="mb-6 text-[#c4c7c7]">
            O memorial de <strong className="text-white">{createdMemorial.name}</strong> aguarda pagamento para liberar o QR Code.
          </p>
          <div className="mx-auto mb-6 max-w-sm space-y-3">
            <button
              onClick={() => router.push(paymentLink)}
              className="w-full rounded-lg bg-[#e9c349] px-6 py-3 text-sm font-semibold text-[#101414] shadow-lg shadow-[#e9c349]/20 transition hover:bg-[#ffe088]"
            >
              Pagar Agora
            </button>
            <button
              onClick={handleCopyPaymentLink}
              className="w-full rounded-lg border border-[#e9c349]/50 px-6 py-3 text-sm font-semibold text-[#e9c349] transition hover:bg-[#e9c349]/10"
            >
              Copiar Link de Pagamento para a Família
            </button>
          </div>
          <p className="text-xs text-[#c4c7c7]/50">O QR Code será liberado automaticamente após confirmação do pagamento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] px-4 py-12 text-[#e0e3e2] antialiased lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative mb-8 overflow-hidden rounded-xl border border-[#e9c349]/15 bg-[#0a192f66] p-6 backdrop-blur-md">
          <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[#e9c349]/40 to-transparent" />
          <h1 className="mb-2 text-3xl font-bold text-white">Preencha o Memorial</h1>
          <p className="text-sm leading-relaxed text-[#c4c7c7]">
            Você está criando o memorial digital de lembranças eternas através do plano da funerária parceira.
            O QR Code será impresso para familiares e visitantes escanearem.
          </p>
        </div>

        <MemorialForm onSubmit={handleSubmit} submitLabel="Salvar e Criar Altar Virtual" />
      </div>
    </div>
  );
}
