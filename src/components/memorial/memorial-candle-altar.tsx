"use client";

import type { CandleView } from "@/src/components/memorial/types";

export type MemorialCandleAltarProps = {
  candles: CandleView[];
  /** Vela cujo rótulo deve ficar visível (toque em telas sem hover). */
  activeCandleId?: string | null;
  onToggleActiveCandle?: (id: string) => void;
};

const ROW_SIZE = 10;
const MAX_CANDLES_SHOWN = 30;

function daysSince(iso: string) {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return 0;
  return Math.floor(Math.abs(Date.now() - created) / (1000 * 60 * 60 * 24));
}

export function MemorialCandleAltar({ candles, activeCandleId, onToggleActiveCandle }: MemorialCandleAltarProps) {
  const glowIntensity = Math.min(1, 0.18 + Math.min(candles.length, 15) * 0.05);
  const rows: CandleView[][] = [];
  const visibleCandles = candles.slice(0, MAX_CANDLES_SHOWN);
  for (let i = 0; i < visibleCandles.length; i += ROW_SIZE) {
    rows.push(visibleCandles.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-2xl border border-[#e9c349]/10 bg-[#1c2020]/30 p-8 text-center shadow-2xl">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#e9c349]/40 to-transparent" aria-hidden="true" />

      <div className="mb-4 flex justify-center">
        <span className="material-symbols-outlined text-4xl text-[#e9c349]" aria-hidden="true">
          church
        </span>
      </div>
      <h3 className="font-h3 mb-2 text-2xl uppercase tracking-widest text-[#e5e2e1]">Altar de Chamas Eternas</h3>
      <p className="mx-auto mb-12 max-w-lg text-sm text-[#c4c7c7]">
        Cada vela acesa brilha por 7 dias simbólicos, elevando preces e lembranças ao infinito.
      </p>

      <div
        id="candle-altar"
        className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-t-xl border-b-8 border-[#2a1f11] bg-gradient-to-t from-[#1a1208]/90 to-transparent px-4 pb-8 pt-16 shadow-[0_15px_40px_rgba(0,0,0,0.9)] sm:px-8"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.18)_0%,transparent_70%)] blur-2xl"
          style={{ opacity: glowIntensity }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[140px] flex-col items-center gap-y-12">
          {visibleCandles.length > 0 ? (
            rows.map((rowCandles, rowIndex) => (
              <div
                key={rowIndex}
                className="relative flex w-full flex-wrap items-end justify-center gap-x-3 gap-y-14 pb-3 sm:gap-x-12"
              >
                <div className="absolute bottom-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-[#e9c349]/30 to-transparent" />
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-transparent via-[#2a1f11] to-transparent blur-sm" />

                {rowCandles.map((candle) => {
                  const ageInDays = daysSince(candle.createdAt);
                  const isExpired = !candle.isEternal && ageInDays >= 8;
                  const isDying = !candle.isEternal && ageInDays === 7;
                  const heightPercent = candle.isEternal ? 100 : Math.max(15, 100 - Math.min(7, ageInDays) * 12);
                  const isActive = activeCandleId === candle.id;
                  const statusLabel = candle.isEternal
                    ? "Chama Eterna"
                    : ageInDays === 0
                      ? "acesa hoje"
                      : `acesa há ${ageInDays} dia${ageInDays === 1 ? "" : "s"}`;

                  return (
                    <button
                      key={candle.id}
                      type="button"
                      onClick={() => onToggleActiveCandle?.(candle.id)}
                      aria-label={`Vela de ${candle.name}, ${statusLabel}`}
                      aria-pressed={isActive}
                      className="group relative flex flex-col items-center"
                    >
                      <div
                        className={`pointer-events-none absolute -top-16 z-30 flex flex-col items-center justify-center whitespace-nowrap rounded border border-[#e9c349]/30 bg-[#0b0f0f] px-3 py-2 text-center text-[0.6rem] font-bold uppercase tracking-wider text-[#e9c349] shadow-2xl transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 md:group-focus-visible:opacity-100"
                        }`}
                      >
                        <span className="mb-1 flex items-center gap-1 text-[#e5e2e1]">
                          {candle.isEternal && (
                            <span className="material-symbols-outlined text-[0.6rem] text-[#e9c349]" aria-hidden="true">
                              all_inclusive
                            </span>
                          )}
                          {candle.name}
                        </span>
                        <span className="text-[0.55rem] text-[#e9c349]/90">{statusLabel}</span>
                      </div>

                      <div className="relative flex flex-col items-center justify-end" style={{ height: "90px", width: "28px" }}>
                        {!isExpired ? (
                          <>
                            <div
                              className={`absolute -top-6 z-20 h-6 w-3.5 origin-bottom rounded-[50%_50%_20%_20%] bg-white transition-all duration-700 ease-out ${
                                isDying ? "animate-pulse" : "memorial-flicker"
                              }`}
                              style={{
                                bottom: `${heightPercent}%`,
                                top: "auto",
                                transform: `translateY(4px) scale(${candle.isEternal ? 1.2 : isDying ? 0.65 : 1})`,
                                boxShadow: isDying
                                  ? "0 0 5px rgba(255,255,255,0.4), 0 0 10px rgba(233,195,73,0.3)"
                                  : "0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(233,195,73,0.6)",
                                opacity: isDying ? 0.7 : 1,
                              }}
                            >
                              <div className="absolute bottom-0 h-1/2 w-full rounded-[50%] bg-[#ffaa00] blur-[1px]" />
                              {candle.isEternal && (
                                <div className="absolute -inset-2 animate-pulse rounded-full bg-[#e9c349]/20 blur-md" />
                              )}
                            </div>
                            <div
                              className="absolute left-[13px] z-10 h-2 w-[2px] bg-[#1a1a1a]"
                              style={{ bottom: `${heightPercent}%`, transform: "translateY(2px)" }}
                            />
                          </>
                        ) : (
                          <div
                            className="absolute left-[13px] z-10 h-2 w-[2px] bg-black"
                            style={{ bottom: `${heightPercent}%`, transform: "translateY(2px)" }}
                          />
                        )}

                        <div
                          className="relative z-0 w-6 rounded-b-md rounded-t-sm bg-gradient-to-r from-[#ffe4b5] via-[#fff8dc] to-[#ffe4b5] shadow-[-3px_0_6px_rgba(0,0,0,0.6)_inset]"
                          style={{ height: `${heightPercent}%`, transition: "height 1s ease-in-out" }}
                        >
                          <div className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-t-sm">
                            <div className="absolute left-[3px] top-0 h-4 w-[3px] rounded-full bg-[#fff8dc] opacity-90" />
                            <div className="absolute right-[2px] top-1 h-5 w-[2px] rounded-full bg-white opacity-80" />
                          </div>
                          <div className="absolute -top-[3px] left-0 h-[6px] w-full rounded-[50%] bg-[#fffacd] shadow-[0_2px_3px_rgba(0,0,0,0.3)_inset]" />
                        </div>

                        {ageInDays > 0 && !candle.isEternal && (
                          <div
                            className="absolute -bottom-[2px] z-0 h-2 w-8 rounded-[50%] bg-[#ffe4b5]/80 blur-[0.5px]"
                            style={{ transform: `scaleX(${1 + Math.min(7, ageInDays) * 0.08})` }}
                          />
                        )}
                        {candle.isEternal && (
                          <div className="absolute -bottom-1 z-10 h-2 w-10 rounded-[50%] border-b-2 border-[#e9c349] blur-[0.5px] shadow-[0_0_15px_rgba(233,195,73,0.8)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <p className="w-full py-12 text-center text-sm italic text-[#c4c7c7]/80">
              O altar está silencioso. Acenda a primeira vela e inicie esta corrente de luz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
