"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MemorialStyles } from "@/src/components/memorial/memorial-styles";
import { MemorialHero } from "@/src/components/memorial/memorial-hero";
import { MemorialCandleAltar } from "@/src/components/memorial/memorial-candle-altar";
import { MemorialTimeline } from "@/src/components/memorial/memorial-timeline";
import { MemorialGallery } from "@/src/components/memorial/memorial-gallery";
import { MemorialTributes } from "@/src/components/memorial/memorial-tributes";
import type {
  CandleView,
  GalleryPhotoView,
  TimelineEventView,
  TributeView,
} from "@/src/components/memorial/types";

interface TimelineEventDraft {
  year?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface GalleryItemDraft {
  url?: string;
  title?: string;
}

interface MemorialPreviewData {
  name?: string;
  nickname?: string;
  birthDate?: string;
  deathDate?: string;
  city?: string;
  epitaph?: string;
  biography?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  timelineEvents?: TimelineEventDraft[];
  gallery?: GalleryItemDraft[];
}

interface MemorialDesktopPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: MemorialPreviewData;
}

const DEMO_CANDLES: CandleView[] = [
  { id: "1", name: "Família Silva", createdAt: new Date().toISOString() },
  { id: "2", name: "Amigo Próximo", createdAt: new Date().toISOString(), isEternal: true },
  { id: "3", name: "Maria de Lourdes", createdAt: new Date().toISOString() },
];

const DEMO_TRIBUTES: TributeView[] = [
  {
    id: "1",
    author: "Família Silva",
    message: "Sempre será lembrado com muito carinho e saudade.",
    createdAt: new Date().toISOString(),
  },
];

export default function MemorialDesktopPreview({ isOpen, onClose, data }: MemorialDesktopPreviewProps) {
  const [showMemorial, setShowMemorial] = useState(false);
  const [heartsCount, setHeartsCount] = useState(12);
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [tributes, setTributes] = useState<TributeView[]>(DEMO_TRIBUTES);

  const yearsString = useMemo(() => {
    const getYear = (dateStr?: string) => {
      if (!dateStr) return "????";
      const parsed = new Date(dateStr);
      if (!Number.isNaN(parsed.getTime())) return parsed.getFullYear().toString();
      const match = dateStr.match(/(\d{4})/);
      return match ? match[1] : "????";
    };
    return `${getYear(data.birthDate)} - ${getYear(data.deathDate)}`;
  }, [data.birthDate, data.deathDate]);

  const timelineEvents: TimelineEventView[] = useMemo(
    () =>
      (data.timelineEvents ?? [])
        .filter((e) => e.year || e.title || e.description || e.imageUrl)
        .map((e, i) => ({
          id: `draft_${i}`,
          year: e.year || "Ano",
          title: e.title || "Capítulo",
          description: e.description || "Descrição do capítulo marcante...",
          longStory: e.description || "Descrição do capítulo marcante...",
          imageUrl: e.imageUrl,
        })),
    [data.timelineEvents]
  );

  const galleryPhotos: GalleryPhotoView[] = useMemo(
    () => (data.gallery ?? []).filter((g) => g.url).map((g) => ({ title: g.title || "Lembrança", src: g.url })),
    [data.gallery]
  );

  const biographyParagraphs = useMemo(() => {
    if (!data.biography) {
      return [
        "A história de vida, conquistas, momentos marcantes e lições valiosas aparecerão renderizadas nesta seção solene para que todos que escanearem o QR code se recordem do legado.",
      ];
    }
    return data.biography.split("\n").filter((p) => p.trim() !== "");
  }, [data.biography]);

  // Transição de carregamento rápida (2,5s) — experiência de preview durante a
  // criação do memorial, propositalmente curta para não atrapalhar quem está editando.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowMemorial(true), 2500);
      return () => {
        clearTimeout(timer);
        setShowMemorial(false);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLeaveTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newMessage) return;
    setTributes((prev) => [
      { id: `draft_${Date.now()}`, author: newAuthor, message: newMessage, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setNewAuthor("");
    setNewMessage("");
    setShowTributeModal(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex select-none flex-col overflow-y-auto bg-[#101414] font-sans text-[#e0e3e2] antialiased [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <MemorialStyles />

      {/* Cabeçalho flutuante do preview */}
      <div className="fixed left-0 right-0 top-0 z-[10000] flex items-center justify-between border-b border-[#e9c349]/20 bg-[#0b0f0f]/90 px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e9c349]" aria-hidden="true">
            visibility
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e5e2e1]">
            Modo de Visualização em Tempo Real (Desktop e Celular)
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-[#e9c349]/40 bg-[#101414] px-5 py-2 text-xs font-bold tracking-widest text-[#e9c349] transition-all hover:bg-[#e9c349] hover:text-[#101414]"
        >
          <span className="material-symbols-outlined text-sm font-bold" aria-hidden="true">
            close
          </span>
          <span>FECHAR PREVIEW</span>
        </button>
      </div>

      <div className="flex-1 pt-16">
        {!showMemorial ? (
          <div className="relative flex h-full min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden py-16">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.08)_0%,transparent_65%)]" />

            <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-8 text-center">
              <div className="relative mb-8 h-32 w-32 overflow-hidden rounded-full border border-[#e9c349]/20 shadow-[0_0_30px_rgba(233,195,73,0.15)] md:h-48 md:w-48">
                <Image
                  src={data.imageUrl || "/images/hero-bg.png"}
                  alt={data.name || "Nome do falecido"}
                  fill
                  sizes="192px"
                  className="object-cover grayscale"
                />
              </div>

              <h1 className="font-h1 mb-2 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] text-[#e5e2e1]">
                {data.name || "Nome do Falecido"}
              </h1>
              <p className="mb-6 text-sm uppercase tracking-[0.2em] text-[#e9c349]">{yearsString}</p>
              <p className="mx-auto mb-12 max-w-2xl text-xl italic leading-[1.3] text-[#e0e3e2]/90">
                &quot;{data.epitaph || "Seu epitáfio inesquecível aqui..."}&quot;
              </p>

              <span className="material-symbols-outlined animate-spin text-2xl text-[#e9c349]" aria-hidden="true">
                progress_activity
              </span>
            </div>
          </div>
        ) : (
          <div className="memorial-fade-in">
            <header className="sticky top-16 left-0 z-[99] flex w-full items-center justify-between border-b border-[#e9c349]/10 bg-[#0b0f0f]/80 px-8 py-4 shadow-md backdrop-blur-xl md:px-16">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-3xl text-[#e9c349] drop-shadow-[0_0_10px_rgba(233,195,73,0.5)]"
                  aria-hidden="true"
                >
                  local_fire_department
                </span>
                <span className="font-serif text-base font-bold uppercase italic tracking-widest text-[#e9c349]">
                  PRESERVANDO MEMÓRIAS
                </span>
              </div>
              <nav className="hidden gap-8 text-xs font-bold uppercase tracking-widest text-[#c4c7c7] md:flex" aria-hidden="true">
                <span className="border-b border-[#e9c349] pb-1 text-[#e9c349]">O Homenageado</span>
                <span>Mensagem de Voz</span>
                <span>Linha do Tempo</span>
                <span>Vídeo</span>
                <span>Galeria</span>
                <span>Livro de Visitas</span>
              </nav>
            </header>

            <MemorialHero
              name={data.name || "Nome do Falecido"}
              nickname={data.nickname}
              years={yearsString}
              city={data.city}
              epitaph={data.epitaph || "Seu epitáfio inesquecível aqui..."}
              imageUrl={data.imageUrl || "/images/hero-bg.png"}
              heartsCount={heartsCount}
              candlesCount={DEMO_CANDLES.length}
              flowersCount={3}
              onTouchHeart={() => setHeartsCount((prev) => prev + 1)}
              onLeaveTribute={() => setShowTributeModal(true)}
            />

            {/* Mensagem de voz */}
            <section className="mx-auto max-w-[1200px] px-6 py-20">
              <div className="memorial-glass-panel grid grid-cols-1 items-center gap-8 rounded-2xl p-8 md:grid-cols-12">
                <div className="text-center md:col-span-4 md:text-left">
                  <span className="material-symbols-outlined mb-3 text-4xl text-[#e9c349]" aria-hidden="true">
                    mic
                  </span>
                  <h3 className="font-h3 mb-2 text-2xl font-bold text-[#e5e2e1]">Mensagem de Voz</h3>
                  <p className="text-sm leading-relaxed text-[#c4c7c7]">
                    Ouvir a voz de quem amamos é uma das formas mais bonitas de reatar a proximidade e reviver os
                    sentimentos.
                  </p>
                </div>
                <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-[#0b0f0f]/40 p-6 md:col-span-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">Áudio de Lembranças</p>
                  <p className="mt-1 text-xs text-[#c4c7c7]/80">
                    {data.audioUrl ? `Voz de ${data.name || "Ente Querido"}` : "Nenhum áudio enviado ainda"}
                  </p>
                </div>
              </div>
            </section>

            {/* Biografia */}
            <section className="mx-auto max-w-[1200px] px-6 py-20">
              <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
                <div className="relative md:col-span-5">
                  <div className="relative aspect-[4/5] max-h-[350px] w-full overflow-hidden rounded-xl border border-[#e9c349]/15 shadow-2xl">
                    <Image
                      src={data.imageUrl || "/images/hero-bg.png"}
                      alt="Fotografia"
                      fill
                      sizes="(min-width: 768px) 400px, 90vw"
                      className="object-cover grayscale opacity-90"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
                  <h2 className="font-h2 mb-6 text-3xl font-bold text-[#e5e2e1] md:text-4xl">História preservada</h2>
                  <div className="space-y-6 text-base leading-8 text-[#c4c7c7]">
                    {biographyParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <MemorialTimeline events={timelineEvents} />

            {/* Vídeo tributo */}
            <section className="mx-auto max-w-[1200px] px-6 py-20">
              <div className="mb-12 text-center">
                <h2 className="font-h2 text-3xl font-bold text-[#e5e2e1]">Tributo em Vídeo</h2>
                <div className="mx-auto mt-4 h-[1px] w-16 bg-[#e9c349]" />
              </div>
              <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl border border-[#e9c349]/15 bg-[#0b0f0f] shadow-2xl">
                {data.videoUrl ? (
                  <video src={data.videoUrl} controls className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <span className="material-symbols-outlined text-4xl text-[#c4c7c7]/40" aria-hidden="true">
                      videocam_off
                    </span>
                    <p className="text-sm text-[#c4c7c7]">O vídeo tributo enviado pela família aparecerá aqui.</p>
                  </div>
                )}
              </div>
            </section>

            <MemorialGallery photos={galleryPhotos} />

            <section className="mx-auto max-w-[1200px] px-6 py-20">
              <MemorialTributes tributes={tributes} onWriteMessage={() => setShowTributeModal(true)} />
              <MemorialCandleAltar candles={DEMO_CANDLES} />
            </section>

            <footer className="border-t border-[#e9c349]/10 bg-[#0b0f0f] py-16 text-center">
              <span className="font-serif mb-2 block text-xl uppercase tracking-widest text-[#e9c349]">
                PRESERVANDO MEMÓRIAS
              </span>
              <p className="text-xs text-[#c4c7c7]/80">© 2026 Preservando Memórias. Todos os direitos reservados.</p>
            </footer>
          </div>
        )}
      </div>

      {showTributeModal && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" onClick={() => setShowTributeModal(false)} />
          <form
            onSubmit={handleLeaveTribute}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif flex items-center gap-2 text-lg font-bold text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#e9c349]" aria-hidden="true">
                  rate_review
                </span>
                Escrever no Altar Virtual
              </h3>
              <button
                type="button"
                onClick={() => setShowTributeModal(false)}
                aria-label="Fechar"
                className="text-[#c4c7c7] transition hover:text-[#e9c349]"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="preview-tribute-author" className="mb-2 block text-[10px] uppercase tracking-wider text-[#c4c7c7]">
                  Seu Nome / Parentesco
                </label>
                <input
                  id="preview-tribute-author"
                  type="text"
                  required
                  placeholder="Ex: Ana Souza (Sobrinha)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full rounded-lg border border-[#e9c349]/20 bg-[#101414] p-3 text-xs text-[#e5e2e1] outline-none focus:border-[#e9c349]/60"
                />
              </div>
              <div>
                <label htmlFor="preview-tribute-message" className="mb-2 block text-[10px] uppercase tracking-wider text-[#c4c7c7]">
                  Mensagem de Homenagem
                </label>
                <textarea
                  id="preview-tribute-message"
                  required
                  rows={4}
                  placeholder="Sua mensagem de amor eterno, saudade ou agradecimento..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#e9c349]/20 bg-[#101414] p-3 text-xs text-[#e5e2e1] outline-none focus:border-[#e9c349]/60"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#e9c349] py-3 text-xs font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
              >
                Publicar Mensagem no Memorial
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
