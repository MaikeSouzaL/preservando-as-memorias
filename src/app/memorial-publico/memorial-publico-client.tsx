"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Howl } from "howler";
import SuccessModal from "@/src/components/success-modal";
import { MemorialStyles } from "@/src/components/memorial/memorial-styles";
import { MemorialLoading, MemorialNotFound } from "@/src/components/memorial/memorial-loading-state";
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

type PublicMemorial = {
  id: string;
  name: string;
  nickname?: string;
  city?: string;
  videoUrl?: string;
  years: string;
  epitaph: string;
  imageUrl: string;
  visits: number;
  status: "ativo" | "rascunho" | "pending_payment";
  createdAt: string;
  audioUrl?: string;
};

function defaultBiography(name: string) {
  return [
    `A vida de ${name} foi marcada por dedicação, afeto e presença. Cada lembrança preservada neste memorial ajuda a manter viva a história que a família deseja compartilhar.`,
    "Aqui ficam reunidos os valores, os momentos e as palavras que atravessam o tempo, para que cada visita ao QR Code seja também um gesto de carinho.",
  ];
}

function fallbackGallery(memorial: PublicMemorial | null): GalleryPhotoView[] {
  const imageUrl = memorial?.imageUrl || "/images/hero-bg.png";
  return [
    { title: "Foto principal", src: imageUrl },
    { title: "Memória de família", src: "/images/hero-bg.png" },
  ];
}

const TRIBUTE_TAGS = ["🕊️ Saudade", "❤️ Amor", "🌸 Gratidão", "✨ Luz", "🙏 Fé"];
const DONATION_OPTIONS: [number, string][] = [
  [0, "Não agora"],
  [200, "R$2"],
  [500, "R$5"],
  [1000, "R$10"],
  [2000, "R$20"],
];

export function MemorialPublicoClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const memorialId = searchParams.get("memorial") || searchParams.get("id");
  const showBackButton = searchParams.get("from") === "landing";

  // Em modo demonstração (sandbox) todas as interações ficam só em memória local.
  // Ao recarregar a página elas somem — ideal para testes sem cobranças.
  const isDemoMode = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY !== "stripe";

  const [memorial, setMemorial] = useState<PublicMemorial | null>(null);
  const [hasError, setHasError] = useState(false);

  const [isBgMuted, setIsBgMuted] = useState(true);
  const isBgMutedRef = useRef(isBgMuted);
  useEffect(() => {
    isBgMutedRef.current = isBgMuted;
  }, [isBgMuted]);

  const [candlesList, setCandlesList] = useState<CandleView[]>([]);
  const [activeCandleId, setActiveCandleId] = useState<string | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [biographyParagraphs, setBiographyParagraphs] = useState<string[]>([]);
  const [timelineList, setTimelineList] = useState<TimelineEventView[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryPhotoView[]>([]);

  const [showCandleModal, setShowCandleModal] = useState(false);
  const [newCandleName, setNewCandleName] = useState("");
  const [isCandleAnonymous, setIsCandleAnonymous] = useState(false);
  const [isCandleEternal, setIsCandleEternal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [candlePaymentLoading, setCandlePaymentLoading] = useState(false);
  const [candlePaymentError, setCandlePaymentError] = useState("");

  const [tributeDonationCents, setTributeDonationCents] = useState(0);
  const [showTributeDonationModal, setShowTributeDonationModal] = useState(false);
  const [tributePaymentLoading, setTributePaymentLoading] = useState(false);
  const [tributePaymentError, setTributePaymentError] = useState("");

  const [heartsCount, setHeartsCount] = useState(0);
  const [flowersCount, setFlowersCount] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const [showTributeModal, setShowTributeModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState(TRIBUTE_TAGS[0]);
  const [isTributePinned, setIsTributePinned] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    type: "tribute" | "candle" | "flower" | null;
  }>({ isOpen: false, type: null });

  const [tributesList, setTributesList] = useState<TributeView[]>([]);

  const loadInteractions = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(id)}/interactions`);
      if (!response.ok) return;
      const payload = await response.json();
      setTributesList(Array.isArray(payload.tributes) ? payload.tributes : []);
      setCandlesList(Array.isArray(payload.candles) ? payload.candles : []);
      setFlowersCount(typeof payload.flowers === "number" ? payload.flowers : 0);
      setHeartsCount(typeof payload.hearts === "number" ? payload.hearts : 0);
    } catch {
      // Mantém os valores atuais caso o endpoint de interações esteja indisponível.
    }
  }, []);

  const registerVisit = useCallback(async (id: string) => {
    const storageKey = `memorial_visit_registered_${id}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(id)}/visit`, { method: "POST" });
      if (response.ok) {
        window.sessionStorage.setItem(storageKey, "true");
      }
    } catch {
      // A visita não deve impedir a exibição do memorial.
    }
  }, []);

  // Botão flutuante de áudio só fica visível perto do topo em telas pequenas.
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setScrollOpacity(Math.max(0, 1 - window.scrollY / 250));
      } else {
        setScrollOpacity(1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carrega o memorial assim que o id chega pela URL — sem espera artificial.
  useEffect(() => {
    if (!memorialId) {
      setHasError(true);
      return;
    }

    let cancelled = false;

    fetch(`/api/memorials/${encodeURIComponent(memorialId)}`)
      .then((response) => response.json())
      .then((payload) => {
        if (cancelled) return;
        if (!payload.memorial) {
          setHasError(true);
          return;
        }

        const m = payload.memorial;
        const normalized: PublicMemorial = {
          id: m.id,
          name: m.name,
          nickname: m.nickname || undefined,
          city: m.city || undefined,
          videoUrl: m.videoUrl || undefined,
          years:
            payload.years ||
            [m.birthDate, m.deathDate]
              .filter(Boolean)
              .map((date: string) => new Date(date).getFullYear())
              .join(" - "),
          epitaph: m.epitaph || "Memória preservada com carinho.",
          imageUrl: m.imageUrl || "/images/hero-bg.png",
          visits: m.visits ?? 0,
          status: m.status ?? "ativo",
          createdAt: m.createdAt,
          audioUrl: m.audioUrl || undefined,
        };

        setMemorial(normalized);
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

        const params = new URLSearchParams(window.location.search);

        if (params.get("tribute_ok") === "1") {
          router.replace(`/memorial-publico?memorial=${normalized.id}`, { scroll: false });
          setSuccessModal({ isOpen: true, type: "tribute" });
        }

        const candleOk = params.get("candle_ok");
        if (candleOk) {
          router.replace(`/memorial-publico?memorial=${normalized.id}`, { scroll: false });
          fetch("/api/candle-payment/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: candleOk }),
          })
            .then((r) => r.json())
            .then((confirmPayload) => {
              if (confirmPayload.candle) {
                setCandlesList((prev) => [confirmPayload.candle, ...prev]);
                setSuccessModal({ isOpen: true, type: "candle" });
                setTimeout(() => {
                  document.getElementById("candle-altar")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 300);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorialId]);

  // ── Áudio sob demanda (Howler) — nada é carregado até o visitante pedir som ──
  const bgSoundRef = useRef<Howl | null>(null);
  const matchSoundRef = useRef<Howl | null>(null);
  const heartbeatSoundRef = useRef<Howl | null>(null);

  const ensureBgSound = useCallback(() => {
    if (!bgSoundRef.current) {
      bgSoundRef.current = new Howl({
        src: [memorial?.audioUrl || "/audio/bg-music.mp3"],
        loop: true,
        volume: 0.6,
        html5: true,
        onloaderror: (_id, err) => console.error("Howler não conseguiu carregar o áudio.", err),
        onplayerror: () => {
          bgSoundRef.current?.once("unlock", () => {
            if (!isBgMutedRef.current) bgSoundRef.current?.play();
          });
        },
      });
    }
    return bgSoundRef.current;
  }, [memorial?.audioUrl]);

  const getMatchSound = useCallback(() => {
    if (!matchSoundRef.current) {
      matchSoundRef.current = new Howl({ src: ["/audio/match-strike.mp3"], volume: 1.0, html5: true });
    }
    return matchSoundRef.current;
  }, []);

  const getHeartbeatSound = useCallback(() => {
    if (!heartbeatSoundRef.current) {
      heartbeatSoundRef.current = new Howl({
        src: ["/audio/heartbeat.mp3"],
        volume: 1.0,
        html5: true,
        sprite: { short: [0, 5000] },
      });
    }
    return heartbeatSoundRef.current;
  }, []);

  useEffect(() => {
    return () => {
      bgSoundRef.current?.unload();
      matchSoundRef.current?.unload();
      heartbeatSoundRef.current?.unload();
    };
  }, []);

  const toggleBgSound = useCallback(() => {
    setIsBgMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      const sound = ensureBgSound();
      if (nextMuted) {
        sound.pause();
      } else if (!sound.playing()) {
        sound.play();
      }
      return nextMuted;
    });
  }, [ensureBgSound]);

  useEffect(() => {
    if (isBgMuted) return;
    const timer = setInterval(() => {
      setAudioProgress((prev) => (prev + 1) % 360);
    }, 80);
    return () => clearInterval(timer);
  }, [isBgMuted]);

  const handleLightCandle = () => {
    setCandlePaymentError("");
    setShowCandleModal(true);
  };

  const handleSubmitFreeCandle = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!memorial) return;
    const finalName = isCandleAnonymous ? "Visitante Anônimo" : newCandleName || "Visitante";

    setTimeout(() => getMatchSound().play(), 50);

    let newCandle: CandleView;

    if (isDemoMode) {
      newCandle = {
        id: `demo_candle_${Date.now()}`,
        name: finalName,
        isEternal: false,
        createdAt: new Date().toISOString(),
      };
    } else {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "candle", name: finalName }),
      });

      if (!response.ok) return;
      const payload = await response.json();
      newCandle = payload.candle as CandleView;
    }

    setCandlesList((prev) => [newCandle, ...prev]);
    setShowCandleModal(false);
    setNewCandleName("");
    setIsCandleAnonymous(false);
    setSuccessModal({ isOpen: true, type: "candle" });

    setTimeout(() => {
      document.getElementById("candle-altar")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleStartEternalCandlePayment = async () => {
    if (!memorial) return;
    const finalName = isCandleAnonymous ? "Visitante Anônimo" : newCandleName || "Visitante";

    setTimeout(() => getMatchSound().play(), 50);

    if (isDemoMode) {
      const demoCandle: CandleView = {
        id: `demo_eternal_${Date.now()}`,
        name: finalName,
        isEternal: true,
        createdAt: new Date().toISOString(),
      };
      setCandlesList((prev) => [demoCandle, ...prev]);
      setShowCandleModal(false);
      setNewCandleName("");
      setIsCandleEternal(false);
      setIsCandleAnonymous(false);
      setSuccessModal({ isOpen: true, type: "candle" });
      setTimeout(() => {
        document.getElementById("candle-altar")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return;
    }

    setCandlePaymentLoading(true);
    setCandlePaymentError("");
    setShowCandleModal(false);
    setShowPixModal(true);

    try {
      const res = await fetch("/api/candle-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId: memorial.id, candleName: finalName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCandlePaymentError(data.error ?? "Erro ao iniciar pagamento.");
        setCandlePaymentLoading(false);
        return;
      }

      if (data.gateway === "sandbox") {
        if (data.candle) {
          setCandlesList((prev) => [data.candle, ...prev]);
        }
        setShowPixModal(false);
        setNewCandleName("");
        setIsCandleEternal(false);
        setIsCandleAnonymous(false);
        setSuccessModal({ isOpen: true, type: "candle" });
        setTimeout(() => {
          document.getElementById("candle-altar")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setCandlePaymentError("Erro de conexão. Tente novamente.");
    } finally {
      setCandlePaymentLoading(false);
    }
  };

  const handleSendFlower = async () => {
    if (!memorial) return;

    setSuccessModal({ isOpen: true, type: "flower" });
    setTimeout(() => {
      document.getElementById("tributes")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    if (isDemoMode) {
      setFlowersCount((prev) => prev + 1);
      return;
    }

    setFlowersCount((prev) => prev + 1);
    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "flower" }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload.flowers === "number") setFlowersCount(payload.flowers);
      }
    } catch {
      // A contagem otimista permanece; a homenagem visual já foi confirmada.
    }
  };

  const handleTouchHeart = async () => {
    if (!memorial) return;
    getHeartbeatSound().play("short");

    if (isDemoMode) {
      setHeartsCount((prev) => prev + 1);
      return;
    }

    setHeartsCount((prev) => prev + 1);
    try {
      const response = await fetch(`/api/memorials/${encodeURIComponent(memorial.id)}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "heart" }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload.hearts === "number") setHeartsCount(payload.hearts);
      }
    } catch {
      // Mantém a contagem otimista.
    }
  };

  const handleLeaveTribute = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!memorial) return;
    if (!newAuthor || !newMessage) return;

    const finalDonation = isTributePinned ? Math.max(500, tributeDonationCents) : tributeDonationCents;

    setTimeout(() => getHeartbeatSound().play("short"), 50);

    if (isDemoMode) {
      const demoTribute: TributeView = {
        id: `demo_tribute_${Date.now()}`,
        author: newAuthor,
        message: newMessage,
        tag: selectedTag || undefined,
        isPinned: isTributePinned,
        createdAt: new Date().toISOString(),
      };
      setTributesList((prev) => [demoTribute, ...prev]);
    } else {
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
    }

    const finalAuthor = newAuthor;
    setNewAuthor("");
    setNewMessage("");
    setIsTributePinned(false);
    setTributeDonationCents(0);
    setShowTributeModal(false);

    if (finalDonation > 0 && !isDemoMode) {
      setTributePaymentLoading(true);
      setTributePaymentError("");
      setShowTributeDonationModal(true);
      try {
        const res = await fetch("/api/tribute-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memorialId: memorial.id, amountCents: finalDonation, donorName: finalAuthor }),
        });
        const data = await res.json();
        if (!res.ok) {
          setTributePaymentError(data.error ?? "Erro ao iniciar doação.");
          setTributePaymentLoading(false);
          return;
        }
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      } catch {
        setTributePaymentError("Erro de conexão. Tente novamente.");
        setTributePaymentLoading(false);
      }
      return;
    }

    setSuccessModal({ isOpen: true, type: "tribute" });
  };

  const handleShare = () => setShowShareModal(true);

  if (hasError) {
    return <MemorialNotFound />;
  }

  if (!memorial) {
    return <MemorialLoading />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#101414] text-[#e0e3e2] antialiased selection:bg-[#e9c349]/20 selection:text-[#e9c349]">
      <MemorialStyles />
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {showBackButton && (
        <Link
          href="/"
          aria-label="Voltar para a página inicial"
          className="fixed left-4 top-4 z-[80] inline-flex items-center gap-2 rounded-full border border-[#e9c349]/30 bg-[#101414]/70 px-3 py-2 text-[#e9c349] backdrop-blur-md transition hover:bg-[#e9c349]/10 md:left-6 md:top-6"
        >
          <span className="material-symbols-outlined text-[1.1rem]" aria-hidden="true">
            arrow_back
          </span>
          <span className="font-label-caps text-[0.7rem] uppercase tracking-[0.14em]">Voltar</span>
        </Link>
      )}

      <div className="memorial-fade-in">
        <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#e9c349]/10 bg-[#0b0f0f]/40 px-4 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 md:px-16">
          <Link href="/" className="flex flex-row items-center gap-2 transition-opacity hover:opacity-90 md:gap-4">
            <span
              className="material-symbols-outlined text-2xl text-[#e9c349] drop-shadow-[0_0_12px_rgba(233,195,73,0.5)] md:text-4xl"
              aria-hidden="true"
            >
              local_fire_department
            </span>
            <div className="font-serif text-sm font-bold uppercase italic leading-tight tracking-widest text-[#e9c349] md:text-xl">
              PRESERVANDO MEMÓRIAS
            </div>
          </Link>

          <nav className="hidden gap-6 lg:flex">
            <a href="#hero" className="font-label-caps border-b border-[#e9c349] pb-1 text-xs font-semibold uppercase tracking-widest text-[#e9c349]">
              O Homenageado
            </a>
            <a href="#legacy" className="font-label-caps text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">
              Legado
            </a>
            <a href="#voice" className="font-label-caps text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">
              Memória Viva
            </a>
            <a href="#timeline" className="font-label-caps text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">
              Linha do Tempo
            </a>
            <a href="#gallery" className="font-label-caps text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">
              Galeria
            </a>
            <a href="#tributes" className="font-label-caps text-xs uppercase tracking-widest text-[#c4c7c7] transition hover:text-[#e9c349]">
              Santuário
            </a>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e9c349]/30 bg-[#101414]/60 px-3 py-1.5 text-[#e9c349] backdrop-blur-md transition hover:border-[#e9c349]/60 hover:bg-[#e9c349]/10 md:px-4 md:py-2"
          >
            <span className="material-symbols-outlined text-[1rem]" aria-hidden="true">
              home
            </span>
            <span className="font-label-caps hidden text-[0.65rem] uppercase tracking-[0.12em] sm:inline">Início</span>
          </Link>
        </header>

        <MemorialHero
          name={memorial.name}
          nickname={memorial.nickname}
          years={memorial.years}
          city={memorial.city}
          epitaph={memorial.epitaph}
          imageUrl={memorial.imageUrl}
          heartsCount={heartsCount}
          candlesCount={candlesList.length}
          flowersCount={flowersCount}
          priorityImage
          onTouchHeart={handleTouchHeart}
          onLightCandle={handleLightCandle}
          onSendFlower={handleSendFlower}
          onLeaveTribute={() => setShowTributeModal(true)}
          onShare={handleShare}
        />

        {memorial.audioUrl && (
          <section id="voice" className="mx-auto max-w-[1200px] px-6 py-20">
            <div className="memorial-glass-panel grid grid-cols-1 items-center gap-8 rounded-2xl border border-[#e9c349]/10 p-8 md:grid-cols-12">
              <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left">
                <span className="material-symbols-outlined mb-4 text-4xl text-[#e9c349]" aria-hidden="true">
                  record_voice_over
                </span>
                <h3 className="font-h3 mb-2 text-2xl text-[#e5e2e1]">Mensagem de Voz</h3>
                <p className="max-w-xs text-sm leading-relaxed text-[#c4c7c7]">
                  Ouvir a voz de quem amamos é uma das formas mais bonitas de reatar a proximidade e reviver os
                  sentimentos.
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-[#0b0f0f]/40 p-6 md:col-span-8">
                <div className="mb-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={toggleBgSound}
                    aria-label={isBgMuted ? "Reproduzir mensagem de voz" : "Pausar mensagem de voz"}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9c349] text-[#101414] shadow-lg shadow-[#e9c349]/20 transition hover:bg-[#ffe088]"
                  >
                    <span className="material-symbols-outlined text-xl font-bold" aria-hidden="true">
                      {!isBgMuted ? "pause" : "play_arrow"}
                    </span>
                  </button>
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]">
                      Áudio de Lembranças
                    </p>
                    <p className="text-xs text-[#c4c7c7]/80">{!isBgMuted ? "Tocando agora..." : `Áudio de ${memorial.name}`}</p>
                  </div>
                  <span className="material-symbols-outlined text-xl text-[#e9c349]/80" aria-hidden="true">
                    {!isBgMuted ? "volume_up" : "volume_off"}
                  </span>
                </div>

                <div className="flex h-10 items-center justify-between gap-[4px] px-2" aria-hidden="true">
                  {[20, 40, 15, 60, 30, 80, 45, 90, 25, 70, 35, 85, 40, 60, 15, 75, 50, 95, 20, 60, 30, 80, 45, 90, 15, 50, 35, 75, 40, 85].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-[#e9c349] transition-all duration-300"
                        style={{
                          height: !isBgMuted ? `${Math.max(10, Math.sin((audioProgress + i) * 0.5) * height)}%` : "15%",
                          opacity: !isBgMuted ? 0.9 : 0.3,
                        }}
                      />
                    )
                  )}
                </div>

                <p className="mt-4 flex items-start gap-1.5 text-[0.65rem] leading-relaxed text-[#c4c7c7]/80">
                  <span className="material-symbols-outlined mt-px shrink-0 text-[0.7rem]" aria-hidden="true">
                    info
                  </span>
                  Áudio enviado pela família. Os direitos sobre este conteúdo pertencem aos seus respectivos titulares.
                  Preservando Memórias não detém direitos sobre o áudio aqui reproduzido.
                </p>
              </div>
            </div>
          </section>
        )}

        <section id="legacy" className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#e9c349]/15 shadow-2xl">
                <Image
                  src={memorial.imageUrl || "/images/hero-bg.png"}
                  alt={`Fotografia de ${memorial.name}`}
                  fill
                  sizes="(min-width: 768px) 480px, 90vw"
                  className="object-cover grayscale opacity-90"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
              <h2 className="font-h2 mb-6 text-3xl text-[#e5e2e1] md:text-4xl">História preservada</h2>
              <div className="font-body-lg space-y-6 text-[1rem] leading-8 text-[#c4c7c7]">
                {biographyParagraphs.map((paragraph, index) => (
                  <p key={`bio_${index}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-16 bg-[#e9c349]/30" />
                <span className="font-h3 text-lg italic text-[#e9c349]">&quot;O tempo passa, o amor permanece.&quot;</span>
              </div>
            </div>
          </div>
        </section>

        {memorial.videoUrl && (
          <section id="video" className="mx-auto max-w-[1200px] px-6 py-20">
            <div className="mb-10 text-center">
              <span className="material-symbols-outlined mb-3 block text-4xl text-[#e9c349]" aria-hidden="true">
                play_circle
              </span>
              <h2 className="font-h2 text-2xl uppercase tracking-widest text-[#e5e2e1] md:text-3xl">Vídeo Tributo</h2>
              <div className="mx-auto mt-4 h-[1px] w-16 bg-[#e9c349]" />
              <p className="mt-3 text-sm text-[#c4c7c7]">Um registro em vídeo que eterniza os momentos mais especiais.</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[#e9c349]/15 bg-[#0b0f0f] shadow-2xl shadow-black/60">
              <video
                src={memorial.videoUrl}
                controls
                playsInline
                className="max-h-[560px] w-full object-contain"
                poster={memorial.imageUrl || undefined}
              >
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            </div>
          </section>
        )}

        <MemorialTimeline events={timelineList} />
        <MemorialGallery photos={galleryList} />

        <section id="tributes" className="mx-auto max-w-[1200px] px-6 py-20">
          <MemorialTributes
            tributes={tributesList}
            onWriteMessage={() => {
              setIsTributePinned(false);
              setShowTributeModal(true);
            }}
          />
          <MemorialCandleAltar
            candles={candlesList}
            activeCandleId={activeCandleId}
            onToggleActiveCandle={(id) => setActiveCandleId((current) => (current === id ? null : id))}
          />
        </section>

        <footer className="border-t border-[#e9c349]/10 bg-[#0b0f0f] px-8 py-16 text-center md:px-16">
          <div className="font-h3 mb-4 text-2xl text-[#e9c349]">Preservando Memórias</div>
          <p className="font-body-md mx-auto mb-8 max-w-sm text-sm italic text-[#c4c7c7]/80">
            &quot;Preservando histórias através do tempo.&quot;
          </p>
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 text-xs text-[#c4c7c7]/80 md:flex-row">
            <p>© 2026 Preservando Memórias. Todos os direitos reservados.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/faq" className="transition hover:text-[#e9c349]">
                FAQ
              </Link>
              <Link href="/sobre" className="transition hover:text-[#e9c349]">
                Sobre Nós
              </Link>
              <Link href="/planos" className="transition hover:text-[#e9c349]">
                Planos
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Tribute Modal */}
      {showTributeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" onClick={() => setShowTributeModal(false)} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLeaveTribute(e);
            }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-h3 flex items-center gap-2 text-xl text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#e9c349]" aria-hidden="true">
                  rate_review
                </span>
                Deixar Mensagem
              </h3>
              <button type="button" onClick={() => setShowTributeModal(false)} aria-label="Fechar" className="text-[#c4c7c7] transition hover:text-[#e9c349]">
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="tribute-author" className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]">
                  Seu Nome / Parentesco
                </label>
                <input
                  id="tribute-author"
                  type="text"
                  required
                  placeholder="Ex: Ana Souza (Sobrinha)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-sm text-[#e5e2e1] outline-none transition placeholder:text-white/20 focus:border-[#e9c349]"
                />
              </div>

              <div>
                <span className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]">Selecione um Sentimento</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {TRIBUTE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      aria-pressed={selectedTag === tag}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
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
                <label htmlFor="tribute-message" className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]">
                  Sua Homenagem
                </label>
                <textarea
                  id="tribute-message"
                  required
                  rows={4}
                  placeholder="Deixe suas palavras de carinho ou memórias..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0b0f0f]/40 p-3 text-sm text-[#e5e2e1] outline-none transition placeholder:text-white/20 focus:border-[#e9c349]/50"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1rem] text-rose-400" aria-hidden="true">
                    volunteer_activism
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#e0e3e2]">Contribuição Simbólica</span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-[#c4c7c7]">Opcional</span>
                </div>
                <p className="text-xs leading-relaxed text-[#c4c7c7]/80">
                  Ajude a manter este memorial vivo. Qualquer valor é bem-vindo e vai direto para a plataforma.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DONATION_OPTIONS.map(([cents, label]) => (
                    <button
                      key={cents}
                      type="button"
                      onClick={() => setTributeDonationCents(cents)}
                      aria-pressed={tributeDonationCents === cents}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        tributeDonationCents === cents
                          ? "border-rose-400 bg-rose-400/10 text-rose-300"
                          : "border-white/10 text-[#c4c7c7] hover:border-white/30"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#e9c349]/30 bg-[#e9c349]/5 p-4 transition hover:bg-[#e9c349]/10">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#e9c349]"
                    checked={isTributePinned}
                    onChange={(e) => setIsTributePinned(e.target.checked)}
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#e9c349]">
                        <span className="material-symbols-outlined text-[1rem]" aria-hidden="true">
                          grade
                        </span>
                        Destacar no Topo
                      </span>
                      <span className="rounded bg-[#e9c349] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#101414]">
                        R$ 5,00
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#c4c7c7]">
                      Destaca sua homenagem com moldura dourada e coroa especial fixada no topo das mensagens.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#e9c349] py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  {isTributePinned ? "grade" : tributeDonationCents > 0 ? "volunteer_activism" : "send"}
                </span>
                {isTributePinned
                  ? "Destacar e Enviar (R$ 5,00)"
                  : tributeDonationCents > 0
                    ? `Enviar + Contribuir R$${(tributeDonationCents / 100).toFixed(2).replace(".", ",")}`
                    : "Enviar Homenagem"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Candle Modal */}
      {showCandleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" onClick={() => setShowCandleModal(false)} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isCandleEternal) {
                handleStartEternalCandlePayment();
              } else {
                handleSubmitFreeCandle(e);
              }
            }}
            className="memorial-fade-in relative z-10 w-full max-w-md rounded-2xl border border-[#e9c349]/20 bg-[#1c2020] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-h3 flex items-center gap-2 text-xl text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#e9c349]" aria-hidden="true">
                  local_fire_department
                </span>
                Acender Vela
              </h3>
              <button type="button" onClick={() => setShowCandleModal(false)} aria-label="Fechar" className="text-[#c4c7c7] transition hover:text-[#e9c349]">
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="candle-name" className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]">
                  Seu Nome / Parentesco
                </label>
                <input
                  id="candle-name"
                  type="text"
                  required={!isCandleAnonymous}
                  disabled={isCandleAnonymous}
                  placeholder="Ex: Ana Souza (Sobrinha)"
                  value={newCandleName}
                  onChange={(e) => setNewCandleName(e.target.value)}
                  className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-sm text-[#e5e2e1] outline-none transition placeholder:text-white/20 focus:border-[#e9c349] disabled:cursor-not-allowed disabled:opacity-30"
                />
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anon-check"
                    checked={isCandleAnonymous}
                    onChange={(e) => {
                      setIsCandleAnonymous(e.target.checked);
                      if (e.target.checked) setNewCandleName("");
                    }}
                    className="accent-[#e9c349]"
                  />
                  <label htmlFor="anon-check" className="cursor-pointer text-sm text-[#c4c7c7] transition hover:text-white">
                    Acender anonimamente
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-[#e9c349]/30 bg-[#e9c349]/5 p-4 transition hover:bg-[#e9c349]/10">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#e9c349]"
                    checked={isCandleEternal}
                    onChange={(e) => setIsCandleEternal(e.target.checked)}
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-[#e9c349]">
                        <span className="material-symbols-outlined text-[1rem]" aria-hidden="true">
                          all_inclusive
                        </span>
                        Tornar Chama Eterna
                      </span>
                      <span className="rounded bg-[#e9c349] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#101414]">
                        R$ 1,00
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#c4c7c7]">
                      Velas comuns duram 7 dias no altar virtual. Transforme a sua em uma chama eterna que brilhará
                      para sempre.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#e9c349] py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  local_fire_department
                </span>
                {isCandleEternal ? "Acender Chama Eterna" : "Acender Vela Simples"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pagamento — Chama Eterna */}
      {showPixModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0b0f0f]/80 backdrop-blur-md"
            aria-hidden="true"
            onClick={() => {
              if (!candlePaymentLoading) setShowPixModal(false);
            }}
          />
          <div className="memorial-glass-panel memorial-fade-in relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#e9c349]/20 p-6 text-center shadow-[0_0_40px_rgba(233,195,73,0.15)] sm:p-8">
            {!candlePaymentLoading && (
              <button
                type="button"
                onClick={() => setShowPixModal(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 text-[#c4c7c7] transition hover:text-white"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            )}

            {candlePaymentLoading ? (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10">
                  <span className="material-symbols-outlined animate-spin text-3xl text-[#e9c349]" aria-hidden="true">
                    progress_activity
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#e9c349]">Preparando pagamento...</h3>
                <p className="text-sm text-[#c4c7c7]">Você será redirecionado para o ambiente seguro de pagamento.</p>
              </>
            ) : candlePaymentError ? (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                  <span className="material-symbols-outlined text-3xl text-red-400" aria-hidden="true">
                    error
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-red-300">Não foi possível processar</h3>
                <p className="mb-6 text-sm text-[#c4c7c7]">{candlePaymentError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowPixModal(false);
                    setShowCandleModal(true);
                  }}
                  className="w-full rounded-xl bg-[#e9c349] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
                >
                  Tentar novamente
                </button>
              </>
            ) : (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10">
                  <span className="material-symbols-outlined text-3xl text-[#e9c349]" aria-hidden="true">
                    local_fire_department
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#e9c349]">Chama Eterna</h3>
                <p className="text-sm text-[#c4c7c7]">Redirecionando para pagamento seguro...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pagamento — Contribuição Simbólica */}
      {showTributeDonationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0b0f0f]/80 backdrop-blur-md"
            aria-hidden="true"
            onClick={() => {
              if (!tributePaymentLoading) setShowTributeDonationModal(false);
            }}
          />
          <div className="memorial-glass-panel memorial-fade-in relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-rose-500/20 p-6 text-center shadow-[0_0_40px_rgba(244,63,94,0.15)] sm:p-8">
            {!tributePaymentLoading && (
              <button
                type="button"
                onClick={() => setShowTributeDonationModal(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 text-[#c4c7c7] transition hover:text-white"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            )}

            {tributePaymentLoading ? (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
                  <span className="material-symbols-outlined animate-spin text-3xl text-rose-400" aria-hidden="true">
                    progress_activity
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-rose-300">Preparando sua doação...</h3>
                <p className="text-sm text-[#c4c7c7]">Você será redirecionado para o ambiente seguro de pagamento.</p>
              </>
            ) : tributePaymentError ? (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                  <span className="material-symbols-outlined text-3xl text-red-400" aria-hidden="true">
                    error
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-red-300">Não foi possível processar</h3>
                <p className="mb-4 text-sm text-[#c4c7c7]">{tributePaymentError}</p>
                <p className="mb-6 text-xs text-[#c4c7c7]/80">
                  Sua homenagem foi salva normalmente. A doação pode ser tentada novamente.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowTributeDonationModal(false);
                    setSuccessModal({ isOpen: true, type: "tribute" });
                  }}
                  className="w-full rounded-xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-rose-400"
                >
                  Fechar e ver homenagem
                </button>
              </>
            ) : (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
                  <span className="material-symbols-outlined text-3xl text-rose-400" aria-hidden="true">
                    volunteer_activism
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-rose-300">Contribuição Simbólica</h3>
                <p className="text-sm text-[#c4c7c7]">Redirecionando para pagamento seguro...</p>
              </>
            )}
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
          <div className="absolute inset-0 bg-[#0b0f0f]/80 backdrop-blur-md" aria-hidden="true" onClick={() => setShowShareModal(false)} />
          <div className="memorial-glass-panel memorial-fade-in relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#e9c349]/20 p-6 text-center shadow-[0_0_40px_rgba(233,195,73,0.15)] sm:p-8">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 text-[#c4c7c7] transition hover:text-white"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10">
              <span className="material-symbols-outlined text-3xl text-[#e9c349]" aria-hidden="true">
                share
              </span>
            </div>
            <h3 className="font-h3 mb-2 text-xl uppercase tracking-widest text-[#e9c349]">Compartilhar</h3>
            <p className="font-body-md mb-8 text-sm text-[#c4c7c7]">
              Honre a memória de {memorial.name} compartilhando este altar com quem você ama.
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    `Prestando homenagem a ${memorial.name}. Acesse o memorial:\n${window.location.href}`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                  setShowShareModal(false);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  chat
                </span>
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  );
                  setShowShareModal(false);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/10 px-4 py-3 font-semibold text-[#1877F2] transition hover:bg-[#1877F2]/20"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  public
                </span>
                Facebook
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareModal(false);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  content_copy
                </span>
                Copiar Link
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed right-4 top-[235px] z-[95] flex flex-col items-end gap-2 transition-opacity duration-300 md:right-8 md:top-28"
        style={{ opacity: scrollOpacity, pointerEvents: scrollOpacity === 0 ? "none" : "auto" }}
      >
        <button
          type="button"
          onClick={toggleBgSound}
          aria-label={isBgMuted ? "Ativar áudio" : "Pausar áudio"}
          className="memorial-glass-panel flex h-12 w-12 items-center justify-center rounded-full border border-[#e9c349]/20 text-[#e9c349] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            {isBgMuted ? "volume_off" : "volume_up"}
          </span>
        </button>
      </div>
    </div>
  );
}
