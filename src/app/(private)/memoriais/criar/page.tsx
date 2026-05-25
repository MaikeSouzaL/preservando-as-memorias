"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const initialForm = {
  name: "",
  nickname: "",
  birthDate: "",
  deathDate: "",
  city: "",
  epitaph: "",
  biography: "",
  imageUrl: "",
  audioUrl: "",
  galleryUrls: "",
  timelineYear: "",
  timelineTitle: "",
  timelineDescription: "",
  timelineImageUrl: "",
};

function formFromMemorial(payload: SavedMemorial): typeof initialForm {
  const memorial = payload.memorial;
  const firstTimeline = memorial.timelineEvents?.[0];

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
    galleryUrls: memorial.gallery?.map((item) => `${item.title} | ${item.url}`).join("\n") ?? "",
    timelineYear: firstTimeline?.year ?? "",
    timelineTitle: firstTimeline?.title ?? "",
    timelineDescription: firstTimeline?.description ?? "",
    timelineImageUrl: firstTimeline?.imageUrl ?? "",
  };
}

export default function CriarMemorialPage() {
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedMemorial | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const isEditing = Boolean(editId);
  const previewImage = form.imageUrl || "/images/hero-bg.png";
  const publicUrl = useMemo(() => {
    if (!saved || typeof window === "undefined") return "";
    return `${window.location.origin}${saved.qrCode.publicPath}`;
  }, [saved]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, fieldName: "imageUrl" | "timelineImageUrl" | "audioUrl") {
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

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
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
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-col">
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

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <section className="lg:col-span-8">
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

            <div className="grid gap-6 md:grid-cols-2">
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
            </div>

            <Field label="Álbum de fotos">
              <textarea
                value={form.galleryUrls}
                onChange={(event) => updateField("galleryUrls", event.target.value)}
                rows={4}
                placeholder={"Uma foto por linha. Use: Título da foto | https://url-da-foto.jpg"}
                className="min-h-28 w-full resize-y rounded-lg border border-on-surface/20 bg-transparent p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
              />
            </Field>

            <section className="rounded-xl border border-tertiary/10 bg-surface-container/20 p-5">
              <h3 className="mb-4 font-h3 text-xl text-tertiary">Primeiro capítulo da linha do tempo</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Ano">
                  <input value={form.timelineYear} onChange={(event) => updateField("timelineYear", event.target.value)} placeholder="Ex: 1985" className="input-line" />
                </Field>
                <Field label="Título do momento">
                  <input value={form.timelineTitle} onChange={(event) => updateField("timelineTitle", event.target.value)} placeholder="Ex: O nascimento dos filhos" className="input-line" />
                </Field>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Field label="Descrição">
                  <textarea
                    value={form.timelineDescription}
                    onChange={(event) => updateField("timelineDescription", event.target.value)}
                    rows={4}
                    placeholder="Conte um momento marcante que deve aparecer na linha do tempo pública."
                    className="min-h-28 w-full resize-y rounded-lg border border-on-surface/20 bg-transparent p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:border-tertiary focus:outline-none"
                  />
                </Field>
                <Field label="Imagem do momento">
                  <div className="flex items-center gap-4 rounded-lg border border-on-surface/20 bg-surface-container/20 p-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-tertiary/20 bg-background shrink-0">
                      {form.timelineImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.timelineImageUrl} alt="Prévia momento" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-outline-variant">
                          <span className="material-symbols-outlined text-2xl">image</span>
                        </div>
                      )}
                      {isUploading === "timelineImageUrl" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2 text-xs font-semibold text-tertiary transition hover:bg-tertiary/20">
                        <span>{isUploading === "timelineImageUrl" ? "Enviando..." : "Selecionar da Galeria"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading !== null}
                          onChange={(e) => handleFileUpload(e, "timelineImageUrl")}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-on-surface-variant">PNG, JPG ou WEBP de até 5MB</span>
                    </div>
                  </div>
                </Field>
              </div>
            </section>

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
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-xl border border-tertiary/10 bg-[#0a192f] p-6">
            <h2 className="mb-5 font-h3 text-[1.5rem] text-tertiary">Pré-visualização</h2>
            <div className="overflow-hidden rounded-xl border border-tertiary/15 bg-surface-container-low">
              <div className="relative h-56">
                <Image src={previewImage} alt="Prévia do memorial" fill className="object-cover grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="font-h3 text-2xl text-on-surface">{form.name || "Nome do ente querido"}</h3>
                <p className="text-sm text-on-surface-variant">
                  {[form.birthDate, form.deathDate].filter(Boolean).join(" - ") || "Datas de vida"}
                </p>
                <p className="italic text-tertiary">{form.epitaph || "Frase de homenagem"}</p>
                <p className="line-clamp-5 text-sm text-on-surface-variant">{form.biography || "A história aparecerá aqui para visitantes do QR Code."}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
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
