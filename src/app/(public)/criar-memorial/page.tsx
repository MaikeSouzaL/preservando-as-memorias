"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type GalleryItem = { title: string; url: string };
type TimelineEvent = { year: string; title: string; description: string; longStory: string; imageUrl: string };

type FormData = {
  familyName: string;
  email: string;
  name: string;
  nickname: string;
  birthDate: string;
  deathDate: string;
  city: string;
  epitaph: string;
  biography: string;
  imageUrl: string;
  audioUrl: string;
  gallery: GalleryItem[];
  timelineEvents: TimelineEvent[];
};

const emptyTimeline = (): TimelineEvent => ({
  year: "",
  title: "",
  description: "",
  longStory: "",
  imageUrl: "",
});

export default function CriarMemorialPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    familyName: "",
    email: "",
    name: "",
    nickname: "",
    birthDate: "",
    deathDate: "",
    city: "",
    epitaph: "",
    biography: "",
    imageUrl: "",
    audioUrl: "",
    gallery: [],
    timelineEvents: [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mainPhotoRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const payload = await res.json();
    return res.ok && payload.url ? (payload.url as string) : null;
  }

  async function handleMainPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) set("imageUrl", url);
    else setError("Não foi possível enviar a foto principal.");
  }

  async function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: GalleryItem[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploaded.push({ title: file.name.replace(/\.[^.]+$/, ""), url });
    }
    setUploading(false);
    set("gallery", [...form.gallery, ...uploaded]);
    if (galleryRef.current) galleryRef.current.value = "";
  }

  function updateGalleryTitle(index: number, title: string) {
    const updated = form.gallery.map((item, i) => (i === index ? { ...item, title } : item));
    set("gallery", updated);
  }

  function removeGalleryItem(index: number) {
    set("gallery", form.gallery.filter((_, i) => i !== index));
  }

  function addTimeline() {
    set("timelineEvents", [...form.timelineEvents, emptyTimeline()]);
  }

  function updateTimeline(index: number, field: keyof TimelineEvent, value: string) {
    const updated = form.timelineEvents.map((ev, i) =>
      i === index ? { ...ev, [field]: value } : ev
    );
    set("timelineEvents", updated);
  }

  async function handleTimelineImage(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);
    if (url) updateTimeline(index, "imageUrl", url);
  }

  function removeTimeline(index: number) {
    set("timelineEvents", form.timelineEvents.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Informe o nome do falecido.");
    if (!form.familyName.trim()) return setError("Informe seu nome.");
    if (!form.email.trim() || !form.email.includes("@"))
      return setError("Informe um e-mail válido.");

    setSaving(true);
    try {
      const res = await fetch("/api/memorial-publico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? "Não foi possível criar o memorial.");
        return;
      }
      router.push(`/checkout?memorialId=${payload.memorialId}&payerType=family`);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-dvh bg-[#0b0f0f] text-[#e0e3e2]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[600px] w-[600px] rounded-full bg-[#e9c349]/4 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#e9c349]/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 py-12 md:py-20">
        <div className="mb-10 text-center">
          <a
            href="/landing"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#c4c7c7]/60 transition hover:text-[#e9c349]"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar
          </a>
          <h1 className="mt-4 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-light tracking-wide text-[#e9c349]">
            Criar Memorial
          </h1>
          <p className="mt-2 text-sm text-[#c4c7c7]/70">
            Preencha os dados do seu ente querido. Após o pagamento, o memorial é publicado com QR Code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ── 1. Foto principal ── */}
          <Section title="Foto principal">
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => mainPhotoRef.current?.click()}
                className="relative flex h-44 w-44 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#e9c349]/30 bg-[#0a192f]/60 transition hover:border-[#e9c349]/60"
              >
                {form.imageUrl ? (
                  <Image src={form.imageUrl} alt="Foto principal" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    {uploading ? (
                      <span className="material-symbols-outlined animate-spin text-2xl text-[#e9c349]/60">
                        progress_activity
                      </span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl text-[#e9c349]/40">add_a_photo</span>
                        <span className="text-xs text-[#c4c7c7]/50">Adicionar foto</span>
                      </>
                    )}
                  </div>
                )}
              </button>
              <input ref={mainPhotoRef} type="file" accept="image/*" onChange={handleMainPhoto} className="hidden" />
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => set("imageUrl", "")}
                  className="text-xs text-[#c4c7c7]/40 transition hover:text-red-400"
                >
                  Remover foto
                </button>
              )}
            </div>
          </Section>

          {/* ── 2. Dados do falecido ── */}
          <Section title="Dados do falecido">
            <div className="grid gap-4">
              <Field label="Nome completo *" value={form.name} onChange={(v) => set("name", v)} placeholder="Ex: Maria da Silva" />
              <Field label="Apelido / como era chamado" value={form.nickname} onChange={(v) => set("nickname", v)} placeholder="Opcional" />
              <div className="grid gap-4 sm:grid-cols-2">
                <DateField label="Data de nascimento" value={form.birthDate} onChange={(v) => set("birthDate", v)} />
                <DateField label="Data de falecimento" value={form.deathDate} onChange={(v) => set("deathDate", v)} />
              </div>
              <Field label="Cidade" value={form.city} onChange={(v) => set("city", v)} placeholder="Ex: São Paulo, SP" />
              <Field
                label="Epitáfio — frase que o representa"
                value={form.epitaph}
                onChange={(v) => set("epitaph", v)}
                placeholder='"Viveu com amor e partiu deixando luz..."'
              />
            </div>
          </Section>

          {/* ── 3. Biografia ── */}
          <Section title="Biografia">
            <TextArea
              label="Conte a história de vida"
              value={form.biography}
              onChange={(v) => set("biography", v)}
              rows={6}
              placeholder="Personalidade, conquistas, momentos marcantes, o que será sempre lembrado..."
            />
          </Section>

          {/* ── 4. Galeria de fotos ── */}
          <Section title="Galeria de fotos" subtitle="Adicione fotos que contam a história de vida">
            <div className="flex flex-col gap-4">
              {form.gallery.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {form.gallery.map((item, i) => (
                    <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-[#0b0f0f]/40 p-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.url} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <input
                          value={item.title}
                          onChange={(e) => updateGalleryTitle(i, e.target.value)}
                          placeholder="Legenda da foto"
                          className="w-full rounded border border-white/10 bg-transparent px-2 py-1 text-xs text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(i)}
                          className="self-start text-[0.65rem] text-[#c4c7c7]/40 transition hover:text-red-400"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-4 text-sm text-[#c4c7c7]/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349] disabled:opacity-50"
              >
                {uploading ? (
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                )}
                Adicionar fotos
              </button>
              <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="hidden" />
            </div>
          </Section>

          {/* ── 5. Linha do tempo ── */}
          <Section title="Linha do tempo" subtitle="Momentos marcantes da vida — em ordem cronológica">
            <div className="flex flex-col gap-4">
              {form.timelineEvents.map((ev, i) => (
                <TimelineCard
                  key={i}
                  index={i}
                  event={ev}
                  uploading={uploading}
                  onChange={(field, val) => updateTimeline(i, field, val)}
                  onImageChange={(e) => handleTimelineImage(i, e)}
                  onRemove={() => removeTimeline(i)}
                />
              ))}
              <button
                type="button"
                onClick={addTimeline}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-4 text-sm text-[#c4c7c7]/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349]"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Adicionar momento
              </button>
            </div>
          </Section>

          {/* ── 6. Áudio ── */}
          <Section title="Áudio (opcional)" subtitle="Voz, música ou mensagem de áudio para tocar no memorial">
            <Field
              label="Link do áudio (Soundcloud, Drive, etc.)"
              type="url"
              value={form.audioUrl}
              onChange={(v) => set("audioUrl", v)}
              placeholder="https://..."
            />
          </Section>

          {/* ── 7. Seus dados ── */}
          <Section title="Seus dados">
            <div className="grid gap-4">
              <Field
                label="Seu nome *"
                value={form.familyName}
                onChange={(v) => set("familyName", v)}
                placeholder="Nome de quem está criando o memorial"
              />
              <Field
                label="Seu e-mail *"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="Você receberá o acesso ao dashboard por aqui"
              />
            </div>
          </Section>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e9c349] py-4 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                Salvando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                Continuar para pagamento
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/5 bg-[#0a192f]/50 p-6">
      <div className="mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e9c349]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-[#c4c7c7]/50">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40"
      />
    </label>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] outline-none transition focus:border-[#e9c349]/40 [color-scheme:dark]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="resize-y rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40"
      />
    </label>
  );
}

function TimelineCard({
  index,
  event,
  uploading,
  onChange,
  onImageChange,
  onRemove,
}: {
  index: number;
  event: TimelineEvent;
  uploading: boolean;
  onChange: (field: keyof TimelineEvent, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#0b0f0f]/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.65rem] uppercase tracking-widest text-[#e9c349]/60">
          Momento {index + 1}
        </span>
        <button type="button" onClick={onRemove} className="text-xs text-[#c4c7c7]/40 transition hover:text-red-400">
          Remover
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Ano *</span>
          <input
            type="number"
            value={event.year}
            onChange={(e) => onChange("year", e.target.value)}
            placeholder="Ex: 1985"
            min="1900"
            max="2100"
            className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Título *</span>
          <input
            value={event.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Ex: Casamento"
            className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Descrição</span>
        <textarea
          value={event.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={2}
          placeholder="Breve descrição deste momento..."
          className="resize-y rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">História completa (opcional)</span>
        <textarea
          value={event.longStory}
          onChange={(e) => onChange("longStory", e.target.value)}
          rows={3}
          placeholder="Detalhes, memórias e relatos sobre este momento..."
          className="resize-y rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
        />
      </label>

      <div>
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]/60">Foto do momento</span>
        {event.imageUrl ? (
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-24 overflow-hidden rounded-lg">
              <Image src={event.imageUrl} alt="Foto do momento" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onChange("imageUrl", "")}
              className="text-xs text-[#c4c7c7]/40 transition hover:text-red-400"
            >
              Remover
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imgRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-2 text-xs text-[#c4c7c7]/50 transition hover:border-[#e9c349]/30 hover:text-[#e9c349] disabled:opacity-50"
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-xs">add_photo_alternate</span>
            )}
            Adicionar foto
          </button>
        )}
        <input ref={imgRef} type="file" accept="image/*" onChange={onImageChange} className="hidden" />
      </div>
    </div>
  );
}
