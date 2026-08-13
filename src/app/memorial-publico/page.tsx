import type { Metadata } from "next";
import { Suspense } from "react";
import { readPlatformData } from "@/src/lib/platform-data";
import { MemorialLoading } from "@/src/components/memorial/memorial-loading-state";
import { MemorialPublicoClient } from "./memorial-publico-client";

export const dynamic = "force-dynamic";

type MemorialPublicoPageProps = {
  searchParams: Promise<{
    memorial?: string;
    id?: string;
  }>;
};

export async function generateMetadata({ searchParams }: MemorialPublicoPageProps): Promise<Metadata> {
  const params = await searchParams;
  const memorialId = params.memorial || params.id;
  if (!memorialId) return {};

  try {
    const data = await readPlatformData();
    const memorial = data.memorials.find((item) => item.id === memorialId && item.status === "ativo");
    if (!memorial) return {};

    const title = `${memorial.name} — Preservando Memórias`;
    const description = memorial.epitaph || `Um memorial digital dedicado à memória de ${memorial.name}.`;
    const image = memorial.imageUrl || "/images/hero-bg.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image }],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {};
  }
}

// A tela real fica em memorial-publico-client.tsx ("use client"): lê o id via
// useSearchParams e busca os dados na API. Este arquivo é só o Server Component
// pai, responsável pelo Open Graph por memorial (nome, foto e epitáfio) — algo
// que um componente client jamais poderia gerar sozinho.
export default function MemorialPublicoPage() {
  return (
    <Suspense fallback={<MemorialLoading />}>
      <MemorialPublicoClient />
    </Suspense>
  );
}
