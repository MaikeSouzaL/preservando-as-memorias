"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MemorialDesktopPreview from "@/src/components/memorial-desktop-preview";

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
    timelineEvents?: Array<{
      year: string;
      title: string;
      description: string;
      imageUrl: string;
    }>;
  };
  qrCode: {
    publicPath: string;
  };
};

type FormState = {
  name: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  city: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl: string;
  videoUrl: string;
  gallery: Array<{ title: string; url: string }>;
  timelineEvents: Array<{ year: string; title: string; description: string; imageUrl: string }>;
};

const initialForm: FormState = {
  name: "",
  nickname: "",
  birthDate: "",
  deathDate: "",
  city: "",
  epitaph: "",
  biography: "",
  imageUrl: "",
  audioUrl: "",
  videoUrl: "",
  gallery: [],
  timelineEvents: [
    { year: "", title: "", description: "", imageUrl: "" }
  ],
};

function formFromMemorial(payload: SavedMemorial): FormState {
  const memorial = payload.memorial;
  const events = memorial.timelineEvents ?? [];

  return {
    name: memorial.name ?? "",
    nickname: memorial.nickname ?? "",
    birthDate: memorial.birthDate ?? "",
    deathDate: memorial.deathDate ?? "",
    city: memorial.city ?? "",
    epitaph: memorial.epitaph ?? "",
    biography: memorial.biography ?? "",
    imageUrl: memorial.imageUrl ?? "",
    audioUrl: memorial.audioUrl ?? "",
    videoUrl: memorial.videoUrl ?? "",
    gallery: memorial.gallery ?? [],
    timelineEvents: events.length > 0 ? events.map(e => ({
      year: e.year ?? "",
      title: e.title ?? "",
      description: e.description ?? "",
      imageUrl: e.imageUrl ?? "",
    })) : [{ year: "", title: "", description: "", imageUrl: "" }],
  };
}

export default function CriarMemorialPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [editId, setEditId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedMemorial | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadingTimelineIndex, setUploadingTimelineIndex] = useState<number | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const isEditing = Boolean(editId);

  const publicUrl = useMemo(() => {
    if (!saved || typeof window === "undefined") return "";
    return `${window.location.origin}${saved.qrCode.publicPath}`;
  }, [saved]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, fieldName: "imageUrl" | "audioUrl" | "videoUrl") {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload");

      updateField(fieldName, data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Falha no upload: ${message}`);
    } finally {
      setIsUploading(null);
    }
  }

  async function handleGalleryUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    const newItems = [...form.gallery];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro no upload");

        newItems.push({
          title: file.name.split(".")[0].slice(0, 40) || `Foto ${newItems.length + 1}`,
          url: data.url,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        alert(`Falha ao subir a foto "${file.name}": ${message}`);
      }
    }

    updateField("gallery", newItems);
    setIsUploadingGallery(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memorialId = params.get("edit") ?? "";

    if (!memorialId) return;

    void Promise.resolve().then(() => {
      setEditId(memorialId);
      setIsLoading(true);
      setError("");

      fetch(`/api/memorials/${memorialId}`)
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.error ?? "Não foi possível carregar o memorial.");
          }
          return payload as SavedMemorial;
        })
        .then((payload) => setForm(formFromMemorial(payload)))
        .catch((fetchError: Error) => setError(fetchError.message))
        .finally(() => setIsLoading(false));
    });
  }, []);

  function updateField<K extends keyof FormState>(name: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleTimelineImageUpload(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingTimelineIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload");

      const newEvents = [...form.timelineEvents];
      newEvents[index].imageUrl = data.url;
      updateField("timelineEvents", newEvents);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Falha no upload: ${message}`);
    } finally {
      setUploadingTimelineIndex(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch(isEditing ? `/api/memorials/${editId}` : "/api/memorials", {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? (isEditing ? "Não foi possível atualizar o memorial." : "Não foi possível criar o memorial."));
      return;
    }

    setSaved(payload);
  }

  const downloadFramedQRCode = (name: string, epitaph: string, qrUrl: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Fundo do canvas (placa de mármore escuro)
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 1200, 1200);

    // 2. Moldura de ouro degradê
    const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
    grad.addColorStop(0, "#b89742");
    grad.addColorStop(0.3, "#ffd700");
    grad.addColorStop(0.5, "#fff4b8");
    grad.addColorStop(0.7, "#ffd700");
    grad.addColorStop(1, "#b89742");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 24;
    ctx.strokeRect(50, 50, 1100, 1100);

    ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, 1060, 1060);

    // 3. Desenhar Textos
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.font = "bold 44px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("EM MEMÓRIA DE", 600, 160);

    ctx.font = "bold 64px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name.toUpperCase(), 600, 260);

    ctx.font = "italic 32px Georgia, serif";
    ctx.fillStyle = "#a0aec0";
    const maxEpitaph = epitaph ? (epitaph.length > 65 ? `${epitaph.slice(0, 65)}...` : epitaph) : "Preservado para sempre.";
    ctx.fillText(`"${maxEpitaph}"`, 600, 340);

    ctx.font = "bold 34px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.fillText("ESCANEIE PARA CONHECER MINHA HISTÓRIA", 600, 1050);

    // Carregar imagem
    const qrImg = new window.Image();
    qrImg.crossOrigin = "anonymous";
    // Forçar a imagem do QR Code a ser gerada via URL
    qrImg.src = qrUrl;
    qrImg.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(350, 420, 500, 500);
      ctx.drawImage(qrImg, 370, 440, 460, 460);

      // Baixar imagem
      const link = document.createElement("a");
      link.download = `placa_lapis_qr_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  if (saved) {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(publicUrl)}`;

    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header>
          <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
            {isEditing ? "Memorial atualizado" : "Memorial criado"}
          </p>
          <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] font-light text-on-surface">{saved.memorial.name}</h1>
          <p className="mt-2 text-on-surface-variant">
            O memorial está publicado. Use o QR Code abaixo na placa ou lápide para abrir a página pública.
          </p>
        </header>

        <section className="grid gap-6 rounded-xl border border-tertiary/15 bg-[#0a192f]/60 p-6 md:grid-cols-[260px_1fr]">
          <div className="rounded-xl bg-white p-4">
            <Image
              src={qrImageUrl}
              alt={`QR Code de ${saved.memorial.name}`}
              width={260}
              height={260}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-on-surface-variant">Link público</p>
              <p className="mt-2 break-all text-lg text-tertiary">{publicUrl}</p>
              <p className="mt-4 text-on-surface-variant">{saved.memorial.epitaph}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={saved.qrCode.publicPath} className="rounded-full bg-tertiary px-5 py-3 text-sm font-semibold text-on-tertiary">
                Abrir memorial
              </Link>
              <button
                type="button"
                onClick={() => downloadFramedQRCode(saved.memorial.name, saved.memorial.epitaph, qrImageUrl)}
                className="rounded-full bg-yellow-600/10 border border-yellow-500/30 px-5 py-3 text-sm font-semibold text-yellow-400 hover:bg-yellow-600/20 shadow-lg hover:shadow-yellow-500/10 cursor-pointer"
              >
                Baixar Placa para Lápide
              </button>
              <Link href="/memoriais/lista" className="rounded-full border border-tertiary/50 px-5 py-3 text-sm text-tertiary">
                Ver meus memoriais
              </Link>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(publicUrl)}
                className="rounded-full border border-outline-variant px-5 py-3 text-sm text-on-surface-variant cursor-pointer"
              >
                Copiar link
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-4xl flex-col">
      <header className="mb-10">
        <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          {isEditing ? "Editar memorial" : "Novo memorial"}
        </p>
        <h1 className="font-h1 text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.1] text-on-surface">
          {isEditing ? "Atualize a história revelada pelo QR Code." : "Cadastre a história que o QR Code vai revelar."}
        </h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">
          Preencha os dados que devem aparecer para quem escanear a placa. Só nome e história são obrigatórios nesta etapa.
        </p>
      </header>

      {/* Real-time preview floating action top banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-[#0a192f66] p-4 rounded-xl border border-[#e9c349]/20 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-semibold text-[#e9c349] uppercase tracking-wider">Visualização em Tempo Real</h2>
          <p className="text-xs text-[#c4c7c7]/80">Veja exatamente como o memorial público oficial ficará na tela cheia.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowFullPreview(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/40 hover:bg-[#e9c349] hover:text-[#101414] px-6 py-2.5 text-xs font-bold tracking-widest text-[#e9c349] transition-all shadow-md active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-sm font-bold">visibility</span>
          <span>VISUALIZAR EM TELA CHEIA (1:1 CLONE)</span>
        </button>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-tertiary/10 bg-[#0a192f] p-6 shadow-2xl lg:p-10">
            {isLoading ? (
              <p className="rounded-lg border border-tertiary/20 bg-tertiary/10 p-3 text-sm text-tertiary">Carregando dados do memorial...</p>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Nome completo" required>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required placeholder="Ex: Maria das Graças Silva" className="input-line" />
              </Field>
              <Field label="Apelido">
                <input value={form.nickname} onChange={(event) => updateField("nickname", event.target.value)} placeholder="Ex: Dona Maria" className="input-line" />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Nascimento">
                <input value={form.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} type="date" className="input-line" />
              </Field>
              <Field label="Falecimento">
                <input value={form.deathDate} onChange={(event) => updateField("deathDate", event.target.value)} type="date" className="input-line" />
              </Field>
              <Field label="Cidade / Estado">
                <input value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Ex: São Paulo, SP" className="input-line" />
              </Field>
            </div>

            <Field label="Frase de homenagem">
              <input
                value={form.epitaph}
                onChange={(event) => updateField("epitaph", event.target.value)}
                placeholder="Ex: Seu amor permanece vivo em nossa memória."
                className="input-line"
              />
            </Field>

            <Field label="História / biografia" required>
              <textarea
                value={form.biography}
                onChange={(event) => updateField("biography", event.target.value)}
                required
                rows={7}
                placeholder="Conte a trajetória, valores, lembranças marcantes e o legado deixado por essa pessoa."
                className="min-h-40 w-full resize-y rounded-lg border border-on-surface/20 bg-transparent p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Foto principal">
                <div className="flex items-center gap-4 rounded-lg border border-on-surface/20 bg-surface-container/20 p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0">
                    {form.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.imageUrl} alt="Prévia principal" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-outline-variant">
                        <span className="material-symbols-outlined text-2xl">image</span>
                      </div>
                    )}
                    {isUploading === "imageUrl" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                      <span>{isUploading === "imageUrl" ? "Enviando..." : "Selecionar da Galeria"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading !== null}
                        onChange={(e) => handleFileUpload(e, "imageUrl")}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-on-surface-variant">PNG, JPG ou WEBP de até 5MB</span>
                  </div>
                </div>
              </Field>

              <Field label="Áudio de fundo (Opcional)">
                <div className="flex items-center gap-4 rounded-lg border border-on-surface/20 bg-surface-container/20 p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0 flex items-center justify-center text-outline-variant">
                    {form.audioUrl ? (
                      <span className="material-symbols-outlined text-2xl text-tertiary">music_note</span>
                    ) : (
                      <span className="material-symbols-outlined text-2xl">volume_mute</span>
                    )}
                    {isUploading === "audioUrl" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                      <span>{isUploading === "audioUrl" ? "Enviando..." : "Selecionar Áudio (MP3)"}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        disabled={isUploading !== null}
                        onChange={(e) => handleFileUpload(e, "audioUrl")}
                        className="hidden"
                      />
                    </label>
                    {form.audioUrl ? (
                      <span className="text-[10px] text-green-400">Áudio adicionado!</span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant">MP3 de até 15MB</span>
                    )}
                  </div>
                </div>
              </Field>

              <Field label="Tributo em Vídeo (Opcional)">
                <div className="flex items-center gap-4 rounded-lg border border-on-surface/20 bg-surface-container/20 p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0 flex items-center justify-center text-outline-variant">
                    {form.videoUrl ? (
                      <span className="material-symbols-outlined text-2xl text-tertiary">videocam</span>
                    ) : (
                      <span className="material-symbols-outlined text-2xl">videocam_off</span>
                    )}
                    {isUploading === "videoUrl" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                      <span>{isUploading === "videoUrl" ? "Enviando..." : "Selecionar Vídeo (MP4)"}</span>
                      <input
                        type="file"
                        accept="video/*"
                        disabled={isUploading !== null}
                        onChange={(e) => handleFileUpload(e, "videoUrl")}
                        className="hidden"
                      />
                    </label>
                    {form.videoUrl ? (
                      <span className="text-[10px] text-green-400">Vídeo adicionado!</span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant">MP4 de até 50MB</span>
                    )}
                  </div>
                </div>
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase tracking-wider text-outline font-semibold">Álbum de fotos (Galeria de Lembranças)</label>
                <span className="text-[10px] text-outline">{form.gallery.length}/12 fotos</span>
              </div>

              <div className="rounded-xl border border-outline-variant/30 bg-[#0a192f33] p-6 space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-lg py-8 px-4 text-center hover:border-tertiary/50 transition">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">collections</span>
                  <p className="text-xs text-[#c4c7c7] mb-3">Selecione fotos do seu computador ou celular para criar a galeria de lembranças.</p>
                  
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-6 py-2.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                    <span>{isUploadingGallery ? "Enviando Imagens..." : "Selecionar do Computador / Celular"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploadingGallery}
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-outline mt-2">Você pode selecionar várias imagens de uma vez (PNG, JPG, WEBP)</span>
                </div>

                {form.gallery.length > 0 && (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pt-2">
                    {form.gallery.map((item, index) => (
                      <div key={index} className="relative rounded-lg border border-outline-variant/30 bg-[#0a192f66] overflow-hidden group shadow-lg">
                        <div className="relative aspect-square w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0 transition" />
                          <button
                            type="button"
                            onClick={() => {
                              const newGallery = form.gallery.filter((_, idx) => idx !== index);
                              updateField("gallery", newGallery);
                            }}
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">close</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-outline-variant/20">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newGallery = [...form.gallery];
                              newGallery[index].title = e.target.value;
                              updateField("gallery", newGallery);
                            }}
                            placeholder="Legenda da foto"
                            className="w-full bg-transparent border-b border-transparent focus:border-tertiary py-1 px-1 text-[11px] text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-0 text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 border-t border-outline-variant/20 pt-6">
              <div className="flex justify-between items-center pb-2">
                <h3 className="font-h3 text-lg text-tertiary uppercase tracking-wider">Linha do Tempo (Momentos Marcantes)</h3>
                <button
                  type="button"
                  onClick={() => {
                    updateField("timelineEvents", [
                      ...form.timelineEvents,
                      { year: "", title: "", description: "", imageUrl: "" }
                    ]);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-tertiary/10 border border-tertiary/20 px-3 py-1 text-xs font-semibold text-tertiary hover:bg-tertiary/20 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  <span>Adicionar Capítulo</span>
                </button>
              </div>

              {form.timelineEvents.map((event, index) => (
                <div key={index} className="rounded-xl border border-tertiary/10 bg-[#0a192f33] p-5 space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-widest text-outline">Capítulo #{index + 1}</span>
                    {form.timelineEvents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newEvents = form.timelineEvents.filter((_, idx) => idx !== index);
                          updateField("timelineEvents", newEvents);
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[10px] font-semibold text-red-400 hover:bg-red-500/20 transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Remover</span>
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline font-semibold">Ano do Acontecimento</label>
                      <input
                        type="text"
                        value={event.year}
                        onChange={(e) => {
                          const newEvents = [...form.timelineEvents];
                          newEvents[index].year = e.target.value;
                          updateField("timelineEvents", newEvents);
                        }}
                        placeholder="Ex: 1985"
                        className="w-full rounded-lg border border-on-surface/20 bg-transparent px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline font-semibold">Título do Acontecimento</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => {
                          const newEvents = [...form.timelineEvents];
                          newEvents[index].title = e.target.value;
                          updateField("timelineEvents", newEvents);
                        }}
                        placeholder="Ex: Nascimento dos filhos"
                        className="w-full rounded-lg border border-on-surface/20 bg-transparent px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline font-semibold">Descrição</label>
                      <textarea
                        value={event.description}
                        onChange={(e) => {
                          const newEvents = [...form.timelineEvents];
                          newEvents[index].description = e.target.value;
                          updateField("timelineEvents", newEvents);
                        }}
                        placeholder="Descreva o que tornou este acontecimento inesquecível..."
                        rows={3}
                        className="w-full rounded-lg border border-on-surface/20 bg-transparent px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs uppercase tracking-wider text-outline font-semibold">Imagem do Momento</label>
                      <div className="flex items-center gap-4 rounded-lg border border-on-surface/20 bg-[#0a192f66] p-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0">
                          {event.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={event.imageUrl} alt={`Capítulo ${index + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-outline">
                              <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                          )}
                          {uploadingTimelineIndex === index && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                            <span>{uploadingTimelineIndex === index ? "Enviando..." : "Selecionar Foto"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingTimelineIndex !== null}
                              onChange={(e) => handleTimelineImageUpload(e, index)}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-outline">PNG, JPG ou WEBP de até 5MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {form.timelineEvents.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    updateField("timelineEvents", [
                      ...form.timelineEvents,
                      { year: "", title: "", description: "", imageUrl: "" }
                    ]);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-tertiary/40 rounded-xl py-4 text-xs font-semibold text-tertiary hover:bg-tertiary/5 hover:border-tertiary transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  <span>Adicionar Capítulo à Linha do Tempo</span>
                </button>
              )}
            </div>

            {error ? <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p> : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="inline-flex items-center gap-2 rounded-full bg-tertiary px-8 py-3 text-sm font-semibold text-on-tertiary transition hover:bg-tertiary-fixed disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? (isEditing ? "Salvando..." : "Criando...") : isEditing ? "Salvar alterações" : "Criar memorial e QR Code"}
                <span className="material-symbols-outlined text-lg">{isEditing ? "save" : "qr_code_2"}</span>
              </button>
            </div>
          </form>
        </div>
      <MemorialDesktopPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        data={form}
      />
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">
        {label} {required ? <strong className="text-tertiary">*</strong> : null}
      </span>
      {children}
    </label>
  );
}
