"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type GalleryItem = { title: string; url: string };
type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  longStory: string;
  imageUrl: string;
};

type FormData = {
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
  familyName: string;
  email: string;
};

const STEPS = [
  { id: 1, label: "Foto" },
  { id: 2, label: "Identificação" },
  { id: 3, label: "Biografia" },
  { id: 4, label: "Galeria" },
  { id: 5, label: "Linha do tempo" },
  { id: 6, label: "Áudio" },
  { id: 7, label: "Seus dados" },
];

export default function CriarMemorialPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
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
    familyName: "",
    email: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  function validateStep(): string {
    if (step === 2 && !form.name.trim()) return "Informe o nome do falecido.";
    if (step === 7) {
      if (!form.familyName.trim()) return "Informe seu nome.";
      if (!form.email.trim() || !form.email.includes("@")) return "Informe um e-mail válido.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/memorial-publico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) { setError(payload.error ?? "Não foi possível criar o memorial."); return; }
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

      <div className="relative mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-12">

        {/* Back link */}
        <a
          href="/landing"
          className="mb-8 inline-flex items-center gap-2 self-start text-sm text-[#c4c7c7]/50 transition hover:text-[#e9c349]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Voltar
        </a>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-[#c4c7c7]/40">
            <span>{STEPS[step - 1].label}</span>
            <span>{step} / {STEPS.length}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-[#e9c349] transition-all duration-500"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex gap-1">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s.id < step
                    ? "bg-[#e9c349]"
                    : s.id === step
                    ? "bg-[#e9c349]/60"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex flex-1 flex-col">
          {step === 1 && (
            <StepPhoto
              imageUrl={form.imageUrl}
              uploading={uploading}
              onUpload={async (file) => {
                setUploading(true);
                const url = await uploadImage(file);
                setUploading(false);
                if (url) set("imageUrl", url);
                else setError("Não foi possível enviar a foto.");
              }}
              onRemove={() => set("imageUrl", "")}
            />
          )}

          {step === 2 && (
            <StepIdentificacao
              form={form}
              onChange={(field, val) => set(field as keyof FormData, val as FormData[keyof FormData])}
            />
          )}

          {step === 3 && (
            <StepBiografia
              epitaph={form.epitaph}
              biography={form.biography}
              onEpitaph={(v) => set("epitaph", v)}
              onBiography={(v) => set("biography", v)}
            />
          )}

          {step === 4 && (
            <StepGaleria
              gallery={form.gallery}
              uploading={uploading}
              onUpload={async (files) => {
                setUploading(true);
                const added: GalleryItem[] = [];
                for (const file of files) {
                  const url = await uploadImage(file);
                  if (url) added.push({ title: file.name.replace(/\.[^.]+$/, ""), url });
                }
                setUploading(false);
                set("gallery", [...form.gallery, ...added]);
              }}
              onUpdateTitle={(i, title) =>
                set("gallery", form.gallery.map((g, idx) => (idx === i ? { ...g, title } : g)))
              }
              onRemove={(i) => set("gallery", form.gallery.filter((_, idx) => idx !== i))}
            />
          )}

          {step === 5 && (
            <StepTimeline
              events={form.timelineEvents}
              uploading={uploading}
              onAdd={() => set("timelineEvents", [...form.timelineEvents, { year: "", title: "", description: "", longStory: "", imageUrl: "" }])}
              onUpdate={(i, field, val) =>
                set("timelineEvents", form.timelineEvents.map((ev, idx) => (idx === i ? { ...ev, [field]: val } : ev)))
              }
              onImageUpload={async (i, file) => {
                setUploading(true);
                const url = await uploadImage(file);
                setUploading(false);
                if (url)
                  set("timelineEvents", form.timelineEvents.map((ev, idx) => (idx === i ? { ...ev, imageUrl: url } : ev)));
              }}
              onRemove={(i) => set("timelineEvents", form.timelineEvents.filter((_, idx) => idx !== i))}
            />
          )}

          {step === 6 && (
            <StepAudio audioUrl={form.audioUrl} onChange={(v) => set("audioUrl", v)} />
          )}

          {step === 7 && (
            <StepSeusDados
              familyName={form.familyName}
              email={form.email}
              onName={(v) => set("familyName", v)}
              onEmail={(v) => set("email", v)}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-[#c4c7c7]/70 transition hover:border-white/20 hover:text-[#e0e3e2]"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Anterior
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={next}
              disabled={uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e9c349] py-3 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50"
            >
              Próximo
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e9c349] py-3 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">payment</span>
                  Ir para pagamento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// ── Step components ────────────────────────────────────────────────────────────

function StepPhoto({
  imageUrl,
  uploading,
  onUpload,
  onRemove,
}: {
  imageUrl: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <StepWrapper
      title="Foto do ente querido"
      subtitle="Uma boa foto torna o memorial mais especial. Você pode continuar sem ela."
    >
      <div className="flex flex-col items-center gap-5 py-4">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="relative flex h-52 w-52 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#e9c349]/30 bg-[#0a192f]/60 transition hover:border-[#e9c349]/60"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="Foto" fill className="object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <span className="material-symbols-outlined animate-spin text-3xl text-[#e9c349]/60">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-[#e9c349]/40">add_a_photo</span>
                  <span className="text-xs text-[#c4c7c7]/50">Clique para adicionar</span>
                </>
              )}
            </div>
          )}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
        {imageUrl && (
          <button type="button" onClick={onRemove} className="text-xs text-[#c4c7c7]/40 transition hover:text-red-400">
            Remover foto
          </button>
        )}
      </div>
    </StepWrapper>
  );
}

function StepIdentificacao({
  form,
  onChange,
}: {
  form: Pick<FormData, "name" | "nickname" | "birthDate" | "deathDate" | "city">;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <StepWrapper title="Identificação" subtitle="Dados principais do falecido">
      <div className="grid gap-4">
        <Field label="Nome completo *" value={form.name} onChange={(v) => onChange("name", v)} placeholder="Ex: Maria da Silva" />
        <Field label="Apelido / como era chamado" value={form.nickname} onChange={(v) => onChange("nickname", v)} placeholder="Opcional" />
        <div className="grid gap-4 sm:grid-cols-2">
          <DateField label="Data de nascimento" value={form.birthDate} onChange={(v) => onChange("birthDate", v)} />
          <DateField label="Data de falecimento" value={form.deathDate} onChange={(v) => onChange("deathDate", v)} />
        </div>
        <Field label="Cidade" value={form.city} onChange={(v) => onChange("city", v)} placeholder="Ex: São Paulo, SP" />
      </div>
    </StepWrapper>
  );
}

function StepBiografia({
  epitaph,
  biography,
  onEpitaph,
  onBiography,
}: {
  epitaph: string;
  biography: string;
  onEpitaph: (v: string) => void;
  onBiography: (v: string) => void;
}) {
  return (
    <StepWrapper title="Mensagem e biografia" subtitle="As palavras que vão definir este memorial">
      <div className="grid gap-5">
        <Field
          label="Epitáfio — frase que o representa"
          value={epitaph}
          onChange={onEpitaph}
          placeholder='"Viveu com amor e partiu deixando luz..."'
        />
        <TextArea
          label="Biografia"
          value={biography}
          onChange={onBiography}
          rows={7}
          placeholder="Personalidade, conquistas, momentos marcantes, o que será sempre lembrado..."
        />
      </div>
    </StepWrapper>
  );
}

function StepGaleria({
  gallery,
  uploading,
  onUpload,
  onUpdateTitle,
  onRemove,
}: {
  gallery: GalleryItem[];
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onUpdateTitle: (i: number, title: string) => void;
  onRemove: (i: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <StepWrapper title="Galeria de fotos" subtitle="Adicione fotos que contam a história. Você pode pular esta etapa.">
      <div className="flex flex-col gap-4">
        {gallery.length > 0 && (
          <div className="grid gap-3">
            {gallery.map((item, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-[#0b0f0f]/40 p-3">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.url} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    value={item.title}
                    onChange={(e) => onUpdateTitle(i, e.target.value)}
                    placeholder="Legenda da foto"
                    className="w-full rounded border border-white/10 bg-transparent px-2 py-1.5 text-xs text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40"
                  />
                  <button type="button" onClick={() => onRemove(i)} className="self-start text-[0.65rem] text-[#c4c7c7]/40 hover:text-red-400">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-5 text-sm text-[#c4c7c7]/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349] disabled:opacity-50"
        >
          {uploading
            ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            : <span className="material-symbols-outlined text-sm">add_photo_alternate</span>}
          {gallery.length === 0 ? "Adicionar fotos" : "Adicionar mais fotos"}
        </button>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) onUpload(files); e.target.value = ""; }} />
      </div>
    </StepWrapper>
  );
}

function StepTimeline({
  events,
  uploading,
  onAdd,
  onUpdate,
  onImageUpload,
  onRemove,
}: {
  events: TimelineEvent[];
  uploading: boolean;
  onAdd: () => void;
  onUpdate: (i: number, field: keyof TimelineEvent, val: string) => void;
  onImageUpload: (i: number, file: File) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <StepWrapper title="Linha do tempo" subtitle="Momentos marcantes da vida, em ordem cronológica. Etapa opcional.">
      <div className="flex flex-col gap-4">
        {events.map((ev, i) => (
          <TimelineCard
            key={i}
            index={i}
            event={ev}
            uploading={uploading}
            onChange={(field, val) => onUpdate(i, field, val)}
            onImageChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(i, f); }}
            onRemove={() => onRemove(i)}
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-4 text-sm text-[#c4c7c7]/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349]"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Adicionar momento
        </button>
      </div>
    </StepWrapper>
  );
}

function StepAudio({ audioUrl, onChange }: { audioUrl: string; onChange: (v: string) => void }) {
  return (
    <StepWrapper title="Áudio" subtitle="Voz, música preferida ou mensagem para tocar no memorial. Etapa opcional.">
      <Field
        label="Link do áudio (SoundCloud, Google Drive, etc.)"
        type="url"
        value={audioUrl}
        onChange={onChange}
        placeholder="https://..."
      />
      <p className="mt-3 text-xs text-[#c4c7c7]/40">
        Deixe em branco para pular esta etapa.
      </p>
    </StepWrapper>
  );
}

function StepSeusDados({
  familyName,
  email,
  onName,
  onEmail,
}: {
  familyName: string;
  email: string;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
}) {
  return (
    <StepWrapper
      title="Seus dados"
      subtitle="Informe o melhor e-mail para receber o acesso ao memorial após o pagamento."
    >
      <div className="grid gap-5">
        <Field label="Seu nome *" value={familyName} onChange={onName} placeholder="Nome de quem está criando o memorial" />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Seu melhor e-mail *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40"
          />
          <p className="text-xs text-[#c4c7c7]/40">
            Você usará este e-mail para acessar o dashboard e gerenciar o memorial.
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

// ── Shared UI ──────────────────────────────────────────────────────────────────

function StepWrapper({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl font-light text-[#e9c349]">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-[#c4c7c7]/60">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
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

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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

function TextArea({ label, value, onChange, placeholder, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
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

function TimelineCard({ index, event, uploading, onChange, onImageChange, onRemove }: {
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
        <span className="text-[0.65rem] uppercase tracking-widest text-[#e9c349]/60">Momento {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-xs text-[#c4c7c7]/40 hover:text-red-400">Remover</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Ano *</span>
          <input type="number" value={event.year} onChange={(e) => onChange("year", e.target.value)} placeholder="Ex: 1985" min="1900" max="2100"
            className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Título *</span>
          <input value={event.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Ex: Casamento"
            className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">Descrição</span>
        <textarea value={event.description} onChange={(e) => onChange("description", e.target.value)} rows={2} placeholder="Breve descrição..."
          className="resize-y rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">História completa (opcional)</span>
        <textarea value={event.longStory} onChange={(e) => onChange("longStory", e.target.value)} rows={3} placeholder="Detalhes e memórias sobre este momento..."
          className="resize-y rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2 text-sm text-[#e0e3e2] placeholder-white/20 outline-none focus:border-[#e9c349]/40" />
      </label>
      <div>
        <span className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]/60">Foto do momento</span>
        {event.imageUrl ? (
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-20 overflow-hidden rounded-lg">
              <Image src={event.imageUrl} alt="Foto" fill className="object-cover" />
            </div>
            <button type="button" onClick={() => onChange("imageUrl", "")} className="text-xs text-[#c4c7c7]/40 hover:text-red-400">Remover</button>
          </div>
        ) : (
          <button type="button" onClick={() => imgRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-2 text-xs text-[#c4c7c7]/50 transition hover:border-[#e9c349]/30 hover:text-[#e9c349] disabled:opacity-50">
            {uploading
              ? <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>
              : <span className="material-symbols-outlined text-xs">add_photo_alternate</span>}
            Adicionar foto
          </button>
        )}
        <input ref={imgRef} type="file" accept="image/*" onChange={onImageChange} className="hidden" />
      </div>
    </div>
  );
}
