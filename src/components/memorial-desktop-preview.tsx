"use client";

import { useState, useEffect, useMemo, CSSProperties } from "react";

interface TimelineEvent {
  year?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface GalleryItem {
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
  timelineEvents?: TimelineEvent[];
  gallery?: GalleryItem[];
}

interface MemorialDesktopPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: MemorialPreviewData;
}

export default function MemorialDesktopPreview({ isOpen, onClose, data }: MemorialDesktopPreviewProps) {
  const [showMemorial, setShowMemorial] = useState(false);
  const [heartsCount] = useState(12);
  const [candlesList] = useState<{ id: string; name: string; createdAt: Date; isEternal?: boolean }[]>([
    { id: "1", name: "Família Silva", createdAt: new Date() },
    { id: "2", name: "Amigo Próximo", createdAt: new Date(), isEternal: true },
    { id: "3", name: "Maria de Lourdes", createdAt: new Date() }
  ]);
  const [flowersCount] = useState(3);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  // Modals inside preview
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [tributes] = useState<{ id: string; author: string; message: string; date: string }[]>([
    { id: "1", author: "Família Silva", message: "Sempre será lembrado com muito carinho e saudade.", date: "Hoje" }
  ]);

  // Audio wave visualizer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Years format helper
  const yearsString = useMemo(() => {
    const getYear = (dateStr?: string) => {
      if (!dateStr) return "????";
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.getFullYear().toString();
      }
      const match = dateStr.match(/(\d{4})/);
      if (match) return match[1];
      return "????";
    };
    const birth = getYear(data.birthDate);
    const death = getYear(data.deathDate);
    return `${birth} - ${death}`;
  }, [data.birthDate, data.deathDate]);

  // Robust filtering of dynamic preview items
  const validTimeline = useMemo(() => {
    return data.timelineEvents?.filter(e => e.year || e.title || e.description || e.imageUrl) || [];
  }, [data.timelineEvents]);

  const validGallery = useMemo(() => {
    return data.gallery?.filter(g => g.url) || [];
  }, [data.gallery]);

  // Biography paragraphs
  const biographyParagraphs = useMemo(() => {
    if (!data.biography) {
      return [
        "A história de vida, conquistas, momentos marcantes e lições valiosas aparecerão renderizadas nesta seção solene para que todos que escanearem o QR code se recordem do legado."
      ];
    }
    return data.biography.split("\n").filter((p) => p.trim() !== "");
  }, [data.biography]);

  // Simulated loading transition
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowMemorial(true);
      }, 2500); // Quick 2.5s load for premium experience without wasting time
      return () => {
        clearTimeout(timer);
        setShowMemorial(false);
      };
    }
  }, [isOpen]);

  // Disable body scroll when preview is open to prevent double scrollbars
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      const originalHtmlStyle = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle || "";
        document.documentElement.style.overflow = originalHtmlStyle || "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLightCandle = () => {
    // Apenas exibição, nada acontece
  };

  const handleSendFlower = () => {
    // Apenas exibição, nada acontece
  };

  const handleTouchHeart = () => {
    // Apenas exibição, nada acontece
  };

  const handleLeaveTribute = (e: React.FormEvent) => {
    e.preventDefault();
    // Apenas exibição, nada acontece
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto no-scrollbar bg-[#101414] text-[#e0e3e2] antialiased select-none font-sans flex flex-col">
      {/* Styles for solene page elements */}
      <style>{`
        /* Esconde a barra de rolagem principal do navegador */
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
        }

        /* Esconde a barra de rolagem do contêiner do modal */
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        .glass-panel {
          background: rgba(28, 32, 32, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(233, 195, 73, 0.08);
        }
        .golden-glow {
          box-shadow: 0 0 40px rgba(233, 195, 73, 0.12);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(233, 195, 73, 0.25);
        }
        .timeline-line::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(233, 195, 73, 0.3), transparent);
          transform: translateX(-50%);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes loadProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-loading-bar {
          animation: loadProgress 2.5s linear forwards;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
          20% { transform: scale(0.9) rotate(1deg); opacity: 0.8; }
          40% { transform: scale(1.1) rotate(-2deg); opacity: 1; }
          60% { transform: scale(0.95) rotate(0deg); opacity: 0.85; }
          80% { transform: scale(1.05) rotate(2deg); opacity: 0.95; }
        }
        .animate-flicker {
          animation: flicker 0.6s infinite alternate ease-in-out;
          transform-origin: bottom center;
        }
        @keyframes floatParticle {
          0% { transform: translateY(10px) translateX(0) scale(0.5); opacity: 0; }
          25% { transform: translateY(-100px) translateX(var(--drift-1, -15px)) scale(0.8); opacity: 0.65; }
          50% { transform: translateY(-200px) translateX(var(--drift-2, 25px)) scale(1); opacity: 0.45; }
          75% { transform: translateY(-300px) translateX(var(--drift-3, -10px)) scale(0.85); opacity: 0.55; }
          100% { transform: translateY(-400px) translateX(var(--drift-4, 30px)) scale(1.15); opacity: 0; }
        }
        .animate-soul-particle {
          animation: floatParticle 8s infinite ease-in-out;
        }
        .polaroid-tilt-left {
          transform: rotate(-2deg) translateY(0);
          transition: all 0.4s ease;
        }
        .polaroid-tilt-left:hover {
          transform: rotate(0deg) scale(1.03) translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          z-index: 15;
        }
        .polaroid-tilt-right {
          transform: rotate(2deg) translateY(0);
          transition: all 0.4s ease;
        }
        .polaroid-tilt-right:hover {
          transform: rotate(0deg) scale(1.03) translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          z-index: 15;
        }
      `}</style>

      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-[#0b0f0f]/90 border-b border-[#e9c349]/20 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e9c349]">visibility</span>
          <span className="text-xs uppercase tracking-widest text-[#e5e2e1] font-bold">Modo de Visualização em Tempo Real (Desktop e Celular)</span>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-[#e9c349]/40 bg-[#101414] hover:bg-[#e9c349] hover:text-[#101414] px-5 py-2 text-xs font-bold tracking-widest text-[#e9c349] transition-all"
        >
          <span className="material-symbols-outlined text-sm font-bold">close</span>
          <span>FECHAR PREVIEW</span>
        </button>
      </div>

      <div className="flex-1 pt-16">
        {!showMemorial ? (
          /* STAGE 1: Cinematic Loading Transition */
          <div className="relative flex h-full min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden py-16">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
              <div className="absolute inset-0 bg-[#101414]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse" />
            </div>

            {/* Central Content */}
            <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-8 text-center">
              {/* Profile Image with Pulsing Glow */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-2 rounded-full bg-[#e9c349]/5 blur-xl" />
                <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border border-[#e9c349]/20 shadow-[0_0_30px_rgba(233,195,73,0.15)] md:h-48 md:w-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.imageUrl || "/images/hero-bg.png"}
                    alt={data.name || "Nome do Falecido"}
                    className="h-full w-full object-cover grayscale"
                  />
                </div>
              </div>

              {/* Typography */}
              <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] text-[#e5e2e1] mb-2 text-glow">
                {data.name || "Nome do Falecido"}
              </h1>
              <p className="text-sm tracking-[0.2em] text-[#e9c349] mb-6 uppercase">
                {yearsString}
              </p>
              <p className="text-xl italic text-[#e0e3e2] max-w-2xl mx-auto mb-12 opacity-80 leading-[1.3]">
                &quot;{data.epitaph || "Seu epitáfio inesquecível aqui..."}&quot;
              </p>

              {/* Progress bar */}
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-[#444748]/30">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-[#e9c349] shadow-[0_0_10px_rgba(233,195,73,0.5)] animate-loading-bar" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#e9c349]">
                  Acessando Altar Virtual...
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 2: Solene Page Replica */
          <div className="animate-fade-in">
            {/* Top Bar Navigation Mock */}
            <header className="sticky top-16 left-0 w-full z-[99] bg-[#0b0f0f]/80 backdrop-blur-xl border-b border-[#e9c349]/10 py-4 flex justify-between items-center px-8 md:px-16 shadow-md">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/imagens/logo.png" alt="Logo Preservando a Memória" className="h-10 w-auto object-contain drop-shadow-md scale-[1.5] origin-left mr-4" />
                <span className="font-serif text-lg text-[#e9c349] tracking-widest uppercase block">Preservando Memórias</span>
              </div>
              <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#c4c7c7]">
                <span className="text-[#e9c349] border-b border-[#e9c349] pb-1">O Homenageado</span>
                <span>Mensagem de Voz</span>
                <span>Linha do Tempo</span>
                <span>Vídeo</span>
                <span>Galeria</span>
                <span>Livro de Visitas</span>
              </nav>
            </header>

            {/* 1. Hero Section */}
            <section id="hero" className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden py-24">
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Sunset background"
                  className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlPHWWB0D4O9dBE5njYPYApqemNJW_mjoRil1mGOlf5rTEBWcQVRRApV-3eTWble-6Y2wlAITLTbPJu_GvtOBU5Ryc_HBHPh3mNA-xNXEno_9u4TNgFLfxXhA2sm-b3dEqtpIKe6jP9__IFCO6pPLwanXz7zvEeL-uTG-W0f_oClXTC-pCgzyLga86X41fsnxCcLrERVdExON0DJ5cVNnSv5QVL0zLsqRkPkHupebeAXSpXJ_TcEJVJdudKsQ_atqJukJhu-Szxhk"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101414] via-[#101414]/90 to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse" />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1200px] mx-auto">
                <div className="relative mb-8 group">
                  <div className="absolute -inset-3 rounded-full bg-[#e9c349]/10 blur-xl" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.imageUrl || "/images/hero-bg.png"}
                    alt={data.name || "Nome"}
                    className="w-44 h-44 md:w-52 md:h-52 object-cover rounded-full border border-[#e9c349]/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                  />
                </div>

                <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] text-[#e5e2e1] mb-1 text-glow">
                  {data.name || "Nome do Falecido"}
                </h1>
                {data.nickname && (
                  <p className="text-lg italic text-[#e9c349]/90 font-medium mb-3 font-serif animate-fade-in">
                    &quot;{data.nickname}&quot;
                  </p>
                )}
                <p className="text-sm md:text-base tracking-[0.2em] text-[#e9c349] uppercase mb-4 animate-fade-in">
                  {yearsString}
                </p>
                {data.city && (
                  <div className="flex items-center gap-1.5 justify-center text-xs tracking-wider text-[#c4c7c7] uppercase mb-8 font-semibold animate-fade-in">
                    <span className="material-symbols-outlined text-xs text-[#e9c349]">location_on</span>
                    <span>{data.city}</span>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-2xl justify-center">
                  <button
                    onClick={() => setShowTributeModal(true)}
                    className="px-8 py-3 bg-[#e9c349]/50 text-[#101414] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#e9c349] transition"
                  >
                    ❤️ DEIXAR HOMENAGEM
                  </button>
                  <button
                    onClick={handleLightCandle}
                    className="glass-panel px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                    title="Apenas visualização"
                  >
                    🔥 ACENDER VELA
                  </button>
                  <button
                    onClick={handleSendFlower}
                    className="glass-panel px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2 border border-pink-500/10"
                    title="Apenas visualização"
                  >
                    🌸 ENVIAR FLORES
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
                  <div onClick={handleTouchHeart} className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer hover:border-[#e9c349]/30">
                    <span className="material-symbols-outlined text-[#e9c349] text-sm animate-pulse">favorite</span>
                    <span className="text-xs text-[#c4c7c7]">{heartsCount} corações tocados</span>
                  </div>
                  <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#e9c349] text-sm">local_fire_department</span>
                    <span className="text-xs text-[#c4c7c7]">{candlesList.length} velas acesas</span>
                  </div>
                  <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#e9c349] text-sm">local_florist</span>
                    <span className="text-xs text-[#c4c7c7]">{flowersCount} flores enviadas</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Audio Message - Memória Viva */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto">
              <div className="glass-panel rounded-2xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-4 text-center md:text-left">
                  <span className="material-symbols-outlined text-4xl text-[#e9c349] mb-3">mic</span>
                  <h3 className="font-serif text-2xl text-[#e5e2e1] mb-2 font-bold">Mensagem de Voz</h3>
                  <p className="text-sm text-[#c4c7c7] leading-relaxed">
                    Ouvir a voz de quem amamos é uma das formas mais bonitas de reatar a proximidade e reviver os sentimentos.
                  </p>
                </div>
                <div className="md:col-span-8 flex flex-col justify-center bg-[#0b0f0f]/40 p-6 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-full bg-[#e9c349] flex items-center justify-center text-[#101414] hover:bg-[#ffe088] transition shadow-lg shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl font-bold">
                        {isPlayingAudio ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <div className="flex-1">
                      <p className="text-xs text-[#c4c7c7] uppercase tracking-widest font-semibold">Áudio de Lembranças</p>
                      <p className="text-xs text-[#c4c7c7]/50">Voz de {data.name || "Ente Querido"}</p>
                    </div>
                  </div>

                  {/* Wave Visualizer Mock */}
                  <div className="h-10 flex items-center gap-[4px] px-2 mb-4 justify-between">
                    {[20, 40, 15, 60, 30, 80, 45, 90, 25, 70, 35, 85, 40, 60, 15, 75, 50, 95, 20, 60, 30, 80, 45, 90, 15, 50, 35, 75, 40, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#e9c349] rounded-full transition-all duration-300"
                        style={{
                          height: isPlayingAudio ? `${Math.max(15, Math.sin((audioProgress + i) * 0.5) * h)}%` : `${15 + Math.sin(i * 0.5) * 10}%`,
                          opacity: isPlayingAudio ? 0.9 : 0.3
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#e9c349] transition-all"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Biography */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-5 relative">
                  <div className="absolute -inset-4 bg-[#e9c349]/5 rounded-xl golden-glow" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Vintage photograph"
                    className="w-full h-auto max-h-[350px] aspect-square object-cover rounded-xl shadow-2xl filter grayscale opacity-80 border border-[#e9c349]/15"
                    src={data.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBg_vgpJJyW8hKl8FJxjEG-F5ErhAPJ4Lsn7HFwJx8PUYoxj-myNebwG6r0CskS6me25PHCdeaGVU3vmtkO-7ycSRkOXCj9Oyo1u314GnCZJRlt5aO3rObAFo9m2C036jIVXlRKlw8283vidAwydQEqtCyXrwCscWVseDLMRgGppa6uinihhpG_wF-QWNCF1UPlKyS2qx9Ch3AOtorZT0ropBmuW5c1KOglgsGqOrj3jXNFIjnPXoG3V0lG1R7xHYg8zQzmbN82Etw"}
                  />
                </div>
                <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
                  <h2 className="font-serif text-3xl md:text-4xl text-[#e5e2e1] mb-6 font-bold">História preservada</h2>
                  <div className="text-base leading-8 text-[#c4c7c7] space-y-6">
                    {biographyParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-px bg-[#e9c349]/30 w-16" />
                    <span className="font-serif text-lg text-[#e9c349] italic font-semibold">&quot;O tempo passa, o amor permanece.&quot;</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Linha do Tempo (Polaroids) */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto relative">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl text-[#e5e2e1] font-bold uppercase tracking-widest">Linha do Tempo de Memórias</h2>
                <p className="text-sm text-[#c4c7c7] mt-2">Momentos inesquecíveis que moldaram uma vida de luz.</p>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              </div>

              {validTimeline.length === 0 ? (
                <div className="border border-dashed border-[#e9c349]/20 rounded-xl p-12 text-center max-w-lg mx-auto">
                  <span className="material-symbols-outlined text-4xl text-[#c4c7c7]/30">timeline</span>
                  <p className="text-sm text-[#c4c7c7] mt-3">Os eventos marcantes da linha do tempo com Polaroids aparecerão aqui...</p>
                </div>
              ) : (
                <div className="relative pl-8 md:pl-0 space-y-16 timeline-line">
                  {validTimeline.map((event, i) => {
                    const isEven = i % 2 === 0;
                    return (
                      <div key={i} className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                        {/* Node */}
                        <div className="absolute -left-[39px] md:left-1/2 md:-translate-x-1/2 top-4 md:top-auto w-4 h-4 bg-[#101414] border-2 border-[#e9c349] rounded-full z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-[#e9c349] rounded-full animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'}`}>
                          <div className={`w-full max-w-[320px] ${isEven ? 'polaroid-tilt-left' : 'polaroid-tilt-right'}`}>
                            {/* Polaroid */}
                            <div className="bg-[#fcfbf9] p-4 pb-6 shadow-2xl border border-[#e2dfd9] rounded-sm relative group overflow-hidden">
                              <div className="absolute inset-4 pointer-events-none border border-black/5 z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]" />
                              {event.imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={event.imageUrl}
                                  alt={event.title}
                                  className="w-full aspect-square object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                              ) : (
                                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-400">
                                  <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                              )}
                              <div className="pt-5 text-center">
                                <span className="font-serif italic text-2xl text-[#1a1a1a] block font-bold leading-none mb-1">
                                  {event.year || "Ano"}
                                </span>
                                <span className="font-serif text-sm tracking-wide text-[#3a3a3a] block font-semibold">
                                  {event.title || "Capítulo"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Opposite Side Description (Desktop Only) */}
                        <div className="hidden md:block w-1/2 pl-16 pr-16 text-[#c4c7c7] text-sm leading-7">
                          <p className={`max-w-xs ${isEven ? 'text-left' : 'text-right ml-auto'}`}>
                            {event.description || "Descrição do capítulo marcante..."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 5. Video Tribute */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl text-[#e5e2e1] font-bold">Tributo em Vídeo</h2>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              </div>
              <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#e9c349]/15 shadow-2xl bg-[#0b0f0f]">
                {data.videoUrl ? (
                  <video
                    src={data.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={data.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDlPHWWB0D4O9dBE5njYPYApqemNJW_mjoRil1mGOlf5rTEBWcQVRRApV-3eTWble-6Y2wlAITLTbPJu_GvtOBU5Ryc_HBHPh3mNA-xNXEno_9u4TNgFLfxXhA2sm-b3dEqtpIKe6jP9__IFCO6pPLwanXz7zvEeL-uTG-W0f_oClXTC-pCgzyLga86X41fsnxCcLrERVdExON0DJ5cVNnSv5QVL0zLsqRkPkHupebeAXSpXJ_TcEJVJdudKsQ_atqJukJhu-Szxhk"}
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlPHWWB0D4O9dBE5njYPYApqemNJW_mjoRil1mGOlf5rTEBWcQVRRApV-3eTWble-6Y2wlAITLTbPJu_GvtOBU5Ryc_HBHPh3mNA-xNXEno_9u4TNgFLfxXhA2sm-b3dEqtpIKe6jP9__IFCO6pPLwanXz7zvEeL-uTG-W0f_oClXTC-pCgzyLga86X41fsnxCcLrERVdExON0DJ5cVNnSv5QVL0zLsqRkPkHupebeAXSpXJ_TcEJVJdudKsQ_atqJukJhu-Szxhk"
                      alt="Video Cover"
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-[#101414]/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <button
                        onClick={() => alert("🎥 Reproduzindo tributo familiar (Simulação de Player)")}
                        className="w-16 h-16 rounded-full bg-[#e9c349]/10 border border-[#e9c349] hover:bg-[#e9c349] hover:text-[#101414] transition-all flex items-center justify-center text-[#e9c349] shadow-2xl cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-3xl">play_arrow</span>
                      </button>
                      <p className="mt-6 text-sm uppercase tracking-widest text-[#e9c349]">Assistir Homenagem Cinematográfica</p>
                      <p className="text-xs text-[#c4c7c7]/50 mt-1">Duração: 05:12 • Compilado pela Família</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 6. Photo Gallery */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto bg-[#0b0f0f]/30 border-y border-white/5">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl text-[#e5e2e1] font-bold">Galeria de Lembranças</h2>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              </div>

              {validGallery.length === 0 ? (
                <div className="border border-dashed border-[#e9c349]/20 rounded-xl p-12 text-center max-w-lg mx-auto">
                  <span className="material-symbols-outlined text-4xl text-[#c4c7c7]/30">photo_library</span>
                  <p className="text-sm text-[#c4c7c7] mt-3">As fotos enviadas do álbum aparecerão aqui...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {validGallery.map((item, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-[#141818] shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.title || ""}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0f] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition duration-300 flex flex-col justify-end p-4">
                        <p className="text-[#e9c349] font-serif text-sm font-semibold">{item.title || "Lembrança"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 7. Santuário de Homenagens (Book of Visitas) */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl text-[#e5e2e1] font-bold">Santuário de Homenagens</h2>
                <p className="text-sm text-[#c4c7c7] mt-2">Flores de carinho e palavras enviadas por aqueles que mantêm sua chama acesa.</p>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {tributes.map((item) => (
                  <article key={item.id} className="glass-panel p-6 rounded-xl relative flex flex-col justify-between border-[#e9c349]/10 bg-[#1c2020]/20">
                    <span className="material-symbols-outlined text-[#e9c349] opacity-25 text-3xl absolute top-6 right-6">format_quote</span>
                    <p className="italic leading-7 text-[#e0e3e2] pr-8 mb-4">&quot;{item.message}&quot;</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                      <span className="text-xs font-semibold text-[#e9c349]">{item.author}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#c4c7c7]/40">{item.date}</span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {}}
                  className="px-8 py-3 bg-[#e9c349]/50 text-[#101414] text-xs font-bold uppercase tracking-widest rounded-full opacity-70 cursor-not-allowed"
                  title="Apenas visualização"
                >
                  Escrever Mensagem no Livro de Condolências
                </button>
              </div>
            </section>

            {/* 8. Step-shelves Candle Altar */}
            <section className="py-20 px-6 max-w-[1200px] mx-auto">
              <div className="border border-[#e9c349]/10 bg-[#1c2020]/30 rounded-2xl p-8 max-w-4xl mx-auto text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#e9c349]/40 to-transparent" />
                
                <span className="material-symbols-outlined text-[#e9c349] text-4xl animate-pulse mb-2">church</span>
                <h3 className="font-serif text-2xl text-[#e5e2e1] uppercase tracking-widest mb-2">Altar de Chamas Eternas</h3>
                <p className="text-xs text-[#c4c7c7] max-w-lg mx-auto mb-12">
                  Cada vela acesa brilha por 7 dias simbólicos, elevando lembranças ao infinito.
                </p>

                {/* Step Shelf Altar */}
                <div className="relative w-full max-w-3xl mx-auto pt-16 pb-8 px-8 border-b-[6px] border-[#2a1f11] bg-gradient-to-t from-[#1a1208]/90 to-transparent rounded-t-xl overflow-hidden shadow-2xl">
                  {/* Floating soul particles inside preview */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-0 w-1 h-1 bg-[#e9c349] rounded-full blur-[0.5px] opacity-0 animate-soul-particle"
                        style={{
                          left: `${5 + i * 6.5}%`,
                          animationDelay: `${i * 0.4}s`,
                          "--drift-1": `${(i % 2 === 0 ? -1 : 1) * 15}px`,
                          "--drift-2": `${(i % 2 === 0 ? 1 : -1) * 20}px`,
                          "--drift-3": `${(i % 3 === 0 ? -1 : 1) * 15}px`,
                          "--drift-4": `${(i % 3 === 0 ? 1 : -1) * 25}px`,
                        } as CSSProperties & Record<`--${string}`, string>}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center flex-wrap gap-x-12 gap-y-16 items-end relative z-10 min-h-[90px]">
                    {candlesList.map((candle) => (
                      <div key={candle.id} className="flex flex-col items-center relative">
                        {/* Candle Flame */}
                        <div
                          className="absolute -top-7 w-3 h-5 bg-white rounded-full animate-flicker z-20"
                          style={{
                            boxShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(233,195,73,0.6)"
                          }}
                        >
                          <div className="absolute bottom-0 w-full h-1/2 bg-[#ffaa00] rounded-full blur-[0.5px]" />
                        </div>
                        {/* Burnt Wick */}
                        <div className="absolute -top-1 w-[2px] h-1.5 bg-[#1a1a1a] z-10" />
                        {/* Candle Body */}
                        <div className="w-5 h-14 bg-gradient-to-r from-[#ffe4b5] via-[#fff8dc] to-[#ffe4b5] rounded-t-sm rounded-b-md shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)]">
                          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute top-0 left-[2px] w-[2px] h-3 bg-[#fff8dc] rounded-full" />
                          </div>
                        </div>
                        <span className="text-[8px] text-[#e9c349] font-bold mt-2 uppercase tracking-wider">{candle.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleLightCandle}
                    className="px-6 py-2 bg-transparent border border-[#e9c349]/20 text-[#e9c349]/40 text-xs font-bold uppercase tracking-widest rounded-full cursor-not-allowed opacity-60"
                    title="Apenas visualização"
                  >
                    🔥 ACENDER NOVA VELA ETERNA
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0b0f0f] border-t border-[#e9c349]/10 py-16 text-center">
              <span className="font-serif text-xl text-[#e9c349] tracking-widest uppercase block mb-2">PRESERVANDO AS MEMÓRIAS</span>
              <p className="text-xs text-[#c4c7c7]/50">© 2026 Preservando a Memória. Todos os direitos reservados.</p>
            </footer>
          </div>
        )}
      </div>

      {/* Tribute Modal */}
      {showTributeModal && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTributeModal(false)} />
          <form
            onSubmit={handleLeaveTribute}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg text-[#e5e2e1] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e9c349]">rate_review</span>
                Escrever no Altar Virtual
              </h3>
              <button
                type="button"
                onClick={() => setShowTributeModal(false)}
                className="text-[#c4c7c7] hover:text-[#e9c349] transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Seu Nome / Parentesco</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Souza (Sobrinha)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-[#101414] border border-[#e9c349]/20 rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#e9c349]/60"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Mensagem de Homenagem</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Sua mensagem de amor eterno, saudade ou agradecimento..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-[#101414] border border-[#e9c349]/20 rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#e9c349]/60 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#e9c349] hover:bg-[#ffe088] text-[#101414] font-bold text-xs uppercase tracking-widest rounded-lg transition"
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
