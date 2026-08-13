"use client";

import Image from "next/image";

export type MemorialHeroProps = {
  name: string;
  nickname?: string;
  years: string;
  city?: string;
  epitaph: string;
  imageUrl: string;
  /** Omita a prop de contagem correspondente para esconder o selo (usado no preview). */
  heartsCount?: number;
  candlesCount?: number;
  flowersCount?: number;
  /** Carrega a foto de perfil com prioridade — usar apenas na tela pública real (LCP). */
  priorityImage?: boolean;
  /** Cada ação fica desabilitada quando o handler correspondente não é passado (modo preview). */
  onTouchHeart?: () => void;
  onLightCandle?: () => void;
  onSendFlower?: () => void;
  onLeaveTribute?: () => void;
  onShare?: () => void;
};

export function MemorialHero({
  name,
  nickname,
  years,
  city,
  epitaph,
  imageUrl,
  heartsCount,
  candlesCount,
  flowersCount,
  priorityImage,
  onTouchHeart,
  onLightCandle,
  onSendFlower,
  onLeaveTribute,
  onShare,
}: MemorialHeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-[240px] pb-24 md:pt-[160px]"
    >
      {/* Fundo: a própria foto da pessoa, desfocada e escurecida.
          A versão original usava uma imagem fixa vinda de uma URL temporária de
          IA (googleusercontent/aida-public) — igual em todo memorial e sujeita a
          expirar de uma vez para todos. Assim a atmosfera é única de cada
          memorial e não depende de nenhum arquivo externo. */}
      {imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority={false}
            sizes="100vw"
            aria-hidden="true"
            className="memorial-backdrop object-cover opacity-[0.62] blur-[28px] grayscale"
          />
        </div>
      )}

      {/* Brilho quente no centro, atrás do retrato. */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.16)_0%,transparent_58%)]"
        aria-hidden="true"
      />
      {/* Vinheta: escurece as bordas e garante contraste do texto sobre a foto. */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(16,20,20,0.88)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#101414]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto mt-12 flex w-full max-w-[1200px] flex-col items-center px-6 text-center">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Aura de luz de vela atrás do retrato: respira devagar, como uma
              chama. Uma única animação lenta — não o antigo pulse-glow em tudo. */}
          <div
            aria-hidden="true"
            className="memorial-aura pointer-events-none absolute h-[280px] w-[280px] rounded-full md:h-[380px] md:w-[380px]"
          />
          <div
            aria-hidden="true"
            className="memorial-aura-ring pointer-events-none absolute h-[200px] w-[200px] rounded-full border border-[#e9c349]/15 md:h-[272px] md:w-[272px]"
          />

          <div className="relative h-40 w-40 overflow-hidden rounded-full border border-[#e9c349]/30 shadow-[0_0_40px_rgba(233,195,73,0.18)] md:h-56 md:w-56">
            <Image
              src={imageUrl || "/images/hero-bg.png"}
              alt={`Foto de ${name}`}
              fill
              priority={priorityImage}
              sizes="(min-width: 768px) 224px, 160px"
              className="object-cover grayscale transition duration-700 hover:grayscale-0"
            />
          </div>
        </div>

        <h1 className="font-h1 mb-1 text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] text-[#e5e2e1]">
          {name}
        </h1>
        {nickname && (
          <p className="font-body-md mb-3 font-serif text-lg italic text-[#e9c349]/90">&quot;{nickname}&quot;</p>
        )}
        <p className="font-body-md mb-4 text-sm uppercase tracking-[0.2em] text-[#e9c349] md:text-base">
          {years}
        </p>
        {city && (
          <div className="mb-8 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#c4c7c7]">
            <span className="material-symbols-outlined text-xs text-[#e9c349]" aria-hidden="true">
              location_on
            </span>
            <span>{city}</span>
          </div>
        )}
        {epitaph && (
          <p className="font-h3 mx-auto mb-10 max-w-2xl text-[1.25rem] italic leading-[1.4] text-[#e0e3e2]/90">
            &quot;{epitaph}&quot;
          </p>
        )}

        <div className="mb-6 flex w-full max-w-2xl flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onLeaveTribute}
            disabled={!onLeaveTribute}
            title={onLeaveTribute ? undefined : "Disponível após a publicação do memorial"}
            className="flex items-center justify-center gap-2 rounded-full border border-[#e9c349]/80 px-6 py-3 font-label-caps text-xs font-semibold uppercase tracking-widest text-[#e9c349] transition hover:bg-[#e9c349] hover:text-[#101414] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#e9c349]"
          >
            <span
              className="material-symbols-outlined text-sm"
              aria-hidden="true"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            Deixar Homenagem
          </button>
          <button
            type="button"
            onClick={onLightCandle}
            disabled={!onLightCandle}
            title={onLightCandle ? undefined : "Disponível após a publicação do memorial"}
            className="memorial-glass-panel flex items-center justify-center gap-2 rounded-full px-6 py-3 font-label-caps text-xs uppercase tracking-widest text-[#e0e3e2] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm text-[#e9c349]" aria-hidden="true">
              local_fire_department
            </span>
            Acender Vela
          </button>
          <button
            type="button"
            onClick={onSendFlower}
            disabled={!onSendFlower}
            title={onSendFlower ? undefined : "Disponível após a publicação do memorial"}
            className="memorial-glass-panel flex items-center justify-center gap-2 rounded-full border border-pink-500/10 px-6 py-3 font-label-caps text-xs uppercase tracking-widest text-[#e0e3e2] transition hover:border-pink-500/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm text-pink-400" aria-hidden="true">
              local_florist
            </span>
            Enviar Flores
          </button>
        </div>

        <div className="flex w-full max-w-2xl flex-row flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:gap-4">
          {typeof heartsCount === "number" && (
            <button
              type="button"
              onClick={onTouchHeart}
              disabled={!onTouchHeart}
              aria-label={`${heartsCount} corações tocados. Tocar para homenagear.`}
              className="memorial-glass-panel relative flex h-14 w-14 items-center justify-center gap-2 rounded-full transition hover:scale-105 hover:border-[#e9c349]/35 disabled:cursor-default disabled:hover:scale-100 sm:h-auto sm:w-auto sm:px-6 sm:py-2"
            >
              <span className="material-symbols-outlined text-xl text-[#e9c349] sm:text-sm" aria-hidden="true">
                favorite
              </span>
              <span className="hidden text-xs text-[#c4c7c7] sm:inline">{heartsCount} corações tocados</span>
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 rounded-full bg-[#e9c349] px-1.5 py-0.5 text-[10px] font-bold text-[#101414] sm:hidden"
              >
                {heartsCount}
              </span>
            </button>
          )}
          {typeof candlesCount === "number" && (
            <div
              className="memorial-glass-panel relative flex h-14 w-14 items-center justify-center gap-2 rounded-full sm:h-auto sm:w-auto sm:px-6 sm:py-2"
              title={`${candlesCount} velas acesas`}
            >
              <span className="material-symbols-outlined text-xl text-[#e9c349] sm:text-sm" aria-hidden="true">
                local_fire_department
              </span>
              <span className="hidden text-xs text-[#c4c7c7] sm:inline">{candlesCount} velas acesas</span>
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 rounded-full bg-[#e9c349] px-1.5 py-0.5 text-[10px] font-bold text-[#101414] sm:hidden"
              >
                {candlesCount}
              </span>
            </div>
          )}
          {typeof flowersCount === "number" && (
            <div
              className="memorial-glass-panel relative flex h-14 w-14 items-center justify-center gap-2 rounded-full sm:h-auto sm:w-auto sm:px-6 sm:py-2"
              title={`${flowersCount} flores enviadas`}
            >
              <span className="material-symbols-outlined text-xl text-[#e9c349] sm:text-sm" aria-hidden="true">
                local_florist
              </span>
              <span className="hidden text-xs text-[#c4c7c7] sm:inline">{flowersCount} flores enviadas</span>
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 rounded-full bg-[#e9c349] px-1.5 py-0.5 text-[10px] font-bold text-[#101414] sm:hidden"
              >
                {flowersCount}
              </span>
            </div>
          )}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Compartilhar memorial"
              className="memorial-glass-panel flex h-14 w-14 items-center justify-center gap-2 rounded-full border border-green-500/15 font-label-caps text-xs uppercase tracking-[0.15em] text-[#e0e3e2] transition hover:border-green-500/35 hover:bg-white/5 sm:h-auto sm:w-auto sm:px-6 sm:py-2"
            >
              <span className="material-symbols-outlined text-xl text-green-400 sm:text-sm" aria-hidden="true">
                share
              </span>
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
