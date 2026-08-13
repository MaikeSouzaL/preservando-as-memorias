"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { TimelineEventView } from "@/src/components/memorial/types";

export type MemorialTimelineProps = {
  events: TimelineEventView[];
};

export function MemorialTimeline({ events }: MemorialTimelineProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedEvent = selectedIndex !== null ? events[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  if (events.length === 0) return null;

  return (
    <section id="timeline" className="relative mx-auto max-w-[1200px] px-6 py-20">
      <div className="mb-16 text-center">
        <h2 className="font-h2 text-2xl uppercase tracking-widest text-[#e5e2e1] md:text-3xl">
          Linha do Tempo de Memórias
        </h2>
        <p className="mt-2 text-sm text-[#c4c7c7]">Momentos inesquecíveis que moldaram uma vida de luz.</p>
        <div className="mx-auto mt-4 h-[1px] w-16 bg-[#e9c349]" />
      </div>

      <div className="memorial-timeline-line relative space-y-16 border-l-2 border-dashed border-[#e9c349]/30 pl-8 md:border-l-0 md:pl-0">
        {events.map((event, i) => {
          const isEven = i % 2 === 0;
          const label = `${event.title ?? "Momento marcante"}${event.year ? ` (${event.year})` : ""}`;

          return (
            <div key={event.id ?? i} className="relative flex w-full flex-col items-start md:flex-row md:items-center">
              <div className="absolute -left-[39px] top-4 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#e9c349] bg-[#101414] md:left-1/2 md:top-auto md:-translate-x-1/2">
                <div className="h-2 w-2 rounded-full bg-[#e9c349]" />
              </div>

              <div className={`flex w-full md:w-1/2 ${isEven ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16"}`}>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Ver detalhes: ${label}`}
                  className={`group w-full max-w-[340px] text-left ${isEven ? "memorial-polaroid-left" : "memorial-polaroid-right"}`}
                >
                  <div className="mb-4 border-l-2 border-[#e9c349]/40 pl-3 text-xs leading-relaxed text-[#c4c7c7] md:hidden">
                    <p className="font-light italic">{event.description}</p>
                  </div>

                  <div className="relative overflow-hidden rounded-sm border border-[#e2dfd9] bg-[#fcfbf9] p-4 pb-6 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                    <div className="pointer-events-none absolute inset-4 z-10 border border-black/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]" />
                    <div className="relative aspect-square w-full overflow-hidden">
                      {event.imageUrl && (
                        <Image
                          src={event.imageUrl}
                          alt={event.title ?? "Fotografia da linha do tempo"}
                          fill
                          sizes="(min-width: 768px) 340px, 90vw"
                          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      )}
                    </div>
                    <div className="pt-5 text-center">
                      <span className="block font-serif text-2xl font-semibold italic leading-none text-[#1a1a1a]">
                        {event.year}
                      </span>
                      <span className="block font-serif text-sm font-medium tracking-wide text-[#3a3a3a]">
                        {event.title}
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="hidden w-1/2 pl-16 pr-16 text-sm leading-7 text-[#c4c7c7] md:block">
                <p className={`max-w-xs ${isEven ? "text-left" : "ml-auto text-right"}`}>{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-[#0b0f0f]/90 backdrop-blur-md"
            aria-hidden="true"
            onClick={() => setSelectedIndex(null)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes: ${selectedEvent.title ?? "lembrança"}`}
            className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-2xl border border-[#e9c349]/20 bg-[#141818] shadow-[0_0_50px_rgba(233,195,73,0.25)] md:max-h-[580px] md:grid-cols-12 md:overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-50 rounded-full bg-[#101414]/50 p-1.5 text-[#c4c7c7] transition hover:text-white"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">
                close
              </span>
            </button>

            <div className="flex h-full min-h-[300px] items-center justify-center border-b border-[#e9c349]/10 bg-[#181c1c] p-6 md:col-span-5 md:border-b-0 md:border-r">
              <div className="relative w-full max-w-[280px] rounded-sm border border-[#e2dfd9] bg-[#fcfbf9] p-4 pb-6 shadow-2xl">
                <div className="pointer-events-none absolute inset-4 z-10 border border-black/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]" />
                <div className="relative aspect-square w-full overflow-hidden">
                  {selectedEvent.imageUrl && (
                    <Image
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title ?? "Fotografia da linha do tempo"}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="pt-4 text-center">
                  <span className="block font-serif text-2xl font-semibold italic leading-none text-[#1a1a1a]">
                    {selectedEvent.year}
                  </span>
                  <span className="mt-1 block font-serif text-[0.65rem] font-semibold uppercase tracking-widest text-[#5a5a5a]">
                    Lembrança Sagrada
                  </span>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between overflow-y-auto p-6 sm:p-8 md:col-span-7">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#e9c349]/20 bg-[#e9c349]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e9c349]">
                    {selectedEvent.year}
                  </span>
                  <div className="h-px flex-1 bg-[#e9c349]/20" />
                </div>

                <h3 className="font-h2 text-2xl font-semibold leading-tight text-[#e5e2e1]">{selectedEvent.title}</h3>

                <p className="border-l-2 border-[#e9c349] pl-3 text-sm font-semibold italic leading-relaxed text-[#e9c349]/90">
                  &quot;{selectedEvent.description}&quot;
                </p>

                <p className="text-sm font-light leading-8 text-[#c4c7c7]">{selectedEvent.longStory}</p>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="rounded-xl bg-white/5 px-6 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#c4c7c7] transition hover:bg-white/10"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
