"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MemorialForm, type MemorialFormData } from "@/src/components/memorial-form";

type SavedMemorial = {
  memorial: {
    id: string;
    name: string;
    epitaph: string;
    biography: string;
    imageUrl: string;
    nickname?: string;
    birthDate?: string;
    deathDate?: string;
    city?: string;
    audioUrl?: string;
    videoUrl?: string;
    gallery?: Array<{ title: string; url: string }>;
    timelineEvents?: Array<{ year: string; title: string; description: string; imageUrl: string }>;
  };
  qrCode: { publicPath: string };
};

export default function CriarMemorialPage() {
  const [editId, setEditId] = useState("");
  const [initialData, setInitialData] = useState<Partial<MemorialFormData> | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saved, setSaved] = useState<SavedMemorial | null>(null);

  const isEditing = Boolean(editId);

  useEffect(() => {
    const memorialId = new URLSearchParams(window.location.search).get("edit") ?? "";
    if (!memorialId) {
      setInitialData({});
      return;
    }

    setEditId(memorialId);
    setIsLoadingEdit(true);

    fetch(`/api/memorials/${memorialId}`)
      .then(async (res) => {
        const payload = await res.json() as SavedMemorial;
        if (!res.ok) throw new Error((payload as { error?: string }).error ?? "Erro ao carregar.");
        const m = payload.memorial;
        const events = m.timelineEvents ?? [];
        setInitialData({
          name: m.name ?? "",
          nickname: m.nickname ?? "",
          birthDate: m.birthDate ?? "",
          deathDate: m.deathDate ?? "",
          city: m.city ?? "",
          epitaph: m.epitaph ?? "",
          biography: m.biography ?? "",
          imageUrl: m.imageUrl ?? "",
          audioUrl: m.audioUrl ?? "",
          videoUrl: m.videoUrl ?? "",
          gallery: m.gallery ?? [],
          timelineEvents: events.length > 0
            ? events.map((e) => ({ year: e.year ?? "", title: e.title ?? "", description: e.description ?? "", imageUrl: e.imageUrl ?? "" }))
            : [{ year: "", title: "", description: "", imageUrl: "" }],
        });
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoadingEdit(false));
  }, []);

  async function handleSubmit(data: MemorialFormData) {
    const response = await fetch(isEditing ? `/api/memorials/${editId}` : "/api/memorials", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? (isEditing ? "Não foi possível atualizar." : "Não foi possível criar."));

    setSaved(payload as SavedMemorial);
  }

  function downloadFramedQRCode(name: string, epitaph: string, qrUrl: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 1200, 1200);

    const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
    grad.addColorStop(0, "#b89742");
    grad.addColorStop(0.3, "#ffd700");
    grad.addColorStop(0.5, "#fff4b8");
    grad.addColorStop(0.7, "#ffd700");
    grad.addColorStop(1, "#b89742");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 24;
    ctx.strokeRect(50, 50, 1100, 1100);
    ctx.strokeStyle = "rgba(255,215,0,0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, 1060, 1060);

    ctx.textAlign = "center";
    ctx.font = "bold 44px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("EM MEMÓRIA DE", 600, 160);

    ctx.font = "bold 64px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name.toUpperCase(), 600, 260);

    ctx.font = "italic 32px Georgia, serif";
    ctx.fillStyle = "#a0aec0";
    const ep = epitaph ? (epitaph.length > 65 ? `${epitaph.slice(0, 65)}...` : epitaph) : "Preservado para sempre.";
    ctx.fillText(`"${ep}"`, 600, 340);

    ctx.font = "bold 34px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("ESCANEIE PARA CONHECER MINHA HISTÓRIA", 600, 1050);

    const qrImg = new window.Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrUrl;
    qrImg.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(350, 420, 500, 500);
      ctx.drawImage(qrImg, 370, 440, 460, 460);
      const link = document.createElement("a");
      link.download = `placa_qr_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  }

  if (saved) {
    if (isEditing) {
      return (
        <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10">
            <span className="material-symbols-outlined text-3xl text-tertiary">check_circle</span>
          </div>
          <div>
            <p className="mb-1 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Atualizado com sucesso</p>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-on-surface">{saved.memorial.name}</h1>
            <p className="mt-2 text-on-surface-variant">As alterações foram salvas no memorial.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={saved.qrCode.publicPath} target="_blank" className="rounded-full bg-tertiary px-6 py-3 text-sm font-semibold text-on-tertiary">
              Ver memorial público
            </Link>
            <Link href="/dashboard" className="rounded-full border border-tertiary/50 px-6 py-3 text-sm text-tertiary">
              Ir para o dashboard
            </Link>
          </div>
        </main>
      );
    }

    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10">
          <span className="material-symbols-outlined text-3xl text-[#e9c349]">auto_stories</span>
        </div>
        <div>
          <p className="mb-1 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Memorial salvo</p>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-on-surface">{saved.memorial.name}</h1>
          <p className="mt-3 max-w-md text-on-surface-variant">
            O memorial está pronto! Faça o pagamento para publicar e gerar o QR Code.
          </p>
        </div>
        <div className="w-full rounded-xl border border-tertiary/15 bg-[var(--pm-card-bg)] p-6 text-left">
          <p className="mb-1 text-xs uppercase tracking-widest text-outline">Próximo passo</p>
          <h2 className="mb-2 font-semibold text-on-surface">Publicar memorial</h2>
          <p className="mb-4 text-sm text-on-surface-variant">
            Após o pagamento, a página pública e o QR Code ficam disponíveis imediatamente.
          </p>
          <a
            href={`/checkout?memorialId=${saved.memorial.id}&payerType=family`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-tertiary py-3 text-sm font-semibold text-on-tertiary transition hover:bg-tertiary/80"
          >
            <span className="material-symbols-outlined text-sm">payment</span>
            Pagar para publicar
          </a>
        </div>
        <button
          onClick={() => downloadFramedQRCode(saved.memorial.name, saved.memorial.epitaph, `${window.location.origin}${saved.qrCode.publicPath}`)}
          className="text-sm text-outline hover:text-on-surface-variant"
        >
          Baixar placa QR (PNG)
        </button>
        <Link href="/dashboard" className="text-sm text-outline hover:text-on-surface-variant">
          Fazer isso depois
        </Link>
      </main>
    );
  }

  if (isLoadingEdit) {
    return (
      <main className="mx-auto flex w-full max-w-2xl items-center justify-center py-24">
        <div className="text-center text-on-surface-variant">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
          <p>Carregando memorial...</p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 py-24 text-center">
        <p className="text-red-400">{loadError}</p>
        <Link href="/dashboard" className="text-sm text-tertiary hover:underline">Voltar ao dashboard</Link>
      </main>
    );
  }

  if (initialData === null) return null;

  return (
    <main className="relative mx-auto w-full max-w-4xl">
      <header className="mb-10">
        <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          {isEditing ? "Editar memorial" : "Novo memorial"}
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.1] text-on-surface">
          {isEditing ? "Atualize a história revelada pelo QR Code." : "Cadastre a história que o QR Code vai revelar."}
        </h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">
          Preencha os dados que devem aparecer para quem escanear a placa.
        </p>
      </header>

      <MemorialForm
        key={editId || "new"}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Salvar Alterações" : "Salvar Memorial"}
        initialData={initialData}
      />
    </main>
  );
}
