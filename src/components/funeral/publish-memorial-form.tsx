"use client";

import Link from "next/link";
import { useState } from "react";
import { MemorialForm, type MemorialFormData } from "@/src/components/memorial-form";
import type { FuneralMemorial } from "@/src/components/funeral/memorial-data";

export function PublishMemorialForm({ memorial }: { memorial: FuneralMemorial }) {
  const [published, setPublished] = useState(memorial.status === "ativo");
  const [name, setName] = useState(memorial.name);

  const isDraft = memorial.status === "rascunho";

  async function handleSubmit(data: MemorialFormData) {
    const response = await fetch(`/api/funeral-auth/memorials/${memorial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, action: "publish" }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Erro ao salvar memorial.");
    setName(payload.memorial.name);
    setPublished(true);
  }

  if (published) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-green-500/30 bg-[#0a192f66] p-8 text-center">
        <span className="material-symbols-outlined mb-4 block text-6xl text-green-400">check_circle</span>
        <h2 className="mb-2 text-2xl font-medium text-white">Memorial publicado!</h2>
        <p className="mb-6 text-[#c4c7c7]/70">
          O memorial de <strong className="text-white">{name}</strong> já está no ar e o QR Code está pronto para impressão.
        </p>
        <div className="space-y-3">
          <Link
            href={`/funeraria/dashboard/imprimir?select=${memorial.id}`}
            className="block w-full rounded-lg bg-[#e9c349] px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-[#101414] transition hover:bg-[#ffe088]"
          >
            Imprimir QR Code
          </Link>
          <a
            href={`/memorial-publico?memorial=${memorial.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg border border-[#e9c349]/40 px-6 py-3 text-center text-sm font-semibold text-[#e9c349] transition hover:bg-[#e9c349]/10"
          >
            Ver memorial público
          </a>
        </div>
        <Link href="/funeraria/dashboard/memoriais" className="mt-6 inline-block text-sm text-[#c4c7c7]/60 hover:text-[#e9c349]">
          Voltar aos memoriais
        </Link>
      </div>
    );
  }

  const initialData: Partial<MemorialFormData> = {
    name: memorial.name,
    nickname: memorial.nickname,
    birthDate: memorial.birthDate,
    deathDate: memorial.deathDate,
    city: memorial.city,
    epitaph: memorial.epitaph,
    biography: memorial.biography,
    imageUrl: memorial.imageUrl === "/images/hero-bg.png" ? "" : memorial.imageUrl,
    audioUrl: memorial.audioUrl,
    videoUrl: memorial.videoUrl,
    gallery: memorial.gallery,
    timelineEvents: memorial.timelineEvents,
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">{isDraft ? "Continuar rascunho" : "Editar memorial"}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{memorial.name}</h1>
      </div>

      {isDraft && (
        <div className="mx-auto mb-6 flex max-w-4xl items-start gap-3 rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-4 text-sm text-[#e9c349]">
          <span className="material-symbols-outlined shrink-0 text-base">info</span>
          <span>
            Rascunho salvo. Complete epitáfio, biografia e foto e clique em <strong>Publicar</strong> para liberar o QR Code. Se
            precisar sair antes, os dados já preenchidos aqui só ficam guardados depois de publicar — o essencial (nome e datas)
            já está salvo.
          </span>
        </div>
      )}
      <MemorialForm
        onSubmit={handleSubmit}
        initialData={initialData}
        submitLabel={isDraft ? "Publicar memorial e liberar QR Code" : "Salvar alterações"}
      />
    </>
  );
}
