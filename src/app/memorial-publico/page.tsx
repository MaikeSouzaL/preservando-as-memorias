"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState, useRef, type CSSProperties } from "react";
import { Memorial, Candle, TimelineEvent } from "@/src/mock-db/database";

interface ExtendedMemorial extends Memorial {
  audioUrl?: string;
  videoUrl?: string;
  nickname?: string;
  city?: string;
}
import Link from "next/link";
import SuccessModal from "@/src/components/success-modal";
import { Howl } from "howler";
import type { ManagedTribute } from "@/src/lib/platform-data";

const LOADING_DURATION_MS = 10000;

type GalleryPhoto = {
  title: string;
  src: string;
};

function defaultBiography(name: string) {
  return [
    `A vida de ${name} foi marcada por dedicação, afeto e presença. Cada lembrança preservada neste memorial ajuda a manter viva a história que a família deseja compartilhar.`,
    "Aqui ficam reunidos os valores, os momentos e as palavras que atravessam o tempo, para que cada visita ao QR Code seja também um gesto de carinho.",
  ];
}

function fallbackGallery(memorial: Memorial | null): GalleryPhoto[] {
  const imageUrl = memorial?.imageUrl || "/images/hero-bg.png";
  return [
    { title: "Foto principal", src: imageUrl },
    { title: "Memória de família", src: "/images/hero-bg.png" },
  ];
}

export default function MemorialPublicoPage() {
  const [memorial, setMemorial] = useState<ExtendedMemorial | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showMemorial, setShowMemorial] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isBgMuted, setIsBgMuted] = useState(true);
  const isBgMutedRef = useRef(isBgMuted);
  useEffect(() => {
    isBgMutedRef.current = isBgMuted;
  }, [isBgMuted]);

  // Memorial detailed interactive states
  const [candlesList, setCandlesList] = useState<Candle[]>([]);
  const [activeCandleId, setActiveCandleId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activePhoto, setActivePhoto] = useState<{ title: string; src: string } | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [biographyParagraphs, setBiographyParagraphs] = useState<string[]>([]);
  const [timelineList, setTimelineList] = useState<TimelineEvent[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryPhoto[]>([]);

  // New Candle Modal States
  const [showCandleModal, setShowCandleModal] = useState(false);
  const [newCandleName, setNewCandleName] = useState("");
  const [isCandleAnonymous, setIsCandleAnonymous] = useState(false);
  const [isCandleEternal, setIsCandleEternal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [heartsCount, setHeartsCount] = useState(0);
  const [flowersCount, setFlowersCount] = useState(18);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState("🕊️ Saudade");
  const [isTributePinned, setIsTributePinned] = useState(false);
  const [pixActionType, setPixActionType] = useState<"candle" | "tribute">("candle");
  const [showShareModal, setShowShareModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    type: "tribute" | "candle" | "flower" | null;
  }>({ isOpen: false, type: null });

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        scrollMode: 'smooth',
        behavior: 'smooth'
      } as ScrollToOptions);
    }
  };

  const [tributesList, setTributesList] = useState<ManagedTribute[]>([]);

  const loadInteractions = useCallback(async (memorialId: string) => {
    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorialId)}/interactions`);
      if (!response.ok) return;

      const payload = await response.json();
      setTributesList(Array.isArray(payload.tributes) ? payload.tributes : []);
      setCandlesList(Array.isArray(payload.candles) ? payload.candles : []);
    } catch {
      // Keep local fallback data if the interaction endpoint is unavailable.
    }
  }, []);

  const registerVisit = useCallback(async (memorialId: string) => {
    const storageKey = `memorial_visit_registered_${memorialId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorialId)}/visit`, {
        method: "POST",
      });
      const payload = await response.json();

      if (response.ok && typeof payload.visits === "number") {
        window.sessionStorage.setItem(storageKey, "true");
        setHeartsCount(payload.visits);
        setMemorial((current) => (current?.id === memorialId ? { ...current, visits: payload.visits } : current));
      }
    } catch {
      // A visita não deve impedir a exibição do memorial.
    }
  }, []);

  // Scroll opacity controller for floating sound button (only mobile)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const currentScroll = window.scrollY;
        const opacity = Math.max(0, 1 - currentScroll / 250);
        setScrollOpacity(opacity);
      } else {
        setScrollOpacity(1);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load correct memorial dynamic parameters from search URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromLanding = params.get("from") === "landing";
      const backButtonTimer = window.setTimeout(() => {
        setShowBackButton(fromLanding);
      }, 0);

      const memorialId = params.get("memorial") || params.get("id");

      const loadTimer = window.setTimeout(() => {
        if (memorialId) {
          fetch(`/api/memorials/${encodeURIComponent(memorialId)}`)
            .then((response) => response.json())
            .then((payload) => {
              if (payload.memorial) {
                const m = payload.memorial;
                const normalized: ExtendedMemorial = {
                  id: m.id,
                  name: m.name,
                  nickname: m.nickname || undefined,
                  city: m.city || undefined,
                  videoUrl: m.videoUrl || undefined,
                  years: payload.years || [m.birthDate, m.deathDate]
                    .filter(Boolean)
                    .map((date: unknown) => new Date(date as string).getFullYear())
                    .join(" - "),
                  epitaph: m.epitaph || "Memória preservada com carinho.",
                  imageUrl: m.imageUrl || "/images/hero-bg.png",
                  visits: m.visits ?? 0,
                  tributes: 0,
                  candles: 0,
                  status: m.status ?? "ativo",
                  createdAt: m.createdAt,
                  audioUrl: m.audioUrl || undefined,
                };

                setMemorial(normalized);
                setHeartsCount(normalized.visits);
                setBiographyParagraphs(
                  m.biography
                    ? m.biography.split(/\n{2,}/).map((item: string) => item.trim()).filter(Boolean)
                    : defaultBiography(normalized.name)
                );
                setTimelineList(Array.isArray(m.timelineEvents) ? m.timelineEvents : []);
                setGalleryList(
                  Array.isArray(m.gallery) && m.gallery.length > 0
                    ? m.gallery.map((item: { title: string; url: string }) => ({ title: item.title, src: item.url }))
                    : fallbackGallery(normalized)
                );
                loadInteractions(normalized.id);
                registerVisit(normalized.id);

                setTimeout(() => {
                  setShowMemorial(true);
                }, 1500);
              } else {
                setHasError(true);
              }
            })
            .catch(() => {
              setHasError(true);
            });
        } else {
          setHasError(true);
        }
      }, 0);

      return () => {
        window.clearTimeout(backButtonTimer);
        window.clearTimeout(loadTimer);
      };
    }
  }, [loadInteractions, registerVisit]);

  const soundRef = useRef<Howl | null>(null);
  const matchSoundRef = useRef<Howl | null>(null);
  const heartbeatSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/audio/bg-music.mp3'],
      loop: true,
      volume: 0.6,
      html5: true,
      onloaderror: (id, err) => {
        console.error("Howler não conseguiu carregar o áudio.", err);
      },
      onplayerror: () => {
        soundRef.current?.once('unlock', function() {
          if (!isBgMutedRef.current) soundRef.current?.play();
        });
      }
    });

    matchSoundRef.current = new Howl({
      src: ['/audio/match-strike.mp3'],
      volume: 1.0,
      html5: true
    });

    heartbeatSoundRef.current = new Howl({
      src: ['/audio/heartbeat.mp3'],
      volume: 1.0,
      html5: true,
      sprite: {
        short: [0, 5000]
      }
    });

    return () => {
      soundRef.current?.unload();
      matchSoundRef.current?.unload();
      heartbeatSoundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      if (isBgMuted) {
        soundRef.current.pause();
      } else {
        if (!soundRef.current.playing()) {
          soundRef.current.play();
        }
      }
    }
  }, [isBgMuted]);

  useEffect(() => {
    if (memorial && memorial.audioUrl) {
      const customUrl = memorial.audioUrl;
      if (soundRef.current) {
        soundRef.current.unload();
      }
      soundRef.current = new Howl({
        src: [customUrl],
        loop: true,
        volume: 0.6,
        html5: true,
        onloaderror: (id, err) => {
          console.error("Erro ao carregar áudio do memorial:", err);
        },
        onplayerror: () => {
          soundRef.current?.once('unlock', function() {
            if (!isBgMutedRef.current) soundRef.current?.play();
          });
        }
      });
      if (!isBgMuted) {
        soundRef.current.play();
      }
    }
  }, [memorial, isBgMuted]);

  const revealMemorial = useCallback(() => {
    setShowMemorial(true);
  }, []);

  useEffect(() => {
    if (showMemorial || hasError) return;

    const transitionTimer = setTimeout(() => {
      revealMemorial();
    }, LOADING_DURATION_MS);

    return () => clearTimeout(transitionTimer);
  }, [revealMemorial, showMemorial, hasError]);

  // Animação das barras de áudio — avança enquanto o áudio estiver tocando
  useEffect(() => {
    if (isBgMuted) return;
    const timer = setInterval(() => {
      setAudioProgress((prev) => (prev + 1) % 360);
    }, 80);
    return () => clearInterval(timer);
  }, [isBgMuted]);

  const handleLightCandle = () => {
    setShowCandleModal(true);
  };

  const handleSubmitCandle = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!memorial) return;
    const finalName = isCandleAnonymous ? "Visitante Anônimo" : (newCandleName || "Visitante");
    
    setTimeout(() => {
      matchSoundRef.current?.play();
    }, 50);

    const response = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "candle",
        name: finalName,
        isEternal: isCandleEternal,
      }),
    });

    if (!response.ok) return;

    const payload = await response.json();
    const newCandle = payload.candle as Candle;

    setCandlesList((prev) => [newCandle, ...prev]);
    setShowCandleModal(false);
    setNewCandleName("");
    setIsCandleEternal(false);
    setIsCandleAnonymous(false);
    setSuccessModal({ isOpen: true, type: "candle" });

    setTimeout(() => {
      const altar = document.getElementById('candle-altar');
      if (altar) altar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleSendFlower = () => {
    setFlowersCount((prev) => prev + 1);
    setSuccessModal({ isOpen: true, type: "flower" });
    setTimeout(() => {
      document.getElementById('tributes')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTouchHeart = () => {
    heartbeatSoundRef.current?.play('short');
    setHeartsCount((prev) => prev + 1);
  };

  const handleLeaveTribute = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!memorial) return;
    if (!newAuthor || !newMessage) return;
    
    setTimeout(() => {
      heartbeatSoundRef.current?.play('short');
    }, 50);

    const response = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "tribute",
        author: newAuthor,
        message: newMessage,
        tag: selectedTag,
        isPinned: isTributePinned,
      }),
    });

    if (!response.ok) return;

    const payload = await response.json();
    if (payload.tribute) {
      setTributesList((prev) => [payload.tribute, ...prev]);
    }

    setNewAuthor("");
    setNewMessage("");
    setIsTributePinned(false);
    setShowTributeModal(false);
    setSuccessModal({ isOpen: true, type: "tribute" });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Se houver erro, renderiza a tela premium de erro
  if (hasError) {
    return (
      <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#101414]">
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <img
            src="/images/hero-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 blur-[4px]"
          />
          <div className="absolute inset-0 bg-[#101414]/90 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse-glow" />
        </div>

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-8 text-center">
          <div className="relative mb-8 group">
            <div className="absolute -inset-4 rounded-full bg-red-500/10 blur-xl animate-pulse-glow" />
            <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-[#141d2b]/60 flex items-center justify-center md:h-48 md:w-48">
              <span className="material-symbols-outlined text-6xl text-red-400">
                error
              </span>
            </div>
          </div>

          <h1 className="font-h1 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#e5e2e1] mb-2">
            Memorial Não Encontrado
          </h1>
          <p className="font-body-md text-[0.85rem] tracking-[0.2em] text-[#e9c349] mb-12 uppercase">
            O link de acesso ou QR Code é inválido ou expirou.
          </p>

          <Link
            href="/"
            className="px-8 py-3 bg-[#e9c349] text-[#101414] font-label-caps text-xs tracking-widest rounded-full hover:bg-[#ffe088] transition shadow-xl shadow-[#e9c349]/10 uppercase font-semibold cursor-pointer"
          >
            Voltar para a Página Principal
          </Link>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#101414]">
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <img
            src="/images/hero-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 blur-[4px]"
          />
          <div className="absolute inset-0 bg-[#101414]/90 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse-glow" />
        </div>

        <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-8 text-center">
          <div className="relative mb-8 group">
            <div className="absolute -inset-4 rounded-full bg-[#e9c349]/10 blur-xl animate-pulse-glow" />
            <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border border-[#e9c349]/20 shadow-[0_0_30px_rgba(233,195,73,0.2)] bg-[#141d2b]/60 flex items-center justify-center md:h-48 md:w-48">
              <span className="material-symbols-outlined text-6xl text-[#e9c349] animate-pulse">
                local_fire_department
              </span>
            </div>
          </div>

          <h1 className="font-h1 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#e5e2e1] mb-2 text-glow">
            Preservando Legados
          </h1>
          <p className="font-body-md text-[0.85rem] tracking-[0.2em] text-[#e9c349] mb-12 uppercase">
            Buscando Memórias Queridas...
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-16 w-full">
            <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-[#444748]/30">
              <div className="absolute left-0 top-0 h-full rounded-full bg-[#e9c349] shadow-[0_0_10px_rgba(233,195,73,0.5)] animate-loading-bar" />
            </div>
            <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-[#e9c349]">
              Acessando Memórias...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101414] text-[#e0e3e2] antialiased overflow-x-hidden selection:bg-[#e9c349]/20 selection:text-[#e9c349]">
      <style>{`
        html {
          scroll-behavior: smooth;
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
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.6; }
        }
        .animate-pulse-glow {
          animation: pulseGlow 3s infinite ease-in-out;
        }
        @keyframes loadProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-loading-bar {
          animation: loadProgress 10s linear forwards;
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
        @keyframes smoke {
          0% {
            transform: translateY(0) scaleX(1) scaleY(1) rotate(0deg);
            opacity: 0;
            filter: blur(1px);
          }
          15% {
            opacity: 0.35;
            filter: blur(1.5px);
          }
          50% {
            transform: translateY(-25px) scaleX(1.8) scaleY(1.3) rotate(10deg);
            opacity: 0.18;
            filter: blur(3px);
          }
          100% {
            transform: translateY(-55px) scaleX(2.5) scaleY(1.8) rotate(-15deg);
            opacity: 0;
            filter: blur(5px);
          }
        }
        .animate-smoke {
          animation: smoke 3.5s infinite ease-out;
          transform-origin: bottom center;
        }
        @keyframes floatParticle {
          0% {
            transform: translateY(10px) translateX(0) scale(0.5);
            opacity: 0;
          }
          25% {
            transform: translateY(-250px) translateX(var(--drift-1, -15px)) scale(0.8);
            opacity: 0.65;
          }
          50% {
            transform: translateY(-500px) translateX(var(--drift-2, 25px)) scale(1);
            opacity: 0.45;
          }
          75% {
            transform: translateY(-750px) translateX(var(--drift-3, -10px)) scale(0.85);
            opacity: 0.55;
          }
          100% {
            transform: translateY(-1000px) translateX(var(--drift-4, 30px)) scale(1.15);
            opacity: 0;
          }
        }
        .animate-soul-particle {
          animation: floatParticle var(--duration, 7s) infinite ease-in-out;
        }
        .polaroid-tilt-left {
          transform: rotate(-2.5deg) translateY(0);
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .polaroid-tilt-left:hover {
          transform: rotate(-0.5deg) scale(1.04) translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          z-index: 15;
        }
        .polaroid-tilt-right {
          transform: rotate(2.5deg) translateY(0);
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .polaroid-tilt-right:hover {
          transform: rotate(0.5deg) scale(1.04) translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          z-index: 15;
        }
      `}</style>

      {!showMemorial && showBackButton && (
        <Link
          href="/"
          aria-label="Voltar para landing page"
          className="fixed left-4 top-4 z-[80] inline-flex items-center gap-2 rounded-full border border-[#e9c349]/30 bg-[#101414]/70 px-3 py-2 text-[#e9c349] backdrop-blur-md transition hover:bg-[#e9c349]/10 md:left-6 md:top-6"
        >
          <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
          <span className="font-label-caps text-[0.7rem] uppercase tracking-[0.14em]">Voltar</span>
        </Link>
      )}

      {!showMemorial ? (
        <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
            <img
              src="/images/hero-bg.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20 blur-[4px]"
            />
            <div className="absolute inset-0 bg-[#101414]/90 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse-glow" />
          </div>

          <div className="relative z-10 flex w-full max-w-[1200px] flex-col items-center px-8 text-center">
            <div className="relative mb-8 group">
              <div className="absolute -inset-2 rounded-full bg-[#e9c349]/5 blur-xl group-hover:bg-[#e9c349]/10 transition duration-500" />
              <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border border-[#e9c349]/20 shadow-[0_0_30px_rgba(233,195,73,0.15)] md:h-48 md:w-48">
                <img
                  src={memorial.imageUrl || "/images/hero-bg.png"}
                  alt={`Imagem de perfil de ${memorial.name}`}
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition duration-700"
                />
              </div>
            </div>

            <h1 className="font-h1 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#e5e2e1] mb-2 text-glow">
              {memorial.name}
            </h1>
            <p className="font-body-md text-[1rem] tracking-[0.2em] text-[#e9c349] mb-6 uppercase">
              {memorial.years}
            </p>
            <p className="font-h3 text-[1.5rem] italic text-[#e0e3e2] max-w-2xl mx-auto mb-16 opacity-80 leading-[1.3] line-clamp-2">
              &quot;{memorial.epitaph}&quot;
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mb-16 w-full">
              <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-[#444748]/30">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#e9c349] shadow-[0_0_10px_rgba(233,195,73,0.5)] animate-loading-bar"
                  onAnimationEnd={revealMemorial}
                />
              </div>
              <span className="font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-[#e9c349]">
                Acessando Memórias...
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="animate-fade-in">
          <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0f0f]/40 backdrop-blur-xl border-b border-[#e9c349]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex justify-center md:justify-between items-center px-8 md:px-16 py-4 transition-all duration-300">
            <Link href="/" className="flex flex-col md:flex-row items-center gap-2 md:gap-4 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-[#e9c349] drop-shadow-[0_0_12px_rgba(233,195,73,0.5)]">local_fire_department</span>
              <div className="font-serif italic text-base md:text-xl text-[#e9c349] font-bold tracking-widest uppercase text-center md:text-left leading-tight">PRESERVANDO MEMÓRIAS</div>
            </Link>
            <nav className="hidden md:flex gap-8">
              <a href="#hero" className="text-[#e9c349] font-semibold border-b border-[#e9c349] pb-1 font-label-caps text-xs tracking-widest uppercase">O Homenageado</a>
              <a href="#legacy" className="text-[#c4c7c7] font-label-caps text-xs tracking-widest uppercase hover:text-[#e9c349] transition">Legado</a>
              <a href="#voice" className="text-[#c4c7c7] font-label-caps text-xs tracking-widest uppercase hover:text-[#e9c349] transition">Memória Viva</a>
              <a href="#timeline" className="text-[#c4c7c7] font-label-caps text-xs tracking-widest uppercase hover:text-[#e9c349] transition">Linha do Tempo</a>
              <a href="#gallery" className="text-[#c4c7c7] font-label-caps text-xs tracking-widest uppercase hover:text-[#e9c349] transition">Galeria</a>
              <a href="#tributes" className="text-[#c4c7c7] font-label-caps text-xs tracking-widest uppercase hover:text-[#e9c349] transition">Santuário</a>
            </nav>
          </header>

          {/* 1. Hero Section */}
          <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-[240px] md:pt-[160px] pb-24">
            <div className="absolute inset-0 z-0">
              <img
                alt="Sunset background"
                className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlPHWWB0D4O9dBE5njYPYApqemNJW_mjoRil1mGOlf5rTEBWcQVRRApV-3eTWble-6Y2wlAITLTbPJu_GvtOBU5Ryc_HBHPh3mNA-xNXEno_9u4TNgFLfxXhA2sm-b3dEqtpIKe6jP9__IFCO6pPLwanXz7zvEeL-uTG-W0f_oClXTC-pCgzyLga86X41fsnxCcLrERVdExON0DJ5cVNnSv5QVL0zLsqRkPkHupebeAXSpXJ_TcEJVJdudKsQ_atqJukJhu-Szxhk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101414] via-[#101414]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.06)_0%,transparent_60%)] animate-pulse-glow" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1200px] mx-auto mt-12">
              <div className="relative mb-8 group animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                <div className="absolute -inset-2 rounded-full bg-[#e9c349]/10 blur-xl group-hover:bg-[#e9c349]/20 transition duration-700" />
                <img
                  src={memorial.imageUrl || "/images/hero-bg.png"}
                  alt={memorial.name}
                  className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border border-[#e9c349]/30 relative z-10 transition-all duration-700 hover:scale-105 filter grayscale hover:grayscale-0 shadow-[0_0_30px_rgba(233,195,73,0.15)]"
                />
              </div>

               <h1 className="font-h1 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] text-[#e5e2e1] mb-1 text-glow animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                {memorial.name}
              </h1>
              {memorial.nickname && (
                <p className="font-body-md text-lg italic text-[#e9c349]/90 font-medium mb-3 font-serif animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
                  &quot;{memorial.nickname}&quot;
                </p>
              )}
              <p className="font-body-md text-sm md:text-md tracking-[0.2em] text-[#e9c349] uppercase mb-4 animate-fade-in" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
                {memorial.years}
              </p>
              {memorial.city && (
                <div className="flex items-center gap-1.5 justify-center text-xs tracking-wider text-[#c4c7c7] uppercase mb-8 font-semibold animate-fade-in" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
                  <span className="material-symbols-outlined text-xs text-[#e9c349]">location_on</span>
                  <span>{memorial.city}</span>
                </div>
              )}

              {/* Quick Interactive Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-2xl justify-center animate-fade-in" style={{ animationDelay: '1400ms', animationFillMode: 'both' }}>
                <button
                  onClick={() => setShowTributeModal(true)}
                  className="relative px-6 py-3 border border-[#e9c349]/80 text-[#e9c349] font-label-caps text-xs tracking-widest rounded-full hover:bg-[#e9c349] hover:text-[#101414] transition-all duration-300 uppercase flex items-center justify-center gap-2 font-semibold shadow-[0_0_20px_rgba(233,195,73,0.3)] hover:shadow-[0_0_30px_rgba(233,195,73,0.5)] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[#e9c349]/10 animate-pulse group-hover:animate-none"></div>
                  <span className="material-symbols-outlined text-sm relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span className="relative z-10">Deixar Homenagem</span>
                </button>
                <button
                  onClick={handleLightCandle}
                  className="glass-panel px-6 py-3 text-[#e0e3e2] font-label-caps text-xs tracking-widest rounded-full hover:bg-white/5 transition-all duration-300 uppercase flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-[#e9c349]">local_fire_department</span>
                  Acender Vela
                </button>
                <button
                  onClick={handleSendFlower}
                  className="glass-panel px-6 py-3 text-[#e0e3e2] font-label-caps text-xs tracking-widest rounded-full hover:bg-white/5 transition-all duration-300 uppercase flex items-center justify-center gap-2 border border-pink-500/10 hover:border-pink-500/30"
                >
                  <span className="material-symbols-outlined text-sm text-pink-400">local_florist</span>
                  Enviar Flores
                </button>
              </div>

              {/* Emotional Counters & Share */}
              <div className="flex flex-row flex-wrap sm:flex-nowrap gap-3 sm:gap-4 items-center justify-center mb-10 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '1800ms', animationFillMode: 'both' }}>
                <button
                  onClick={handleTouchHeart}
                  className="w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-2 glass-panel rounded-full flex items-center justify-center gap-2 transition hover:scale-105 hover:border-[#e9c349]/35"
                  title={`${heartsCount} corações tocados`}
                >
                  <span className="material-symbols-outlined text-[#e9c349] text-xl sm:text-sm animate-pulse">favorite</span>
                  <span className="font-body-md text-xs text-[#c4c7c7] hidden sm:inline">{heartsCount} corações tocados</span>
                  <span className="absolute -top-1 -right-1 bg-[#e9c349] text-[#101414] text-[10px] font-bold px-1.5 py-0.5 rounded-full sm:hidden">{heartsCount}</span>
                </button>
                <div className="relative w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-2 glass-panel rounded-full flex items-center justify-center gap-2" title={`${candlesList.length} velas acesas`}>
                  <span className="material-symbols-outlined text-[#e9c349] text-xl sm:text-sm">local_fire_department</span>
                  <span className="font-body-md text-xs text-[#c4c7c7] hidden sm:inline">{candlesList.length} velas acesas</span>
                  <span className="absolute -top-1 -right-1 bg-[#e9c349] text-[#101414] text-[10px] font-bold px-1.5 py-0.5 rounded-full sm:hidden">{candlesList.length}</span>
                </div>
                <div className="relative w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-2 glass-panel rounded-full flex items-center justify-center gap-2" title={`${flowersCount} flores enviadas`}>
                  <span className="material-symbols-outlined text-[#e9c349] text-xl sm:text-sm">local_florist</span>
                  <span className="font-body-md text-xs text-[#c4c7c7] hidden sm:inline">{flowersCount} flores enviadas</span>
                  <span className="absolute -top-1 -right-1 bg-[#e9c349] text-[#101414] text-[10px] font-bold px-1.5 py-0.5 rounded-full sm:hidden">{flowersCount}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 sm:w-auto sm:h-auto sm:px-6 sm:py-2 glass-panel text-[#e0e3e2] font-label-caps text-xs tracking-[0.15em] rounded-full hover:bg-white/5 transition-all duration-300 uppercase flex items-center justify-center gap-2 border border-green-500/15 hover:border-green-500/35"
                  title="Compartilhar"
                >
                  <span className="material-symbols-outlined text-xl sm:text-sm text-green-400">share</span>
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-fade-in" style={{ animationDelay: '2200ms', animationFillMode: 'both' }}>
              <span className="font-label-caps text-[0.65rem] tracking-[0.2em] text-[#e9c349] uppercase">Descubra a História</span>
              <span className="material-symbols-outlined text-[#e9c349] animate-bounce text-sm">arrow_downward</span>
            </div>
          </section>

          {/* 2. Audio Message Section - Memória Viva */}
          {memorial.audioUrl && (
          <section id="voice" className="py-20 px-6 max-w-[1200px] mx-auto animate-fade-in" style={{ animationDelay: '2600ms', animationFillMode: 'both' }}>
            <div className="glass-panel rounded-2xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-[#e9c349]/10">
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <span className="material-symbols-outlined text-4xl text-[#e9c349] mb-4">mic_user</span>
                <h3 className="font-h3 text-2xl text-[#e5e2e1] mb-2">Mensagem de Voz</h3>
                <p className="text-sm text-[#c4c7c7] max-w-xs leading-relaxed">
                  Ouvir a voz de quem amamos é uma das formas mais bonitas de reatar a proximidade e reviver os sentimentos.
                </p>
              </div>
              <div className="md:col-span-8 flex flex-col justify-center bg-[#0b0f0f]/40 p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsBgMuted((m) => !m)}
                    className="w-12 h-12 rounded-full bg-[#e9c349] flex items-center justify-center text-[#101414] hover:bg-[#ffe088] transition shadow-lg shadow-[#e9c349]/20"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">
                      {!isBgMuted ? "pause" : "play_arrow"}
                    </span>
                  </button>
                  <div className="flex-1">
                    <p className="text-xs text-[#c4c7c7] uppercase tracking-widest font-semibold mb-1">Áudio de Lembranças</p>
                    <p className="text-xs text-[#c4c7c7]/50">{!isBgMuted ? "Tocando agora..." : `Áudio de ${memorial.name}`}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#e9c349]/60 text-xl">
                    {!isBgMuted ? "volume_up" : "volume_off"}
                  </span>
                </div>

                <div className="h-10 flex items-center gap-[4px] px-2 justify-between">
                  {[20, 40, 15, 60, 30, 80, 45, 90, 25, 70, 35, 85, 40, 60, 15, 75, 50, 95, 20, 60, 30, 80, 45, 90, 15, 50, 35, 75, 40, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#e9c349] rounded-full transition-all duration-300"
                      style={{
                        height: !isBgMuted ? `${Math.max(10, Math.sin((audioProgress + i) * 0.5) * height)}%` : "15%",
                        opacity: !isBgMuted ? 0.9 : 0.3
                      }}
                    />
                  ))}
                </div>

                {/* Aviso de direitos autorais */}
                <p className="mt-4 flex items-start gap-1.5 text-[0.6rem] leading-relaxed text-[#c4c7c7]/30">
                  <span className="material-symbols-outlined text-[0.7rem] shrink-0 mt-px">info</span>
                  Áudio enviado pela família. Os direitos sobre este conteúdo pertencem aos seus respectivos titulares. Preservando Memórias não detém direitos sobre o áudio aqui reproduzido.
                </p>
              </div>
            </div>
          </section>
          )}

          {/* 3. Introdução & Biografia */}
          <section id="legacy" className="py-20 px-6 max-w-[1200px] mx-auto animate-fade-in" style={{ animationDelay: '3000ms', animationFillMode: 'both' }}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 relative">
                <div className="absolute -inset-4 bg-[#e9c349]/5 rounded-xl golden-glow -z-10 animate-pulse-glow" />
                <img
                  alt="Fotografia de perfil"
                  className="w-full h-auto rounded-xl shadow-2xl filter grayscale opacity-80 border border-[#e9c349]/15"
                  src={memorial.imageUrl || "/images/hero-bg.png"}
                />
              </div>
              <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
                <h2 className="font-h2 text-3xl md:text-4xl text-[#e5e2e1] mb-6">História preservada</h2>
                <div className="font-body-lg text-[1rem] leading-8 text-[#c4c7c7] space-y-6">
                  {biographyParagraphs.map((paragraph, index) => (
                    <p key={`bio_${index}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px bg-[#e9c349]/30 w-16" />
                  <span className="font-h3 text-lg text-[#e9c349] italic">&quot;O tempo passa, o amor permanece.&quot;</span>
                </div>
              </div>
            </div>
          </section>

          {/* Vídeo Tributo */}
          {memorial.videoUrl && (
            <section id="video" className="py-20 px-6 max-w-[1200px] mx-auto animate-fade-in" style={{ animationDelay: '3200ms', animationFillMode: 'both' }}>
              <div className="text-center mb-10">
                <span className="material-symbols-outlined text-4xl text-[#e9c349] mb-3 block">play_circle</span>
                <h2 className="font-h2 text-2xl md:text-3xl text-[#e5e2e1] uppercase tracking-widest">Vídeo Tributo</h2>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
                <p className="text-[#c4c7c7] mt-3 text-sm">Um registro em vídeo que eterniza os momentos mais especiais.</p>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#e9c349]/15 shadow-2xl shadow-black/60 bg-[#0b0f0f]">
                <video
                  src={memorial.videoUrl}
                  controls
                  playsInline
                  className="w-full max-h-[560px] object-contain"
                  poster={memorial.imageUrl || undefined}
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
            </section>
          )}

          {/* Linha do Tempo de Memórias */}
          {timelineList.length > 0 && (
            <section id="timeline" className="py-20 px-6 max-w-[1200px] mx-auto animate-fade-in relative" style={{ animationDelay: '3000ms', animationFillMode: 'both' }}>
              <div className="text-center mb-16">
                <h2 className="font-h2 text-2xl md:text-3xl text-[#e5e2e1] uppercase tracking-widest">Linha do Tempo de Memórias</h2>
                <p className="text-sm text-[#c4c7c7] mt-2">Momentos inesquecíveis que moldaram uma vida de luz.</p>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              </div>

              <div className="relative border-l-2 border-dashed border-[#e9c349]/30 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-[2px] md:before:bg-gradient-to-b md:before:from-[#e9c349]/10 md:before:via-[#e9c349]/40 md:before:to-[#e9c349]/10 pl-8 md:pl-0 space-y-16">
                {timelineList.map((event, i) => {
                  const isEven = i % 2 === 0;
                  
                  return (
                    <div key={event.id} className="relative flex flex-col md:flex-row items-start md:items-center w-full">
                      <div className="absolute -left-[39px] md:left-1/2 md:-translate-x-1/2 top-4 md:top-auto w-[16px] h-[16px] bg-[#101414] border-2 border-[#e9c349] rounded-full z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#e9c349] rounded-full animate-pulse" />
                      </div>

                      <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'}`}>
                        <div 
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full max-w-[340px] cursor-pointer ${isEven ? 'polaroid-tilt-left' : 'polaroid-tilt-right'}`}
                        >
                          <div className="block md:hidden mb-4 text-[#c4c7c7] text-xs leading-relaxed border-l-2 border-[#e9c349]/40 pl-3">
                            <p className="italic font-light">{event.description}</p>
                          </div>

                          <div className="bg-[#fcfbf9] p-4 pb-6 shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-[#e2dfd9] rounded-sm relative group overflow-hidden">
                            <div className="absolute inset-4 pointer-events-none border border-black/5 z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]" />
                            <img 
                              src={event.imageUrl} 
                              alt={event.title}
                              className="w-full aspect-square object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                            <div className="pt-5 text-center">
                              <span className="font-serif italic text-2xl text-[#1a1a1a] block leading-none font-semibold mb-1">
                                {event.year}
                              </span>
                              <span className="font-serif text-sm tracking-wide text-[#3a3a3a] block font-medium">
                                {event.title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:block w-1/2 pl-16 pr-16 text-[#c4c7c7] text-sm leading-7">
                        <p className={`max-w-xs ${isEven ? 'text-left' : 'text-right ml-auto'}`}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. Galeria de Fotos */}
          {galleryList.length > 0 && (
            <section id="gallery" className="py-20 px-6 max-w-[1200px] mx-auto bg-[#0b0f0f]/30 border-y border-white/5 animate-fade-in relative" style={{ animationDelay: '4200ms', animationFillMode: 'both' }}>
              <div className="text-center mb-12">
                <h2 className="font-h2 text-3xl md:text-4xl text-[#e5e2e1]">Galeria de Lembranças</h2>
                <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
                <p className="text-[#c4c7c7] mt-3 text-sm">Momentos capturados e eternizados através das lentes do tempo.</p>
              </div>

              <div className="relative group/carousel px-4 md:px-12">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101414]/80 border border-[#e9c349]/30 text-[#e9c349] flex items-center justify-center hover:bg-[#e9c349] hover:text-[#101414] transition-all duration-300 z-20 cursor-pointer shadow-lg hover:scale-105"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>

                <button
                  onClick={() => scrollCarousel('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#101414]/80 border border-[#e9c349]/30 text-[#e9c349] flex items-center justify-center hover:bg-[#e9c349] hover:text-[#101414] transition-all duration-300 z-20 cursor-pointer shadow-lg hover:scale-105"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>

                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-4"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {galleryList.map((item, i) => (
                    <div
                      key={i}
                      className="snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group relative h-64 overflow-hidden rounded-xl border border-white/10 bg-[#141818] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:border-[#e9c349]/30"
                      onClick={() => setActivePhoto(item)}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0f] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition duration-500 flex flex-col justify-end p-4">
                        <p className="text-[#e9c349] font-h3 text-sm font-semibold">{item.title}</p>
                        <p className="text-[#c4c7c7] text-xs mt-1">Clique para ampliar</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activePhoto && (
                <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
                  <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActivePhoto(null)} />
                  
                  <button
                    onClick={() => setActivePhoto(null)}
                    className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 p-2 rounded-full hover:scale-110 z-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>

                  <div className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center animate-scale-up z-10 border border-[#e9c349]/25 shadow-[0_0_50px_rgba(233,195,73,0.3)] bg-[#0b0f0f] rounded-2xl p-2">
                    <img
                      src={activePhoto.src}
                      alt={activePhoto.title}
                      className="max-w-full max-h-[70vh] object-contain rounded-xl"
                    />
                    <div className="text-center py-4 px-6">
                      <h4 className="text-[#e9c349] font-h3 text-lg font-semibold uppercase tracking-widest">{activePhoto.title}</h4>
                      <p className="text-xs text-[#c4c7c7]/80 mt-1">Lembrança eterna guardada com carinho profundo</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 7. Santuário & Homenagens - Tributes */}
          <section id="tributes" className="py-20 px-6 max-w-[1200px] mx-auto animate-fade-in" style={{ animationDelay: '4600ms', animationFillMode: 'both' }}>
            <div className="text-center mb-16">
              <h2 className="font-h2 text-3xl md:text-4xl text-[#e5e2e1]">Santuário de Homenagens</h2>
              <div className="h-[1px] w-16 bg-[#e9c349] mx-auto mt-4" />
              <p className="text-[#c4c7c7] mt-3 text-sm">Flores de carinho e palavras enviadas por aqueles que mantêm sua chama acesa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[...tributesList]
                .sort((a, b) => {
                  if (a.isPinned && !b.isPinned) return -1;
                  if (!a.isPinned && b.isPinned) return 1;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((item) => (
                  <article
                    key={item.id}
                    className={`glass-panel p-6 rounded-xl relative flex flex-col justify-between transition-all duration-500 ${
                      item.isPinned 
                        ? "border-[#ffd700] bg-[#e9c349]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] scale-[1.02]" 
                        : "border-[#e9c349]/10 bg-[#1c2020]/20 hover:border-[#e9c349]/30"
                    }`}
                  >
                    {item.isPinned ? (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-[#ffd700] text-[0.65rem] font-bold tracking-widest uppercase">
                        <span className="material-symbols-outlined text-sm animate-pulse">workspace_premium</span>
                        <span>Destaque Premium</span>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-[#e9c349] opacity-20 text-3xl absolute top-6 right-6">format_quote</span>
                    )}
                    <p className={`italic leading-7 pr-8 mb-4 ${item.isPinned ? "text-white font-medium" : "text-[#e0e3e2]"}`}>&quot;{item.message}&quot;</p>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <div className="flex items-center gap-3">
                        <p className={`text-xs font-semibold ${item.isPinned ? "text-[#ffd700]" : "text-[#e9c349]"}`}>{item.author}</p>
                        {item.tag && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] border font-semibold uppercase tracking-wider ${
                            item.isPinned 
                              ? "bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30" 
                              : "bg-[#e9c349]/10 text-[#e9c349] border-[#e9c349]/20"
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[0.65rem] uppercase tracking-wider text-[#c4c7c7]/50">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </article>
                ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setPixActionType("tribute");
                  setIsTributePinned(false);
                  setShowTributeModal(true);
                }}
                className="px-8 py-3 bg-[#e9c349] text-[#101414] font-label-caps text-xs tracking-widest rounded-full hover:bg-[#ffe088] transition shadow-xl shadow-[#e9c349]/10 uppercase font-semibold cursor-pointer"
              >
                Escrever Mensagem no Livro de Condolências
              </button>
            </div>

            {/* Santuário de Velas */}
            <div className="mt-20 border border-[#e9c349]/10 bg-[#1c2020]/30 rounded-2xl p-8 max-w-5xl mx-auto text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e9c349]/40 to-transparent" />
              
              <div className="flex justify-center mb-4">
                <span className="material-symbols-outlined text-[#e9c349] text-4xl animate-pulse">church</span>
              </div>
              <h3 className="font-h3 text-2xl text-[#e5e2e1] uppercase tracking-widest mb-2 text-glow">Altar de Chamas Eternas</h3>
              <p className="text-sm text-[#c4c7c7] max-w-lg mx-auto mb-12">
                Cada vela acesa brilha por 7 dias simbólicos, derretendo lentamente enquanto eleva suas preces e lembranças ao infinito.
              </p>
              
              <div id="candle-altar" className="relative w-full max-w-5xl mx-auto pt-16 pb-8 px-4 sm:px-8 border-b-8 border-[#2a1f11] bg-gradient-to-t from-[#1a1208]/90 to-transparent rounded-t-xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none transition-opacity duration-1000 z-0"
                  style={{ 
                    opacity: Math.min(1.0, 0.2 + (candlesList.filter(c => c.isEternal || (Math.floor(Math.abs(new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)) < 8)).length * 0.08)) 
                  }}
                />

                {/* Partículas Etéreas */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const leftPercent = 3 + (i * 3.2);
                    const delay = -((i * 0.45) % 12);
                    const duration = 6 + (i % 5) * 1.8;
                    
                    const drift1 = `${(i % 2 === 0 ? -1 : 1) * (15 + (i % 3) * 12)}px`;
                    const drift2 = `${(i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 15)}px`;
                    const drift3 = `${(i % 3 === 0 ? -1 : 1) * (15 + (i % 2) * 18)}px`;
                    const drift4 = `${(i % 3 === 0 ? 1 : -1) * (35 + (i % 4) * 20)}px`;

                    return (
                      <div
                        key={i}
                        className="absolute bottom-0 w-[4px] h-[4px] bg-[#e9c349] rounded-full blur-[0.5px] opacity-0 animate-soul-particle"
                        style={{
                          left: `${leftPercent}%`,
                          "--duration": `${duration}s`,
                          "--drift-1": drift1,
                          "--drift-2": drift2,
                          "--drift-3": drift3,
                          "--drift-4": drift4,
                          animationDelay: `${delay}s`,
                        } as CSSProperties & Record<`--${string}`, string>}
                      />
                    );
                  })}
                </div>
                
                <div className="flex flex-col gap-y-12 items-center min-h-[140px] relative z-10">
                  {candlesList.length > 0 ? (
                    Array.from({ length: Math.ceil(Math.min(30, candlesList.length) / 10) }).map((_, rowIndex) => {
                      const rowCandles = candlesList.slice(rowIndex * 10, (rowIndex + 1) * 10);
                      
                      return (
                        <div key={rowIndex} className="relative flex justify-center flex-wrap gap-x-3 sm:gap-x-12 gap-y-14 items-end w-full pb-3">
                          <div className="absolute bottom-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-[#e9c349]/30 to-transparent shadow-[0_0_10px_rgba(233,195,73,0.2)]" />
                          <div className="absolute bottom-0 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-transparent via-[#2a1f11] to-transparent blur-sm" />

                          {rowCandles.map((candle) => {
                            const today = new Date();
                            const createdDate = new Date(candle.createdAt);
                            const ageInDays = Math.floor(Math.abs(today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

                            const isExpired = !candle.isEternal && ageInDays >= 8;
                            const isDying = !candle.isEternal && ageInDays === 7;
                            const heightPercent = candle.isEternal ? 100 : Math.max(15, 100 - (Math.min(7, ageInDays) * 12));
                            const isActive = activeCandleId === candle.id;

                            return (
                              <div 
                                key={candle.id} 
                                className="flex flex-col items-center group relative cursor-pointer" 
                                onClick={() => setActiveCandleId(isActive ? null : candle.id)}
                              >
                                <div className={`absolute -top-16 transition-opacity duration-300 text-[0.6rem] font-bold tracking-wider uppercase bg-[#0b0f0f] text-[#e9c349] px-3 py-2 rounded border border-[#e9c349]/30 pointer-events-none z-30 shadow-2xl whitespace-nowrap text-center flex flex-col items-center justify-center ${isActive ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}>
                                  <span className="text-[#e5e2e1] block mb-1 flex items-center gap-1">
                                    {candle.isEternal && <span className="material-symbols-outlined text-[0.6rem] text-[#e9c349]">all_inclusive</span>}
                                    {candle.name}
                                  </span>
                                  <span className="text-[#e9c349]/70 text-[0.55rem]">
                                    {candle.isEternal && "Chama Eterna • "}
                                    {ageInDays === 0 ? "Acesa hoje" : `há ${ageInDays} dias`}
                                  </span>
                                </div>

                                <div className="relative flex flex-col justify-end items-center" style={{ height: '90px', width: '28px' }}>
                                  {!isExpired ? (
                                    <>
                                      <div 
                                        className={`absolute -top-6 w-3.5 h-6 bg-[#fff] rounded-[50%_50%_20%_20%] z-20 origin-bottom transition-all duration-700 ease-out md:group-hover:skew-x-[12deg] md:group-hover:rotate-6 ${isDying ? 'animate-pulse' : 'animate-flicker'}`}
                                        style={{ 
                                          bottom: `${heightPercent}%`, 
                                          top: 'auto',
                                          transform: `translateY(4px) scale(${candle.isEternal ? 1.2 : (isDying ? 0.65 : 1)})`,
                                          boxShadow: isDying 
                                            ? '0 0 5px rgba(255,255,255,0.4), 0 0 10px rgba(233,195,73,0.3)' 
                                            : '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(233,195,73,0.6)',
                                          opacity: isDying ? 0.7 : 1
                                        }}
                                      >
                                        <div className="absolute bottom-0 w-full h-1/2 bg-[#ffaa00] rounded-[50%] blur-[1px]" />
                                        {candle.isEternal && (
                                          <div className="absolute -inset-2 bg-[#e9c349]/20 rounded-full blur-md animate-pulse" />
                                        )}
                                      </div>

                                      <div 
                                        className="absolute w-[2px] h-2 bg-[#1a1a1a] z-10 left-[13px]" 
                                        style={{ bottom: `${heightPercent}%`, transform: 'translateY(2px)' }} 
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {ageInDays === 8 && (
                                        <div className="absolute left-[13px] w-[2px] h-0 z-20 pointer-events-none" style={{ bottom: `${heightPercent}%` }}>
                                          <div 
                                            className="absolute bottom-1 -left-[2px] w-1.5 h-10 bg-gradient-to-t from-white/25 via-white/10 to-transparent rounded-full blur-[2px] animate-smoke" 
                                            style={{ transformOrigin: 'bottom center' }} 
                                          />
                                          <div 
                                            className="absolute bottom-1 -left-[2px] w-1.5 h-10 bg-gradient-to-t from-white/20 via-white/5 to-transparent rounded-full blur-[2px] animate-smoke" 
                                            style={{ transformOrigin: 'bottom center', animationDelay: '1s' }} 
                                          />
                                        </div>
                                      )}
                                      
                                      <div 
                                        className="absolute w-[2px] h-2 bg-[#000] z-10 left-[13px]" 
                                        style={{ bottom: `${heightPercent}%`, transform: 'translateY(2px)' }} 
                                      />
                                    </>
                                  )}

                                  <div 
                                    className="w-6 bg-gradient-to-r from-[#ffe4b5] via-[#fff8dc] to-[#ffe4b5] rounded-t-sm rounded-b-md relative z-0 shadow-[-3px_0_6px_rgba(0,0,0,0.6)_inset]" 
                                    style={{ 
                                      height: `${heightPercent}%`,
                                      transition: 'height 1s ease-in-out' 
                                    }}
                                  >
                                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-t-sm">
                                      <div className="absolute top-0 left-[3px] w-[3px] h-4 bg-[#fff8dc] rounded-full opacity-90 shadow-[1px_1px_1px_rgba(0,0,0,0.1)]" />
                                      <div className="absolute top-1 right-[2px] w-[2px] h-5 bg-[#fff] rounded-full opacity-80 shadow-[1px_1px_1px_rgba(0,0,0,0.1)]" />
                                    </div>
                                    <div className="absolute -top-[3px] left-0 w-full h-[6px] bg-[#fffacd] rounded-[50%] shadow-[0_2px_3px_rgba(0,0,0,0.3)_inset]" />
                                  </div>

                                  {ageInDays > 0 && !candle.isEternal && (
                                    <div className="absolute -bottom-[2px] w-8 h-2 bg-[#ffe4b5]/80 rounded-[50%] blur-[0.5px] shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-0" style={{ transform: `scaleX(${1 + Math.min(7, ageInDays)*0.08})` }} />
                                  )}
                                  {candle.isEternal && (
                                    <div className="absolute -bottom-1 w-10 h-2 border-b-2 border-[#e9c349] rounded-[50%] blur-[0.5px] shadow-[0_0_15px_rgba(233,195,73,0.8)] z-10" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[#c4c7c7]/60 italic py-12 w-full text-center">
                      O altar está silencioso. Acenda a primeira vela e inicie esta corrente de luz.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#0b0f0f] border-t border-[#e9c349]/10 py-16 px-8 md:px-16 text-center animate-fade-in" style={{ animationDelay: '5000ms', animationFillMode: 'both' }}>
            <div className="font-h3 text-2xl text-[#e9c349] mb-4">Preservando Memória s</div>
            <p className="font-body-md text-sm text-[#c4c7c7]/70 italic mb-8 max-w-sm mx-auto">
              &quot;Preservando histórias através do tempo.&quot;
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1200px] mx-auto gap-6 border-t border-white/5 pt-8 text-xs text-[#c4c7c7]/50">
              <p>© 2026 Preservando Memórias. Todos os direitos reservados.</p>
              <div className="flex gap-6 flex-wrap justify-center">
                <Link href="/faq" className="hover:text-[#e9c349] transition">FAQ</Link>
                <Link href="/sobre" className="hover:text-[#e9c349] transition">Sobre Nós</Link>
                <Link href="/planos" className="hover:text-[#e9c349] transition">Planos</Link>
              </div>
            </div>
          </footer>
        </div>

        {/* Tribute Modal */}
        {showTributeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTributeModal(false)} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isTributePinned) {
                  setShowTributeModal(false);
                  setPixActionType("tribute");
                  setShowPixModal(true);
                } else {
                  handleLeaveTribute(e);
                }
              }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-xl text-[#e5e2e1] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e9c349]">rate_review</span>
                  Deixar Mensagem
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
                  <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Seu Nome / Parentesco</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Souza (Sobrinha)"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-sm text-[#e5e2e1] placeholder-white/20 outline-none transition focus:border-[#e9c349]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Selecione um Sentimento</label>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {["🕊️ Saudade", "❤️ Amor", "🌸 Gratidão", "✨ Luz", "🙏 Fé"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedTag === tag
                            ? "border-[#e9c349] bg-[#e9c349]/10 text-[#e9c349]"
                            : "border-white/10 text-[#c4c7c7] hover:border-white/25"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Sua Homenagem</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Deixe suas palavras de carinho ou memórias..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full border border-white/10 rounded-lg bg-[#0b0f0f]/40 p-3 text-sm text-[#e5e2e1] placeholder-white/20 outline-none transition focus:border-[#e9c349]/50"
                  />
                </div>

                <div className="border border-[#e9c349]/30 bg-[#e9c349]/5 rounded-xl p-4 transition hover:bg-[#e9c349]/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 accent-[#e9c349] cursor-pointer"
                      checked={isTributePinned}
                      onChange={(e) => setIsTributePinned(e.target.checked)}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#e9c349] font-bold text-sm tracking-wider uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[1rem]">grade</span>
                          Destacar no Topo
                        </span>
                        <span className="bg-[#e9c349] text-[#101414] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">R$ 5,00</span>
                      </div>
                      <p className="text-xs text-[#c4c7c7] leading-relaxed">
                        Destaca sua homenagem com moldura dourada e coroa especial fixada no topo das mensagens para sempre.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e9c349] text-[#101414] font-label-caps text-xs tracking-widest rounded-full hover:bg-[#ffe088] transition font-semibold uppercase mt-4 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">grade</span>
                  {isTributePinned ? "Destacar e Enviar (R$ 5,00)" : "Enviar Homenagem Simples"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Candle Modal */}
        {showCandleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCandleModal(false)} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isCandleEternal) {
                  setShowCandleModal(false);
                  setShowPixModal(true);
                } else {
                  handleSubmitCandle(e);
                }
              }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl animate-fade-in"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h3 text-xl text-[#e5e2e1] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e9c349]">local_fire_department</span>
                  Acender Vela
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCandleModal(false)}
                  className="text-[#c4c7c7] hover:text-[#e9c349] transition"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c4c7c7]/80 mb-2">Seu Nome / Parentesco</label>
                  <input
                    type="text"
                    required={!isCandleAnonymous}
                    disabled={isCandleAnonymous}
                    placeholder="Ex: Ana Souza (Sobrinha)"
                    value={newCandleName}
                    onChange={(e) => setNewCandleName(e.target.value)}
                    className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-sm text-[#e5e2e1] placeholder-white/20 outline-none transition focus:border-[#e9c349] disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="mt-3 flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="anon-check"
                      checked={isCandleAnonymous}
                      onChange={(e) => {
                        setIsCandleAnonymous(e.target.checked);
                        if (e.target.checked) setNewCandleName("");
                      }}
                      className="accent-[#e9c349] cursor-pointer"
                    />
                    <label htmlFor="anon-check" className="text-sm text-[#c4c7c7] cursor-pointer hover:text-white transition">Acender anonimamente</label>
                  </div>
                </div>

                <div className="border border-[#e9c349]/30 bg-[#e9c349]/5 rounded-xl p-4 transition hover:bg-[#e9c349]/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 accent-[#e9c349] cursor-pointer"
                      checked={isCandleEternal}
                      onChange={(e) => setIsCandleEternal(e.target.checked)}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#e9c349] font-bold text-sm tracking-wider uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[1rem]">all_inclusive</span>
                          Tornar Chama Eterna
                        </span>
                        <span className="bg-[#e9c349] text-[#101414] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">R$ 1,00</span>
                      </div>
                      <p className="text-xs text-[#c4c7c7] leading-relaxed">
                        Velas comuns duram 7 dias no altar virtual. Transforme a sua em uma chama eterna que brilhará para sempre.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e9c349] text-[#101414] font-label-caps text-xs tracking-widest rounded-full hover:bg-[#ffe088] transition font-semibold uppercase mt-4 flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">local_fire_department</span>
                  {isCandleEternal ? "Acender Chama Eterna" : "Acender Vela Simples"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PIX Modal */}
        {showPixModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0b0f0f]/80 backdrop-blur-md" onClick={() => setShowPixModal(false)}></div>
            <div className="relative w-full max-w-sm glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center animate-fade-in text-center border border-[#e9c349]/20 shadow-[0_0_40px_rgba(233,195,73,0.15)]">
              <button
                onClick={() => setShowPixModal(false)}
                className="absolute top-4 right-4 text-[#c4c7c7] hover:text-white transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[#e9c349]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-[#e9c349]">pix</span>
              </div>
              <h3 className="font-h3 text-xl text-[#e9c349] uppercase tracking-widest mb-2">
                {pixActionType === "tribute" ? "Homenagem Premium" : "Chama Eterna"}
              </h3>
              <p className="font-body-md text-sm text-[#c4c7c7] mb-6">
                {pixActionType === "tribute" 
                  ? "Escaneie o QR Code abaixo para transferir R$ 5,00 e destacar sua mensagem no topo de todas as outras para sempre." 
                  : "Escaneie o QR Code abaixo para doar R$ 1,00 e eternizar sua vela no altar virtual."}
              </p>
              
              <div className="bg-white p-2 rounded-lg mb-6 w-48 h-48 mx-auto flex items-center justify-center">
                <img
                  alt="Pix QR Code"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHKXR2fPODdqfkE9haT2ZaeRptqBdj8pqy_vdcNFPQCoehoIHH0jA5LGs81n3q8ly2o_11YpSdcy39xoKZz4xPB-6PjHAPdDOFMhdEVR2fvpCfyq--WGYJtYGptcZ0WtgkPO7rP5bf6JlyakxwZnR8FSssmXp-xTAwcztV9dBT0kghzjjTRAWjKRvBBugmFWtuqN7r14HbXAw0WGFmxds3a6HEx8EyUX7mmWSmY3leK6fOJdcgzX8ONN40GcV0WCE09hPedoGIJMw"
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={(e) => {
                    setShowPixModal(false);
                    if (pixActionType === "tribute") {
                      handleLeaveTribute(e);
                    } else {
                      handleSubmitCandle(e);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#e9c349] text-[#101414] hover:bg-[#ffe088] transition flex items-center justify-center gap-3 font-semibold uppercase tracking-widest text-xs cursor-pointer"
                >
                  Simular Pagamento Confirmado
                </button>
                <button
                  onClick={() => setShowPixModal(false)}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-3 font-semibold uppercase tracking-widest text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-[#0b0f0f]/90 backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
            
            <div className="relative w-full max-w-4xl bg-[#141818] rounded-2xl overflow-hidden border border-[#e9c349]/20 shadow-[0_0_50px_rgba(233,195,73,0.25)] grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[580px] overflow-y-auto md:overflow-hidden">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-[#c4c7c7] hover:text-white transition z-50 bg-[#101414]/50 p-1.5 rounded-full"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="md:col-span-5 bg-[#181c1c] p-6 flex items-center justify-center border-b border-[#e9c349]/10 md:border-b-0 md:border-r md:border-[#e9c349]/10 h-full min-h-[300px]">
                <div className="bg-[#fcfbf9] p-4 pb-6 shadow-2xl border border-[#e2dfd9] rounded-sm w-full max-w-[280px] relative">
                  <div className="absolute inset-4 pointer-events-none border border-black/5 z-10 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]" />
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="pt-4 text-center">
                    <span className="font-serif italic text-2xl text-[#1a1a1a] block font-semibold leading-none">{selectedEvent.year}</span>
                    <span className="font-serif text-[0.65rem] tracking-widest text-[#5a5a5a] uppercase font-semibold block mt-1">Lembrança Sagrada</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between h-full overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#e9c349]/10 text-[#e9c349] border border-[#e9c349]/20 font-bold uppercase tracking-wider">
                      {selectedEvent.year}
                    </span>
                    <div className="h-px bg-[#e9c349]/20 flex-1" />
                  </div>
                  
                  <h3 className="font-h2 text-2xl text-[#e5e2e1] leading-tight font-semibold">
                    {selectedEvent.title}
                  </h3>
                  
                  <p className="text-sm text-[#e9c349]/90 italic font-semibold border-l-2 border-[#e9c349] pl-3 leading-relaxed">
                    &quot;{selectedEvent.description}&quot;
                  </p>

                  <p className="text-sm leading-8 text-[#c4c7c7] font-light">
                    {selectedEvent.longStory}
                  </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      const altarElement = document.querySelector(".mt-20");
                      if (altarElement) altarElement.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#e9c349] text-[#101414] hover:bg-[#ffe088] transition text-center font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    Acender Vela por Esta Lembrança
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="py-3 px-6 rounded-xl bg-white/5 text-[#c4c7c7] border border-white/10 hover:bg-white/10 transition text-center font-semibold uppercase tracking-widest text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <SuccessModal
          isOpen={successModal.isOpen}
          type={successModal.type}
          memorialName={memorial.name}
          onClose={() => setSuccessModal({ isOpen: false, type: null })}
        />

        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0b0f0f]/80 backdrop-blur-md" onClick={() => setShowShareModal(false)}></div>
            <div className="relative w-full max-w-sm glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center animate-fade-in text-center border border-[#e9c349]/20 shadow-[0_0_40px_rgba(233,195,73,0.15)]">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-[#c4c7c7] hover:text-white transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[#e9c349]/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-[#e9c349]">share</span>
              </div>
              <h3 className="font-h3 text-xl text-[#e9c349] uppercase tracking-widest mb-2">Compartilhar</h3>
              <p className="font-body-md text-sm text-[#c4c7c7] mb-8">Honre a memória de {memorial.name} compartilhando este altar com quem você ama.</p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Prestando homenagem a ${memorial.name}. Acesse o memorial:\n${typeof window !== "undefined" ? window.location.href : ""}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    setShowShareModal(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 transition flex items-center justify-center gap-3 font-semibold"
                >
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = typeof window !== "undefined" ? window.location.href : "";
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
                    setShowShareModal(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/30 hover:bg-[#1877F2]/20 transition flex items-center justify-center gap-3 font-semibold"
                >
                  <span className="material-symbols-outlined">public</span>
                  Facebook
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copiado para a área de transferência!");
                      setShowShareModal(false);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-3 font-semibold"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                  Copiar Link
                </button>
              </div>
            </div>
          </div>
        )}

        {showMemorial && (
          <div
            className="fixed right-4 top-[235px] md:right-8 md:top-28 z-[95] flex flex-col items-end gap-2 transition-opacity duration-300"
            style={{
              opacity: scrollOpacity,
              pointerEvents: scrollOpacity === 0 ? 'none' : 'auto'
            }}
          >
            <button
              onClick={() => setIsBgMuted(!isBgMuted)}
              className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#e9c349] hover:bg-white/5 hover:scale-105 transition-all duration-300 border border-[#e9c349]/20 shadow-xl group relative"
              title={isBgMuted ? "Ativar Áudio" : "Pausar Áudio"}
            >
              <span className="material-symbols-outlined text-xl">
                {isBgMuted ? "volume_off" : "volume_up"}
              </span>
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
