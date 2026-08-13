// Tipos compartilhados entre a tela pública do memorial (src/app/memorial-publico)
// e o preview de desktop usado durante a criação (src/components/memorial-desktop-preview.tsx).
//
// Substituem a antiga dependência de src/mock-db/database.ts — os dados reais vêm
// sempre da API (ver src/app/api/memorials/[id]/route.ts e .../interactions/route.ts).
// Os tipos "Managed*" abaixo são importados apenas como `type` (erasados em build,
// sem custo de runtime) de src/lib/platform-data.ts, que não é modificado aqui.
import type { ManagedCandle, ManagedTimelineEvent, ManagedTribute } from "@/src/lib/platform-data";

export type { ManagedCandle, ManagedTimelineEvent, ManagedTribute };

/** Dados mínimos do homenageado necessários para o Hero. */
export type PublicMemorialSummary = {
  id: string;
  name: string;
  nickname?: string;
  city?: string;
  years: string;
  epitaph: string;
  imageUrl: string;
  audioUrl?: string;
  videoUrl?: string;
};

export type GalleryPhotoView = {
  title?: string;
  src?: string;
};

export type TimelineEventView = {
  id?: string;
  year?: string;
  title?: string;
  description?: string;
  longStory?: string;
  imageUrl?: string;
};

export type CandleView = {
  id: string;
  name: string;
  createdAt: string;
  isEternal?: boolean;
};

export type TributeView = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  tag?: string;
  isPinned?: boolean;
};
