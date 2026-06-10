"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type GalleryItem = { title: string; url: string };
type TimelineEvent = { year: string; title: string; description: string; longStory: string; imageUrl: string };

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
  videoUrl: string;
  gallery: GalleryItem[];
  timelineEvents: TimelineEvent[];
  contactEmail: string; // e-mail do responsável (opcional)
};

const STEPS = [
  { id: 1, label: "Foto" },
  { id: 2, label: "Identificação" },
  { id: 3, label: "Biografia" },
  { id: 4, label: "Galeria" },
  { id: 5, label: "Linha do tempo" },
  { id: 6, label: "Áudio" },
  { id: 7, label: "Vídeo" },
  { id: 8, label: "Responsável" },
];

const EMPTY: FormData = {
  name: "", nickname: "", birthDate: "", deathDate: "", city: "",
  epitaph: "", biography: "", imageUrl: "", audioUrl: "", videoUrl: "",
  gallery: [], timelineEvents: [], contactEmail: "",
};

type Props = {
  /** Fecha o formulário após criação bem-sucedida */
  onClose: () => void;
};

export function CriarMemorialForm({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ memorialId: string; publicUrl: string } | null>(null);

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const payload = await res.json();
    return res.ok && payload.url ? (payload.url as string) : null;
  }

  function validateStep(): string {
    if (step === 2 && !form.name.trim()) return "Informe o nome do falecido.";
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
      const res = await fetch("/api/admin/memorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, videoUrl: form.videoUrl || undefined }),
      });
      const payload = await res.json();
      if (!res.ok) { setError(payload.error ?? "Não foi possível criar o memorial."); return; }
      setSuccess({ memorialId: payload.memorialId, publicUrl: payload.publicUrl });
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // ── Tela de sucesso ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-on-surface">Memorial criado com sucesso!</h3>
          <p className="mt-2 text-sm text-on-surface-variant">
            O memorial está ativo e pode ser acessado imediatamente.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={success.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#e9c349] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088]"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Ver memorial
          </a>
          <button
            onClick={() => { setSuccess(null); setStep(1); setForm(EMPTY); }}
            className="flex items-center gap-2 rounded-full border border-outline-variant/40 px-5 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:border-outline-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Criar outro
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-outline-variant/40 px-5 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:border-outline-variant hover:text-on-surface"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progresso */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-on-surface-variant/50">
          <span>{STEPS[step - 1].label}</span>
          <span>{step} / {STEPS.length}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-[#e9c349] transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
        <div className="mt-1.5 flex gap-1">
          {STEPS.map((s) => (
            <div key={s.id} className={`h-1 flex-1 rounded-full transition-all ${s.id < step ? "bg-[#e9c349]" : s.id === step ? "bg-[#e9c349]/60" : "bg-white/10"}`} />
          ))}
        </div>
      </div>

      {/* Conteúdo do step */}
      <div className="min-h-[280px]">
        {step === 1 && (
          <StepWrapper title="Foto do ente querido" subtitle="Uma boa foto torna o memorial mais especial.">
            <PhotoUpload imageUrl={form.imageUrl} uploading={uploading}
              onUpload={async (file) => { setUploading(true); const url = await uploadFile(file); setUploading(false); if (url) set("imageUrl", url); else setError("Erro ao enviar foto."); }}
              onRemove={() => set("imageUrl", "")} />
          </StepWrapper>
        )}
        {step === 2 && (
          <StepWrapper title="Identificação" subtitle="Dados principais do falecido.">
            <div className="grid gap-4">
              <Field label="Nome completo *" value={form.name} onChange={(v) => set("name", v)} placeholder="Ex: Maria da Silva" />
              <Field label="Apelido" value={form.nickname} onChange={(v) => set("nickname", v)} placeholder="Opcional" />
              <div className="grid gap-4 sm:grid-cols-2">
                <DateField label="Data de nascimento" value={form.birthDate} onChange={(v) => set("birthDate", v)} />
                <DateField label="Data de falecimento" value={form.deathDate} onChange={(v) => set("deathDate", v)} />
              </div>
              <Field label="Cidade" value={form.city} onChange={(v) => set("city", v)} placeholder="Ex: São Paulo, SP" />
            </div>
          </StepWrapper>
        )}
        {step === 3 && (
          <StepWrapper title="Mensagem e biografia" subtitle="As palavras que vão definir este memorial.">
            <div className="grid gap-5">
              <Field label="Epitáfio" value={form.epitaph} onChange={(v) => set("epitaph", v)} placeholder='"Viveu com amor e partiu deixando luz..."' />
              <TextArea label="Biografia" value={form.biography} onChange={(v) => set("biography", v)} rows={6} placeholder="Personalidade, conquistas, momentos marcantes..." />
            </div>
          </StepWrapper>
        )}
        {step === 4 && (
          <StepWrapper title="Galeria de fotos" subtitle="Adicione fotos que contam a história. Etapa opcional.">
            <GalleryStep gallery={form.gallery} uploading={uploading}
              onUpload={async (files) => {
                setUploading(true);
                const added: GalleryItem[] = [];
                for (const file of files) { const url = await uploadFile(file); if (url) added.push({ title: file.name.replace(/\.[^.]+$/, ""), url }); }
                setUploading(false);
                set("gallery", [...form.gallery, ...added]);
              }}
              onUpdateTitle={(i, title) => set("gallery", form.gallery.map((g, idx) => idx === i ? { ...g, title } : g))}
              onRemove={(i) => set("gallery", form.gallery.filter((_, idx) => idx !== i))} />
          </StepWrapper>
        )}
        {step === 5 && (
          <StepWrapper title="Linha do tempo" subtitle="Momentos marcantes em ordem cronológica. Etapa opcional.">
            <TimelineStep events={form.timelineEvents} uploading={uploading}
              onAdd={() => set("timelineEvents", [...form.timelineEvents, { year: "", title: "", description: "", longStory: "", imageUrl: "" }])}
              onUpdate={(i, field, val) => set("timelineEvents", form.timelineEvents.map((ev, idx) => idx === i ? { ...ev, [field]: val } : ev))}
              onImageUpload={async (i, file) => { setUploading(true); const url = await uploadFile(file); setUploading(false); if (url) set("timelineEvents", form.timelineEvents.map((ev, idx) => idx === i ? { ...ev, imageUrl: url } : ev)); }}
              onRemove={(i) => set("timelineEvents", form.timelineEvents.filter((_, idx) => idx !== i))} />
          </StepWrapper>
        )}
        {step === 6 && (
          <StepWrapper title="Áudio" subtitle="Voz, música ou mensagem para tocar no memorial. Etapa opcional.">
            <AudioStep audioUrl={form.audioUrl} uploading={uploading}
              onUpload={async (file) => { setUploading(true); const url = await uploadFile(file); setUploading(false); if (url) set("audioUrl", url); else setError("Erro ao enviar áudio."); }}
              onRemove={() => set("audioUrl", "")} />
          </StepWrapper>
        )}
        {step === 7 && (
          <StepWrapper title="Vídeo tributo" subtitle="Vídeo da galeria para exibir no memorial. Etapa opcional.">
            <VideoStep videoUrl={form.videoUrl} uploading={uploading}
              onUpload={async (file) => { setUploading(true); const url = await uploadFile(file); setUploading(false); if (url) set("videoUrl", url); else setError("Erro ao enviar vídeo."); }}
              onRemove={() => set("videoUrl", "")} />
          </StepWrapper>
        )}
        {step === 8 && (
          <StepWrapper title="Responsável (opcional)" subtitle="Informe o e-mail da família para vincular o memorial à conta deles.">
            <Field label="E-mail do responsável" value={form.contactEmail} onChange={(v) => set("contactEmail", v)} placeholder="email@exemplo.com" type="email" />
            <p className="mt-3 text-xs text-on-surface-variant/60">
              Deixe em branco para vincular ao seu próprio acesso.
            </p>
          </StepWrapper>
        )}
      </div>

      {/* Erro */}
      {error && (
        <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      {/* Navegação */}
      <div className="flex gap-3 pt-1">
        {step > 1 && (
          <button type="button" onClick={back}
            className="flex items-center gap-2 rounded-full border border-outline-variant/30 px-5 py-2.5 text-sm text-on-surface-variant transition hover:border-outline-variant/60 hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Anterior
          </button>
        )}
        <button type="button" onClick={back} className="sr-only" />
        {step < STEPS.length ? (
          <button type="button" onClick={next} disabled={uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e9c349] py-2.5 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088] disabled:opacity-50">
            Próximo
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={saving || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-emerald-400 disabled:opacity-50">
            {saving ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Criando...</> : <><span className="material-symbols-outlined text-sm">check_circle</span>Criar memorial</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-componentes de step ────────────────────────────────────────────────────

function StepWrapper({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-serif text-xl font-light text-[#e9c349]">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-on-surface-variant">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low/60 px-3 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/30 outline-none focus:border-[#e9c349]/60" />
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low/60 px-3 py-2.5 text-sm text-on-surface outline-none focus:border-[#e9c349]/60" />
    </label>
  );
}

function TextArea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 4} placeholder={placeholder}
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low/60 px-3 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/30 outline-none focus:border-[#e9c349]/60 resize-none" />
    </label>
  );
}

function PhotoUpload({ imageUrl, uploading, onUpload, onRemove }: { imageUrl: string; uploading: boolean; onUpload: (f: File) => void; onRemove: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <button type="button" onClick={() => ref.current?.click()}
        className="relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#e9c349]/30 bg-surface-container-low/40 transition hover:border-[#e9c349]/60">
        {imageUrl ? <Image src={imageUrl} alt="Foto" fill className="object-cover" /> : (
          <div className="flex flex-col items-center gap-1">
            {uploading ? <span className="material-symbols-outlined animate-spin text-2xl text-[#e9c349]/60">progress_activity</span>
              : <><span className="material-symbols-outlined text-3xl text-[#e9c349]/40">add_a_photo</span><span className="text-xs text-on-surface-variant/50">Adicionar foto</span></>}
          </div>
        )}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
      {imageUrl && <button type="button" onClick={onRemove} className="text-xs text-on-surface-variant/40 hover:text-red-400">Remover foto</button>}
    </div>
  );
}

function GalleryStep({ gallery, uploading, onUpload, onUpdateTitle, onRemove }: { gallery: GalleryItem[]; uploading: boolean; onUpload: (files: File[]) => void; onUpdateTitle: (i: number, t: string) => void; onRemove: (i: number) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-3">
      {gallery.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-3">
          <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg"><Image src={item.url} alt={item.title} fill className="object-cover" /></div>
          <div className="flex flex-1 flex-col gap-2">
            <input value={item.title} onChange={(e) => onUpdateTitle(i, e.target.value)} placeholder="Legenda"
              className="w-full rounded border border-outline-variant/20 bg-transparent px-2 py-1.5 text-xs text-on-surface outline-none focus:border-[#e9c349]/40" />
            <button type="button" onClick={() => onRemove(i)} className="self-start text-[0.65rem] text-on-surface-variant/40 hover:text-red-400">Remover</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-4 text-sm text-on-surface-variant/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349] disabled:opacity-50">
        {uploading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">add_photo_alternate</span>}
        {gallery.length === 0 ? "Adicionar fotos" : "Adicionar mais"}
      </button>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) onUpload(files); e.target.value = ""; }} />
    </div>
  );
}

function TimelineItem({ ev, index, uploading, onUpdate, onImageUpload, onRemove }: { ev: TimelineEvent; index: number; uploading: boolean; onUpdate: (f: keyof TimelineEvent, v: string) => void; onImageUpload: (f: File) => void; onRemove: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={ev.year} onChange={(e) => onUpdate("year", e.target.value)} placeholder="Ano" className="rounded border border-outline-variant/20 bg-transparent px-2 py-1.5 text-xs text-on-surface outline-none focus:border-[#e9c349]/40" />
        <input value={ev.title} onChange={(e) => onUpdate("title", e.target.value)} placeholder="Título" className="rounded border border-outline-variant/20 bg-transparent px-2 py-1.5 text-xs text-on-surface outline-none focus:border-[#e9c349]/40" />
      </div>
      <textarea value={ev.description} onChange={(e) => onUpdate("description", e.target.value)} placeholder="Descrição" rows={2}
        className="w-full rounded border border-outline-variant/20 bg-transparent px-2 py-1.5 text-xs text-on-surface outline-none focus:border-[#e9c349]/40 resize-none" />
      <div className="flex items-center gap-3">
        {ev.imageUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-lg"><Image src={ev.imageUrl} alt="" fill className="object-cover" /></div>
        ) : (
          <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-outline-variant/20 px-3 py-2 text-xs text-on-surface-variant/50 hover:border-[#e9c349]/30 hover:text-[#e9c349] disabled:opacity-50">
            {uploading ? <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span> : <span className="material-symbols-outlined text-xs">image</span>}
            Foto
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); }} />
        <button type="button" onClick={onRemove} className="ml-auto text-xs text-on-surface-variant/40 hover:text-red-400">Remover</button>
      </div>
    </div>
  );
}

function TimelineStep({ events, uploading, onAdd, onUpdate, onImageUpload, onRemove }: { events: TimelineEvent[]; uploading: boolean; onAdd: () => void; onUpdate: (i: number, f: keyof TimelineEvent, v: string) => void; onImageUpload: (i: number, f: File) => void; onRemove: (i: number) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((ev, i) => (
        <TimelineItem
          key={i}
          ev={ev}
          index={i}
          uploading={uploading}
          onUpdate={(f, v) => onUpdate(i, f, v)}
          onImageUpload={(f) => onImageUpload(i, f)}
          onRemove={() => onRemove(i)}
        />
      ))}
      <button type="button" onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/20 py-4 text-sm text-on-surface-variant/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349]">
        <span className="material-symbols-outlined text-sm">add_circle</span>Adicionar momento
      </button>
    </div>
  );
}

function AudioStep({ audioUrl, uploading, onUpload, onRemove }: { audioUrl: string; uploading: boolean; onUpload: (f: File) => void; onRemove: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-3">
      {audioUrl ? (
        <><audio controls src={audioUrl} className="w-full rounded-lg" /><button type="button" onClick={onRemove} className="self-start text-xs text-on-surface-variant/40 hover:text-red-400">Remover áudio</button></>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-[#e9c349]/20 py-8 text-sm text-on-surface-variant/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349] disabled:opacity-50">
          {uploading ? <><span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>Enviando...</> : <><span className="material-symbols-outlined text-2xl">audio_file</span><span>Selecionar áudio<span className="mt-1 block text-[0.65rem] opacity-50">MP3, WAV, AAC — máx. 20 MB</span></span></>}
        </button>
      )}
      <input ref={ref} type="file" accept="audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
    </div>
  );
}

function VideoStep({ videoUrl, uploading, onUpload, onRemove }: { videoUrl: string; uploading: boolean; onUpload: (f: File) => void; onRemove: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-3">
      {videoUrl ? (
        <><video src={videoUrl} controls playsInline className="w-full rounded-xl border border-outline-variant/20 bg-black" /><button type="button" onClick={onRemove} className="self-start text-xs text-on-surface-variant/40 hover:text-red-400">Remover vídeo</button></>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-[#e9c349]/20 py-8 text-sm text-on-surface-variant/60 transition hover:border-[#e9c349]/40 hover:text-[#e9c349] disabled:opacity-50">
          {uploading ? <><span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>Enviando...</> : <><span className="material-symbols-outlined text-2xl">video_file</span><span>Selecionar vídeo<span className="mt-1 block text-[0.65rem] opacity-50">MP4, MOV, WebM — máx. 100 MB</span></span></>}
        </button>
      )}
      <input ref={ref} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
    </div>
  );
}
