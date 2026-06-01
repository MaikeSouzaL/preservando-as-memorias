"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type FuneralHomeOfferLink } from "@/src/lib/platform-data";
import MemorialDesktopPreview from "@/src/components/memorial-desktop-preview";


type TimelineEvent = {
  id?: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
};

type FormData = {
  name: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  city: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl: string;
  videoUrl: string;
  gallery: Array<{ title: string; url: string }>;
  timelineEvents: TimelineEvent[];
};

export default function OfertaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [offer, setOffer] = useState<FuneralHomeOfferLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMemorial, setCreatedMemorial] = useState<{ id: string; name: string } | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    nickname: "",
    birthDate: "",
    deathDate: "",
    city: "",
    epitaph: "",
    biography: "",
    imageUrl: "",
    audioUrl: "",
    videoUrl: "",
    gallery: [],
    timelineEvents: [
      { year: "", title: "", description: "", imageUrl: "" }
    ],
  });

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadingTimelineIndex, setUploadingTimelineIndex] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: "imageUrl" | "audioUrl" | "videoUrl") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(fieldName);
    const uFormData = new FormData();
    uFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uFormData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload");

      setFormData(prev => ({ ...prev, [fieldName]: data.url }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Falha no upload: ${message}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    const newItems = [...formData.gallery];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uFormData = new FormData();
      uFormData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uFormData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro no upload");

        newItems.push({
          title: file.name.split(".")[0].slice(0, 40) || `Foto ${newItems.length + 1}`,
          url: data.url,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        alert(`Falha ao subir a foto "${file.name}": ${message}`);
      }
    }

    setFormData(prev => ({ ...prev, gallery: newItems }));
    setIsUploadingGallery(false);
  };

  const handleTimelineImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingTimelineIndex(index);
    const uFormData = new FormData();
    uFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uFormData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload");

      const newEvents = [...formData.timelineEvents];
      newEvents[index].imageUrl = data.url;
      setFormData(prev => ({ ...prev, timelineEvents: newEvents }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Falha no upload: ${message}`);
    } finally {
      setUploadingTimelineIndex(null);
    }
  };

  useEffect(() => {
    if (!slug) return;

    let active = true;

    async function loadOffer() {
      try {
        const response = await fetch(`/api/offer-links/${encodeURIComponent(slug)}`);
        if (!response.ok) {
          const payload = await response.json();
          if (active) {
            setError(payload.error || "Oferta não encontrada.");
          }
          return;
        }
        const payload = await response.json();
        if (active) {
          setOffer(payload.offerLink);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar a oferta.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadOffer();

    return () => {
      active = false;
    };
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/offer-links/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Não foi possível criar o memorial.");
      }

      const payload = await response.json();
      setCreatedMemorial({ id: payload.memorial.id, name: payload.memorial.name });
      
      const checkoutUrl = `${window.location.origin}/checkout?memorialId=${payload.memorial.id}&offerLinkId=${offer.id}&source=funeral_home_offer`;
      setPaymentLink(checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar memorial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPaymentLink = async () => {
    if (!paymentLink) return;
    try {
      await navigator.clipboard.writeText(paymentLink);
      alert("Link de pagamento copiado! Envie para a família.");
    } catch {
      alert("Não foi possível copiar o link.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] flex items-center justify-center">
        <div className="text-center text-[#e0e3e2]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e9c349] mx-auto mb-4"></div>
          <p>Carregando oferta...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] flex items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-red-500/30 bg-[#0a192f66] p-8 text-center backdrop-blur-md">
          <p className="text-red-400 mb-4">{error || "Oferta não encontrada."}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-[#e9c349] px-6 py-2.5 text-sm font-semibold text-[#101414] hover:bg-[#ffe088] transition"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (createdMemorial && paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="rounded-xl border border-green-500/30 bg-[#0a192f66] p-8 text-center backdrop-blur-md">
            <div className="mb-6">
              <span className="material-symbols-outlined text-6xl text-green-400">check_circle</span>
            </div>
            <h1 className="font-serif text-3xl text-[#e0e3e2] mb-2 font-bold">Memorial Criado com Sucesso!</h1>
            <p className="text-[#c4c7c7] mb-6">
              O memorial de <strong className="text-white">{createdMemorial.name}</strong> foi criado e está aguardando pagamento para liberar o QR Code.
            </p>
            
            <div className="space-y-3 mb-6 max-w-sm mx-auto">
              <button
                onClick={() => router.push(paymentLink)}
                className="w-full rounded-lg bg-[#e9c349] px-6 py-3 text-sm font-semibold text-[#101414] hover:bg-[#ffe088] transition shadow-lg shadow-[#e9c349]/20"
              >
                Pagar Agora
              </button>
              <button
                onClick={handleCopyPaymentLink}
                className="w-full rounded-lg border border-[#e9c349]/50 px-6 py-3 text-sm font-semibold text-[#e9c349] hover:bg-[#e9c349]/10 transition"
              >
                Copiar Link de Pagamento para a Família
              </button>
            </div>

            <p className="text-xs text-[#c4c7c7]/50">
              O QR Code será liberado automaticamente após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-12 px-4 lg:px-8 text-[#e0e3e2] antialiased">
      <style>{`
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif !important;
        }
        .text-glow {
          text-shadow: 0 0 15px rgba(233, 195, 73, 0.25) !important;
        }
        .glass-panel {
          background: rgba(28, 32, 32, 0.45) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(233, 195, 73, 0.08) !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Top Info Banner */}
        <div className="mb-8 p-6 rounded-xl border border-[#e9c349]/15 bg-[#0a192f66] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#e9c349]/40 to-transparent" />
          <h1 className="font-serif text-3xl font-bold text-white mb-2">Preencha o Memorial Querido</h1>
          <p className="text-sm text-[#c4c7c7] leading-relaxed">
            Você está criando o altar virtual de lembranças eternas. Através do plano da funerária parceira, as informações preenchidas ficarão salvas para sempre. O QR Code será impresso para a família e visitantes escanearem.
          </p>
        </div>

        {/* Real-time preview floating action top banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#0a192f66] p-4 rounded-xl border border-[#e9c349]/20 backdrop-blur-sm">
          <div>
            <h2 className="text-sm font-semibold text-[#e9c349] uppercase tracking-wider">Visualização em Tempo Real</h2>
            <p className="text-xs text-[#c4c7c7]/80">Veja exatamente como o memorial público oficial ficará na tela cheia.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowFullPreview(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/40 hover:bg-[#e9c349] hover:text-[#101414] px-6 py-2.5 text-xs font-bold tracking-widest text-[#e9c349] transition-all shadow-md active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-sm font-bold">visibility</span>
            <span>VISUALIZAR EM TELA CHEIA (1:1 CLONE)</span>
          </button>
        </div>

        {/* Main Form (Single full-width centered card) */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/5 bg-[#0a192f66] p-6 md:p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Section 1: Basic Information */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-[#e9c349] uppercase tracking-wider border-b border-[#e9c349]/10 pb-2">1. Dados Fundamentais</h3>
            
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Nome Completo *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: João Henrique da Silva"
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Apelido / Carinhoso (Opcional)</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Ex: Vovô Jão"
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Cidade Natal / Origem</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Rio de Janeiro - RJ"
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Data de Nascimento *</label>
                <input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Data de Falecimento *</label>
                <input
                  type="date"
                  name="deathDate"
                  required
                  value={formData.deathDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Epitáfio Sagrado *</label>
                <textarea
                  name="epitaph"
                  required
                  value={formData.epitaph}
                  onChange={handleChange}
                  placeholder="Uma frase marcante que resuma a essência de sua luz eterna..."
                  rows={2}
                  maxLength={400}
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                />
                <p className="mt-1 text-right text-[10px] text-[#c4c7c7]/40">{formData.epitaph.length}/400 caracteres</p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Biografia Detalhada *</label>
                <textarea
                  name="biography"
                  required
                  value={formData.biography}
                  onChange={handleChange}
                  placeholder="Conte a história, os valores de família, momentos inesquecíveis, conquistas e ensinamentos que devem atravessar gerações..."
                  rows={6}
                  maxLength={3000}
                  className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                />
                <p className="mt-1 text-right text-[10px] text-[#c4c7c7]/40">{formData.biography.length}/3000 caracteres</p>
              </div>
            </div>
          </div>

          {/* Section 2: Audio and Profile Image */}
          <div className="space-y-5 border-t border-white/5 pt-6">
            <h3 className="text-base font-semibold text-[#e9c349] uppercase tracking-wider border-b border-[#e9c349]/10 pb-2">2. Mídia e Áudio de Homenagem</h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Image */}
              <div className="bg-[#0a192f33] p-5 rounded-lg border border-white/5 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/70 font-semibold">Foto Principal do Falecido *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "imageUrl")}
                    className="hidden"
                    id="profile-img-upload"
                  />
                  <label
                    htmlFor="profile-img-upload"
                    className="cursor-pointer rounded-full bg-[#e9c349]/10 border border-[#e9c349]/30 hover:bg-[#e9c349] hover:text-[#101414] px-5 py-2 text-xs font-bold tracking-wider text-[#e9c349] transition-all shrink-0"
                  >
                    {isUploading === "imageUrl" ? "Carregando..." : "Selecionar Foto"}
                  </label>
                  {formData.imageUrl ? (
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.imageUrl} alt="Foto Ente Querido" className="h-12 w-12 rounded-full object-cover border border-[#e9c349]/20" />
                      <span className="text-[10px] text-green-400 font-semibold">Foto enviada com sucesso!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#c4c7c7]/40">Nenhuma foto enviada</span>
                  )}
                </div>
              </div>

              {/* Background Audio */}
              <div className="bg-[#0a192f33] p-5 rounded-lg border border-white/5 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/70 font-semibold">Mensagem de Voz ou Canção de Fundo (MP3)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, "audioUrl")}
                    className="hidden"
                    id="bg-audio-upload"
                  />
                  <label
                    htmlFor="bg-audio-upload"
                    className="cursor-pointer rounded-full bg-[#e9c349]/10 border border-[#e9c349]/30 hover:bg-[#e9c349] hover:text-[#101414] px-5 py-2 text-xs font-bold tracking-wider text-[#e9c349] transition-all shrink-0"
                  >
                    {isUploading === "audioUrl" ? "Carregando..." : "Selecionar Áudio"}
                  </label>
                  {formData.audioUrl ? (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-400">audiotrack</span>
                      <span className="text-[10px] text-green-400 font-semibold">Áudio de fundo ativado!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#c4c7c7]/40">Nenhum arquivo enviado</span>
                  )}
                </div>
              </div>

              {/* Video Tribute */}
              <div className="bg-[#0a192f33] p-5 rounded-lg border border-white/5 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/70 font-semibold">Tributo em Vídeo (Vídeo de Recordação MP4)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "videoUrl")}
                    className="hidden"
                    id="bg-video-upload"
                  />
                  <label
                    htmlFor="bg-video-upload"
                    className="cursor-pointer rounded-full bg-[#e9c349]/10 border border-[#e9c349]/30 hover:bg-[#e9c349] hover:text-[#101414] px-5 py-2 text-xs font-bold tracking-wider text-[#e9c349] transition-all shrink-0"
                  >
                    {isUploading === "videoUrl" ? "Carregando..." : "Selecionar Vídeo"}
                  </label>
                  {formData.videoUrl ? (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-400">videocam</span>
                      <span className="text-[10px] text-green-400 font-semibold">Vídeo enviado com sucesso!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#c4c7c7]/40">Nenhum vídeo enviado</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Gallery Album */}
          <div className="space-y-5 border-t border-white/5 pt-6">
            <div className="flex justify-between items-center border-b border-[#e9c349]/10 pb-2">
              <h3 className="text-base font-semibold text-[#e9c349] uppercase tracking-wider">3. Álbum de Lembranças</h3>
              <span className="text-[11px] text-[#c4c7c7]/50">{formData.gallery.length}/12 fotos</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#0a192f33] p-6 space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg py-8 px-4 text-center hover:border-[#e9c349]/30 transition">
                <span className="material-symbols-outlined text-4xl text-[#c4c7c7]/30 mb-2">collections</span>
                <p className="text-xs text-[#c4c7c7] mb-4">Crie uma galeria especial de fotos para os familiares recordarem.</p>
                
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#e9c349]/10 border border-[#e9c349]/30 px-6 py-2.5 text-xs font-bold tracking-widest text-[#e9c349] hover:bg-[#e9c349] hover:text-[#101414] transition-all">
                  <span>{isUploadingGallery ? "Enviando Imagens..." : "Selecionar Imagens"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploadingGallery}
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-[#c4c7c7]/40 mt-2">Você pode selecionar várias imagens de uma vez (PNG, JPG, WEBP)</span>
              </div>

              {formData.gallery.length > 0 && (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pt-2">
                  {formData.gallery.map((item, index) => (
                    <div key={index} className="relative rounded-lg border border-white/10 bg-[#0a192f66] overflow-hidden group shadow-lg">
                      <div className="relative aspect-square w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0 transition duration-500" />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = formData.gallery.filter((_, idx) => idx !== index);
                            setFormData(prev => ({ ...prev, gallery: newGallery }));
                          }}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">close</span>
                        </button>
                      </div>
                      <div className="p-2 bg-[#0b0f0f]/80">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newGallery = [...formData.gallery];
                            newGallery[index].title = e.target.value;
                            setFormData(prev => ({ ...prev, gallery: newGallery }));
                          }}
                          placeholder="Legenda da foto"
                          className="w-full bg-transparent border-b border-transparent focus:border-[#e9c349]/40 py-1 px-1 text-[11px] text-[#e0e3e2] placeholder-white/20 focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Polaroid Timeline Chapters */}
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div className="flex justify-between items-center border-b border-[#e9c349]/10 pb-2">
              <h3 className="text-base font-semibold text-[#e9c349] uppercase tracking-wider">4. Momentos de Luz (Linha do Tempo)</h3>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    timelineEvents: [
                      ...prev.timelineEvents,
                      { year: "", title: "", description: "", imageUrl: "" }
                    ]
                  }));
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 px-4 py-1.5 text-xs font-bold tracking-widest text-[#e9c349] hover:bg-[#e9c349]/20 transition active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                <span>Adicionar Capítulo</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.timelineEvents.map((event, index) => (
                <div key={index} className="rounded-xl border border-white/5 bg-[#0a192f33] p-5 space-y-4 relative shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#e9c349]">Capítulo #{index + 1}</span>
                    {formData.timelineEvents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newEvents = formData.timelineEvents.filter((_, idx) => idx !== index);
                          setFormData(prev => ({ ...prev, timelineEvents: newEvents }));
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition cursor-pointer uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Remover</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Ano do Acontecimento</label>
                      <input
                        type="text"
                        value={event.year}
                        onChange={(e) => {
                          const newEvents = [...formData.timelineEvents];
                          newEvents[index].year = e.target.value;
                          setFormData(prev => ({ ...prev, timelineEvents: newEvents }));
                        }}
                        placeholder="Ex: 1975"
                        className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Título do Acontecimento</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => {
                          const newEvents = [...formData.timelineEvents];
                          newEvents[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, timelineEvents: newEvents }));
                        }}
                        placeholder="Ex: Casamento dos Sonhos"
                        className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Descrição Detalhada</label>
                      <textarea
                        value={event.description}
                        onChange={(e) => {
                          const newEvents = [...formData.timelineEvents];
                          newEvents[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, timelineEvents: newEvents }));
                        }}
                        placeholder="Descreva o que tornou este acontecimento inesquecível..."
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Foto do Acontecimento</label>
                      <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0a192f66] p-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-background shrink-0">
                          {event.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={event.imageUrl} alt={`Capítulo ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#c4c7c7]/40">
                              <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                          )}
                          {uploadingTimelineIndex === index && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e9c349] border-t-transparent" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 px-4 py-2 text-xs font-bold text-[#e9c349] hover:bg-[#e9c349]/20 transition">
                            <span>{uploadingTimelineIndex === index ? "Enviando..." : "Selecionar Foto"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingTimelineIndex !== null}
                              onChange={(e) => handleTimelineImageUpload(e, index)}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-[#c4c7c7]/40">Imagens PNG, JPG ou WEBP de até 5MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    timelineEvents: [
                      ...prev.timelineEvents,
                      { year: "", title: "", description: "", imageUrl: "" }
                    ]
                  }));
                }}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-[#e9c349]/40 rounded-xl py-4 text-xs font-bold text-[#e9c349] hover:bg-[#e9c349]/5 transition cursor-pointer uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                <span>Adicionar Capítulo à Linha do Tempo</span>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#e9c349] px-6 py-4 text-sm font-bold text-[#101414] hover:bg-[#ffe088] transition shadow-xl shadow-[#e9c349]/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base font-bold">save</span>
              <span>{isSubmitting ? "Enviando Dados..." : "Salvar e Criar Altar Virtual"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Real-time 100% exact Preview Modal */}
      <MemorialDesktopPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        data={formData}
      />
    </div>
  );
}
