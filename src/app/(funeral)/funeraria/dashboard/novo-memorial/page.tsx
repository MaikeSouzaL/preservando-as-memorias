"use client";

import Link from "next/link";
import { useState } from "react";
import MemorialDesktopPreview from "@/src/components/memorial-desktop-preview";

type GalleryItem = {
  title: string;
  url: string;
};

export default function NovoMemorialPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState("");
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [form, setForm] = useState<{
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
    gallery: GalleryItem[];
    timelineEvents: Array<{ year: string; title: string; description: string; imageUrl: string }>;
  }>({
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

      setForm(prev => ({ ...prev, [fieldName]: data.url }));
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
    const newItems = [...form.gallery];

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

    setForm(prev => ({ ...prev, gallery: newItems }));
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

      const newEvents = [...form.timelineEvents];
      newEvents[index].imageUrl = data.url;
      setForm(prev => ({ ...prev, timelineEvents: newEvents }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Falha no upload: ${message}`);
    } finally {
      setUploadingTimelineIndex(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/funeral-auth/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Erro ao criar memorial.");
      }

      setCreatedName(payload.memorial.name);
      setPaymentLink(
        `/checkout?memorialId=${payload.memorial.id}&source=funeral_home_offer&payerType=funeral_home`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar memorial.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!paymentLink) return;
    const fullLink = `${window.location.origin}${paymentLink}`;
    try {
      await navigator.clipboard.writeText(fullLink);
      alert("Link de pagamento copiado! Envie para a familia.");
    } catch {
      alert("Nao foi possivel copiar.");
    }
  };

  if (paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-green-500/30 bg-[#0a192f66] p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-green-400 mb-4 block">
              check_circle
            </span>
            <h1 className="font-h2 text-2xl text-on-surface mb-2">Memorial Criado!</h1>
            <p className="text-on-surface-variant mb-6">
              O memorial de <strong className="text-on-surface">{createdName}</strong> foi
              criado e esta aguardando pagamento para liberar o QR Code.
            </p>

            <div className="space-y-3 mb-6">
              <Link
                href={paymentLink}
                className="block w-full rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-surface hover:bg-tertiary/90 transition text-center"
              >
                Pagar Agora
              </Link>
              <button
                onClick={handleCopyLink}
                className="w-full rounded-lg border border-tertiary/50 px-6 py-3 text-sm font-semibold text-tertiary hover:bg-tertiary/10 transition"
              >
                Copiar Link de Pagamento para a Familia
              </button>
            </div>

            <Link
              href="/funeraria/dashboard"
              className="text-sm text-on-surface-variant hover:text-tertiary transition"
            >
              Voltar ao painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/funeraria/dashboard"
            className="text-sm text-tertiary hover:underline inline-flex items-center gap-1 mb-4"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao painel
          </Link>
          <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface mb-2">
            Novo Memorial
          </h1>
          <p className="text-on-surface-variant">
            Preencha os dados do ente querido. O QR Code sera liberado apos o pagamento.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

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

        <div className="w-full">
          <form onSubmit={handleSubmit} className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Nome completo *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Nome do falecido"
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Apelido (opcional)
              </label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="Como era chamado"
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Cidade de origem"
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Data de nascimento
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Data de falecimento
              </label>
              <input
                type="date"
                name="deathDate"
                value={form.deathDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface focus:border-tertiary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Epitafio *
              </label>
              <textarea
                name="epitaph"
                required
                value={form.epitaph}
                onChange={handleChange}
                placeholder="Uma frase curta que resuma a essencia da pessoa"
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
              />
              <p className="mt-1 text-xs text-outline">{form.epitaph.length}/500 caracteres</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Biografia *
              </label>
              <textarea
                name="biography"
                required
                value={form.biography}
                onChange={handleChange}
                placeholder="Conte a historia de vida, valores, momentos marcantes..."
                rows={6}
                maxLength={2000}
                className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
              />
              <p className="mt-1 text-xs text-outline">{form.biography.length}/2000 caracteres</p>
            </div>

            {/* Foto Principal */}
            <div className="md:col-span-2 border-t border-outline-variant/20 pt-6">
              <h3 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-4">Fotos e Mensagens</h3>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Foto Principal do Falecido
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#0a192f33] p-4 rounded-lg border border-outline-variant/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imageUrl")}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer rounded-lg border border-tertiary/50 bg-[#0a192f66] px-4 py-2 text-xs font-semibold text-tertiary hover:bg-tertiary/10 transition"
                >
                  {isUploading === "imageUrl" ? "Enviando..." : "Selecionar Foto"}
                </label>
                {form.imageUrl ? (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-outline-variant" />
                    <span className="text-xs text-green-400">Enviada com sucesso!</span>
                  </div>
                ) : (
                  <span className="text-xs text-outline">Nenhuma imagem enviada</span>
                )}
              </div>
            </div>

            {/* Áudio de Fundo */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Áudio de Fundo (Mensagem de voz ou Canção MP3)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#0a192f33] p-4 rounded-lg border border-outline-variant/30">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, "audioUrl")}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer rounded-lg border border-tertiary/50 bg-[#0a192f66] px-4 py-2 text-xs font-semibold text-tertiary hover:bg-tertiary/10 transition"
                >
                  {isUploading === "audioUrl" ? "Enviando..." : "Selecionar Áudio"}
                </label>
                {form.audioUrl ? (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400">audiotrack</span>
                    <span className="text-xs text-green-400">Áudio enviado com sucesso!</span>
                  </div>
                ) : (
                  <span className="text-xs text-outline">Nenhum áudio enviado</span>
                )}
              </div>
            </div>

            {/* Tributo em Vídeo */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">
                Tributo em Vídeo (Vídeo de Recordação MP4)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#0a192f33] p-4 rounded-lg border border-outline-variant/30">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, "videoUrl")}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer rounded-lg border border-tertiary/50 bg-[#0a192f66] px-4 py-2 text-xs font-semibold text-tertiary hover:bg-tertiary/10 transition"
                >
                  {isUploading === "videoUrl" ? "Enviando..." : "Selecionar Vídeo"}
                </label>
                {form.videoUrl ? (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-400">videocam</span>
                    <span className="text-xs text-green-400">Vídeo enviado com sucesso!</span>
                  </div>
                ) : (
                  <span className="text-xs text-outline">Nenhum vídeo enviado</span>
                )}
              </div>
            </div>

             {/* Álbum / Galeria */}
             <div className="md:col-span-2 space-y-3">
               <div className="flex justify-between items-center">
                 <label className="block text-xs uppercase tracking-wider text-outline font-semibold">
                   Álbum de Fotos (Galeria de Lembranças)
                 </label>
                 <span className="text-[10px] text-outline">{form.gallery.length}/12 fotos</span>
               </div>

               <div className="rounded-xl border border-outline-variant/30 bg-[#0a192f33] p-6 space-y-4">
                 <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-lg py-8 px-4 text-center hover:border-tertiary/50 transition">
                   <span className="material-symbols-outlined text-4xl text-outline mb-2">collections</span>
                   <p className="text-xs text-[#c4c7c7] mb-3">Selecione fotos do seu computador ou celular para criar a galeria de lembranças.</p>
                   
                   <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-6 py-2.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                     <span>{isUploadingGallery ? "Enviando Imagens..." : "Selecionar do Computador / Celular"}</span>
                     <input
                       type="file"
                       multiple
                       accept="image/*"
                       disabled={isUploadingGallery}
                       onChange={handleGalleryUpload}
                       className="hidden"
                     />
                   </label>
                   <span className="text-[10px] text-outline mt-2">Você pode selecionar várias imagens de uma vez (PNG, JPG, WEBP)</span>
                 </div>

                 {form.gallery.length > 0 && (
                   <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pt-2">
                     {form.gallery.map((item, index) => (
                       <div key={index} className="relative rounded-lg border border-outline-variant/30 bg-[#0a192f66] overflow-hidden group shadow-lg">
                         <div className="relative aspect-square w-full">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0 transition" />
                           <button
                             type="button"
                             onClick={() => {
                               const newGallery = form.gallery.filter((_, idx) => idx !== index);
                               setForm(prev => ({ ...prev, gallery: newGallery }));
                             }}
                             className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                           >
                             <span className="material-symbols-outlined text-sm font-bold">close</span>
                           </button>
                         </div>
                         <div className="p-2 border-t border-outline-variant/20">
                           <input
                             type="text"
                             value={item.title}
                             onChange={(e) => {
                               const newGallery = [...form.gallery];
                               newGallery[index].title = e.target.value;
                               setForm(prev => ({ ...prev, gallery: newGallery }));
                             }}
                             placeholder="Legenda da foto"
                             className="w-full bg-transparent border-b border-transparent focus:border-tertiary py-1 px-1 text-[11px] text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-0 text-center"
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>

             {/* Linha do Tempo */}
             <div className="md:col-span-2 space-y-4 border-t border-outline-variant/20 pt-6">
               <div className="flex justify-between items-center pb-2">
                 <h3 className="font-h3 text-lg text-tertiary uppercase tracking-wider">Linha do Tempo (Momentos Marcantes)</h3>
                 <button
                   type="button"
                   onClick={() => {
                     setForm(prev => ({
                       ...prev,
                       timelineEvents: [
                         ...prev.timelineEvents,
                         { year: "", title: "", description: "", imageUrl: "" }
                       ]
                     }));
                   }}
                   className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 border border-tertiary/20 px-3 py-1 text-xs font-semibold text-tertiary hover:bg-tertiary/20 transition cursor-pointer"
                 >
                   <span className="material-symbols-outlined text-sm font-bold">add</span>
                   <span>Adicionar Capítulo</span>
                 </button>
               </div>

               {form.timelineEvents.map((event, index) => (
                 <div key={index} className="rounded-xl border border-tertiary/10 bg-[#0a192f33] p-5 space-y-4 relative">
                   <div className="flex justify-between items-center">
                     <span className="text-xs uppercase font-bold tracking-widest text-outline">Capítulo #{index + 1}</span>
                     {form.timelineEvents.length > 1 && (
                       <button
                         type="button"
                         onClick={() => {
                           const newEvents = form.timelineEvents.filter((_, idx) => idx !== index);
                           setForm(prev => ({ ...prev, timelineEvents: newEvents }));
                         }}
                         className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[10px] font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                       >
                         <span className="material-symbols-outlined text-xs">delete</span>
                         <span>Remover</span>
                       </button>
                     )}
                   </div>

                   <div className="grid gap-4 md:grid-cols-2">
                     <div>
                       <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Ano do Acontecimento</label>
                       <input
                         type="text"
                         value={event.year}
                         onChange={(e) => {
                           const newEvents = [...form.timelineEvents];
                           newEvents[index].year = e.target.value;
                           setForm(prev => ({ ...prev, timelineEvents: newEvents }));
                         }}
                         placeholder="Ex: 1975"
                         className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
                       />
                     </div>
                     <div>
                       <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Título do Acontecimento</label>
                       <input
                         type="text"
                         value={event.title}
                         onChange={(e) => {
                           const newEvents = [...form.timelineEvents];
                           newEvents[index].title = e.target.value;
                           setForm(prev => ({ ...prev, timelineEvents: newEvents }));
                         }}
                         placeholder="Ex: Casamento com Maria"
                         className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Descrição Detalhada</label>
                       <textarea
                         value={event.description}
                         onChange={(e) => {
                           const newEvents = [...form.timelineEvents];
                           newEvents[index].description = e.target.value;
                           setForm(prev => ({ ...prev, timelineEvents: newEvents }));
                         }}
                         placeholder="Descreva o que tornou este acontecimento inesquecível..."
                         rows={3}
                         className="w-full rounded-lg border border-outline-variant/50 bg-[#0a192f66] px-4 py-2.5 text-on-surface placeholder:text-outline focus:border-tertiary focus:outline-none"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline">Imagem do Momento</label>
                       <div className="flex items-center gap-4 rounded-lg border border-outline-variant/30 bg-[#0a192f66] p-4">
                         <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0">
                           {event.imageUrl ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={event.imageUrl} alt={`Capítulo ${index + 1}`} className="h-full w-full object-cover" />
                           ) : (
                             <div className="flex h-full w-full items-center justify-center text-outline">
                               <span className="material-symbols-outlined text-2xl">image</span>
                             </div>
                           )}
                           {uploadingTimelineIndex === index && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                               <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                             </div>
                           )}
                         </div>
                         <div className="flex flex-col gap-1.5">
                           <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                             <span>{uploadingTimelineIndex === index ? "Enviando..." : "Selecionar Foto"}</span>
                             <input
                               type="file"
                               accept="image/*"
                               disabled={uploadingTimelineIndex !== null}
                               onChange={(e) => handleTimelineImageUpload(e, index)}
                               className="hidden"
                             />
                           </label>
                           <span className="text-[10px] text-outline">PNG, JPG ou WEBP de até 5MB</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}

               {form.timelineEvents.length > 0 && (
                 <button
                   type="button"
                   onClick={() => {
                     setForm(prev => ({
                       ...prev,
                       timelineEvents: [
                         ...prev.timelineEvents,
                         { year: "", title: "", description: "", imageUrl: "" }
                       ]
                     }));
                   }}
                   className="w-full flex items-center justify-center gap-2 border border-dashed border-tertiary/40 rounded-xl py-4 text-xs font-semibold text-tertiary hover:bg-tertiary/5 hover:border-tertiary transition cursor-pointer"
                 >
                   <span className="material-symbols-outlined text-sm font-bold">add</span>
                   <span>Adicionar Capítulo à Linha do Tempo</span>
                 </button>
               )}
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-tertiary px-6 py-3 text-sm font-semibold text-on-surface hover:bg-tertiary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Salvando..." : "Salvar Memorial"}
          </button>
        </form>
      </div>
      <MemorialDesktopPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        data={form}
      />
    </div>
  </div>
  );
}
