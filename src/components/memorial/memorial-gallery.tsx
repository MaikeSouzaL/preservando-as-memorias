"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryPhotoView } from "@/src/components/memorial/types";

export type MemorialGalleryProps = {
  photos: GalleryPhotoView[];
};

export function MemorialGallery({ photos }: MemorialGalleryProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  if (photos.length === 0) return null;

  function scrollCarousel(direction: "left" | "right") {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section
      id="gallery"
      className="relative mx-auto max-w-[1200px] border-y border-white/5 bg-[#0b0f0f]/30 px-6 py-20"
    >
      <div className="mb-12 text-center">
        <h2 className="font-h2 text-3xl text-[#e5e2e1] md:text-4xl">Galeria de Lembranças</h2>
        <div className="mx-auto mt-4 h-[1px] w-16 bg-[#e9c349]" />
        <p className="mt-3 text-sm text-[#c4c7c7]">Momentos capturados e eternizados através das lentes do tempo.</p>
      </div>

      <div className="group/carousel relative px-4 md:px-12">
        <button
          type="button"
          onClick={() => scrollCarousel("left")}
          aria-label="Foto anterior"
          className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9c349]/30 bg-[#101414]/80 text-[#e9c349] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#e9c349] hover:text-[#101414]"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            chevron_left
          </span>
        </button>

        <button
          type="button"
          onClick={() => scrollCarousel("right")}
          aria-label="Próxima foto"
          className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9c349]/30 bg-[#101414]/80 text-[#e9c349] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#e9c349] hover:text-[#101414]"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            chevron_right
          </span>
        </button>

        <div
          ref={carouselRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-4"
          style={{ scrollbarWidth: "none" }}
        >
          {photos.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ampliar foto: ${item.title ?? "lembrança"}`}
              className="group relative h-64 w-[280px] shrink-0 snap-center overflow-hidden rounded-xl border border-white/10 bg-[#141818] text-left shadow-lg transition-all duration-500 hover:border-[#e9c349]/30 hover:shadow-2xl sm:w-[320px] md:w-[360px]"
            >
              {item.src && (
                <Image
                  src={item.src}
                  alt={item.title ?? "Foto da galeria"}
                  fill
                  sizes="(min-width: 768px) 360px, 320px"
                  className="object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0b0f0f] via-transparent to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-90">
                <p className="font-h3 text-sm font-semibold text-[#e9c349]">{item.title}</p>
                <p className="mt-1 text-xs text-[#c4c7c7]">Toque para ampliar</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activePhoto && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-8">
          <div className="absolute inset-0" aria-hidden="true" onClick={() => setActiveIndex(null)} />

          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Fechar"
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white/70 transition hover:scale-110 hover:text-white"
          >
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">
              close
            </span>
          </button>

          <div
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title ?? "Foto ampliada"}
            className="relative z-10 flex max-h-[80vh] w-full max-w-4xl flex-col items-center justify-center rounded-2xl border border-[#e9c349]/25 bg-[#0b0f0f] p-2 shadow-[0_0_50px_rgba(233,195,73,0.3)]"
          >
            <div className="relative h-[60vh] w-full">
              {activePhoto.src && (
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.title ?? "Foto ampliada"}
                  fill
                  sizes="90vw"
                  className="rounded-xl object-contain"
                />
              )}
            </div>
            <div className="px-6 py-4 text-center">
              <h4 className="font-h3 text-lg font-semibold uppercase tracking-widest text-[#e9c349]">
                {activePhoto.title}
              </h4>
              <p className="mt-1 text-xs text-[#c4c7c7]">Lembrança guardada com carinho</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
