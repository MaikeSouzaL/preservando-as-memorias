"use client";

import { useState } from "react";
import MemorialDesktopPreview from "@/src/components/memorial-desktop-preview";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

export type DeliveryAddressData = {
  recipientName: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type MemorialFormData = {
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
  deliveryAddress?: DeliveryAddressData;
};

const INITIAL_DATA: MemorialFormData = {
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
  timelineEvents: [{ year: "", title: "", description: "", imageUrl: "" }],
};

type Props = {
  onSubmit: (data: MemorialFormData) => Promise<void>;
  submitLabel?: string;
  initialData?: Partial<MemorialFormData>;
};

export function MemorialForm({ onSubmit, submitLabel = "Salvar e Criar Memorial", initialData }: Props) {
  const [form, setForm] = useState<MemorialFormData>({ ...INITIAL_DATA, ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressData>({
    recipientName: "", cep: "", logradouro: "", numero: "",
    complemento: "", bairro: "", cidade: "", estado: "",
  });

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadingTimelineIndex, setUploadingTimelineIndex] = useState<number | null>(null);

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Erro no upload");
    return data.url as string;
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageUrl" | "audioUrl" | "videoUrl"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(field);
    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      alert(`Falha no upload: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
    } finally {
      setIsUploading(null);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    const newItems = [...form.gallery];
    for (let i = 0; i < files.length; i++) {
      if (newItems.length >= 12) break;
      try {
        const url = await uploadFile(files[i]);
        newItems.push({
          title: files[i].name.split(".")[0].slice(0, 40) || `Foto ${newItems.length + 1}`,
          url,
        });
      } catch (err) {
        alert(`Falha ao enviar "${files[i].name}": ${err instanceof Error ? err.message : "Erro"}`);
      }
    }
    setForm((prev) => ({ ...prev, gallery: newItems }));
    setIsUploadingGallery(false);
  }

  async function handleTimelineImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTimelineIndex(index);
    try {
      const url = await uploadFile(file);
      setForm((prev) => {
        const events = [...prev.timelineEvents];
        events[index] = { ...events[index], imageUrl: url };
        return { ...prev, timelineEvents: events };
      });
    } catch (err) {
      alert(`Falha no upload: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
    } finally {
      setUploadingTimelineIndex(null);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addTimelineEvent() {
    setForm((prev) => ({
      ...prev,
      timelineEvents: [...prev.timelineEvents, { year: "", title: "", description: "", imageUrl: "" }],
    }));
  }

  function removeTimelineEvent(index: number) {
    setForm((prev) => ({
      ...prev,
      timelineEvents: prev.timelineEvents.filter((_, i) => i !== index),
    }));
  }

  function updateTimelineEvent(index: number, field: string, value: string) {
    setForm((prev) => {
      const events = [...prev.timelineEvents];
      events[index] = { ...events[index], [field]: value };
      return { ...prev, timelineEvents: events };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        deliveryAddress: deliveryAddress.recipientName ? deliveryAddress : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar memorial.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Preview banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#e9c349]/20 bg-[#0a192f66] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#e9c349]">Visualização em Tempo Real</p>
          <p className="text-xs text-[#c4c7c7]/80">Veja exatamente como o memorial público ficará.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e9c349]/40 bg-[#e9c349]/10 px-6 py-2.5 text-xs font-bold tracking-widest text-[#e9c349] transition-all hover:bg-[#e9c349] hover:text-[#101414] active:scale-95"
        >
          <span className="material-symbols-outlined text-sm font-bold">visibility</span>
          VISUALIZAR EM TELA CHEIA
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-white/5 bg-[#0a192f66] p-6 shadow-2xl md:p-8">

        {/* ── 1. Dados Fundamentais ── */}
        <section className="space-y-5">
          <h3 className="border-b border-[#e9c349]/10 pb-2 text-base font-semibold uppercase tracking-wider text-[#e9c349]">
            1. Dados Fundamentais
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Nome Completo *</label>
              <input
                type="text" name="name" required
                value={form.name} onChange={handleChange}
                placeholder="Ex: João Henrique da Silva"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Apelido (Opcional)</label>
              <input
                type="text" name="nickname"
                value={form.nickname} onChange={handleChange}
                placeholder="Ex: Vovô João"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Cidade Natal</label>
              <input
                type="text" name="city"
                value={form.city} onChange={handleChange}
                placeholder="Ex: Rio de Janeiro - RJ"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Data de Nascimento</label>
              <DatePicker
                selected={form.birthDate ? new Date(form.birthDate + "T12:00:00") : null}
                onChange={(d: Date | null) => {
                  if (d) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    setForm(prev => ({ ...prev, birthDate: `${y}-${m}-${day}` }));
                  } else {
                    setForm(prev => ({ ...prev, birthDate: "" }));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                maxDate={new Date()}
                placeholderText="dd/mm/aaaa"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Data de Falecimento</label>
              <DatePicker
                selected={form.deathDate ? new Date(form.deathDate + "T12:00:00") : null}
                onChange={(d: Date | null) => {
                  if (d) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    setForm(prev => ({ ...prev, deathDate: `${y}-${m}-${day}` }));
                  } else {
                    setForm(prev => ({ ...prev, deathDate: "" }));
                  }
                }}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                maxDate={new Date()}
                placeholderText="dd/mm/aaaa"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] focus:border-[#e9c349] focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Epitáfio *</label>
              <textarea
                name="epitaph" required
                value={form.epitaph} onChange={handleChange}
                placeholder="Uma frase que resuma a essência desta pessoa..."
                rows={2} maxLength={400}
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
              <p className="mt-1 text-right text-[10px] text-[#c4c7c7]/40">{form.epitaph.length}/400</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Biografia *</label>
              <textarea
                name="biography" required
                value={form.biography} onChange={handleChange}
                placeholder="Conte a história de vida, valores, momentos inesquecíveis..."
                rows={6} maxLength={3000}
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
              <p className="mt-1 text-right text-[10px] text-[#c4c7c7]/40">{form.biography.length}/3000</p>
            </div>
          </div>
        </section>

        {/* ── 2. Mídia ── */}
        <section className="space-y-5 border-t border-white/5 pt-6">
          <h3 className="border-b border-[#e9c349]/10 pb-2 text-base font-semibold uppercase tracking-wider text-[#e9c349]">
            2. Foto, Áudio e Vídeo
          </h3>

          <div className="grid gap-5 md:grid-cols-3">
            <MediaUploadCard
              label="Foto Principal *"
              icon="photo_camera"
              accept="image/*"
              inputId="upload-image"
              isLoading={isUploading === "imageUrl"}
              loadingLabel="Enviando..."
              uploadLabel="Selecionar Foto"
              hint="PNG, JPG ou WEBP — máx 20 MB"
              onFileChange={(e) => handleFileUpload(e, "imageUrl")}
            >
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="Foto" className="h-12 w-12 rounded-full border border-[#e9c349]/20 object-cover" />
              )}
              {form.imageUrl && <span className="text-[10px] font-semibold text-green-400">Foto enviada!</span>}
            </MediaUploadCard>

            <MediaUploadCard
              label="Áudio de Fundo (MP3)"
              icon="audiotrack"
              accept="audio/*"
              inputId="upload-audio"
              isLoading={isUploading === "audioUrl"}
              loadingLabel="Enviando..."
              uploadLabel="Selecionar Áudio"
              hint="MP3, WAV ou AAC — máx 20 MB"
              onFileChange={(e) => handleFileUpload(e, "audioUrl")}
            >
              {form.audioUrl && <span className="material-symbols-outlined text-green-400">audiotrack</span>}
              {form.audioUrl && <span className="text-[10px] font-semibold text-green-400">Áudio ativo!</span>}
            </MediaUploadCard>

            <MediaUploadCard
              label="Vídeo Tributo (MP4)"
              icon="videocam"
              accept="video/*"
              inputId="upload-video"
              isLoading={isUploading === "videoUrl"}
              loadingLabel="Enviando..."
              uploadLabel="Selecionar Vídeo"
              hint="MP4, WebM ou MOV — máx 100 MB"
              onFileChange={(e) => handleFileUpload(e, "videoUrl")}
            >
              {form.videoUrl && <span className="material-symbols-outlined text-green-400">videocam</span>}
              {form.videoUrl && <span className="text-[10px] font-semibold text-green-400">Vídeo enviado!</span>}
            </MediaUploadCard>
          </div>
        </section>

        {/* ── 3. Álbum de Fotos ── */}
        <section className="space-y-5 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between border-b border-[#e9c349]/10 pb-2">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#e9c349]">3. Álbum de Lembranças</h3>
            <span className="text-[11px] text-[#c4c7c7]/50">{form.gallery.length}/12 fotos</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#0a192f33] p-6">
            {form.gallery.length < 12 && (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 py-8 px-4 text-center transition hover:border-[#e9c349]/30">
                <span className="material-symbols-outlined mb-2 text-4xl text-[#c4c7c7]/30">collections</span>
                <p className="mb-3 text-xs text-[#c4c7c7]">Selecione várias fotos de uma vez para criar a galeria.</p>
                <span className="inline-flex items-center rounded-full border border-[#e9c349]/30 bg-[#e9c349]/10 px-6 py-2.5 text-xs font-bold tracking-widest text-[#e9c349] transition hover:bg-[#e9c349] hover:text-[#101414]">
                  {isUploadingGallery ? "Enviando..." : "Selecionar Imagens"}
                </span>
                <input
                  type="file" multiple accept="image/*"
                  disabled={isUploadingGallery}
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <span className="mt-2 text-[10px] text-[#c4c7c7]/40">PNG, JPG ou WEBP — máx 20 MB cada</span>
              </label>
            )}

            {form.gallery.length > 0 && (
              <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 ${form.gallery.length < 12 ? "mt-4" : ""}`}>
                {form.gallery.map((item, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0a192f66] shadow-lg">
                    <div className="relative aspect-square w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover grayscale-[10%] transition duration-500 group-hover:grayscale-0" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))}
                        className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-red-500/80 text-white shadow-md transition hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                      </button>
                    </div>
                    <div className="bg-[#0b0f0f]/80 p-2">
                      <input
                        type="text" value={item.title}
                        onChange={(e) => {
                          const g = [...form.gallery];
                          g[index] = { ...g[index], title: e.target.value };
                          setForm((prev) => ({ ...prev, gallery: g }));
                        }}
                        placeholder="Legenda da foto"
                        className="w-full border-b border-transparent bg-transparent py-1 px-1 text-center text-[11px] text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349]/40 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 4. Linha do Tempo ── */}
        <section className="space-y-6 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between border-b border-[#e9c349]/10 pb-2">
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#e9c349]">4. Linha do Tempo</h3>
            <button
              type="button" onClick={addTimelineEvent}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#e9c349]/20 bg-[#e9c349]/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#e9c349] transition hover:bg-[#e9c349]/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              Adicionar Capítulo
            </button>
          </div>

          <div className="space-y-6">
            {form.timelineEvents.map((event, index) => (
              <div key={index} className="relative space-y-4 rounded-xl border border-white/5 bg-[#0a192f33] p-5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e9c349]">Capítulo #{index + 1}</span>
                  {form.timelineEvents.length > 1 && (
                    <button
                      type="button" onClick={() => removeTimelineEvent(index)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-400 transition hover:bg-red-500/20"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Ano</label>
                    <input
                      type="text" value={event.year}
                      onChange={(e) => updateTimelineEvent(index, "year", e.target.value)}
                      placeholder="Ex: 1975"
                      className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Título</label>
                    <input
                      type="text" value={event.title}
                      onChange={(e) => updateTimelineEvent(index, "title", e.target.value)}
                      placeholder="Ex: Casamento com Maria"
                      className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Descrição</label>
                    <textarea
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(index, "description", e.target.value)}
                      placeholder="Descreva o que tornou este momento inesquecível..."
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Foto do Momento</label>
                    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0a192f66] p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        {event.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={event.imageUrl} alt={`Capítulo ${index + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#c4c7c7]/40">
                            <span className="material-symbols-outlined text-2xl">image</span>
                          </div>
                        )}
                        {uploadingTimelineIndex === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e9c349] border-t-transparent" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#e9c349]/20 bg-[#e9c349]/10 px-4 py-2 text-xs font-bold text-[#e9c349] transition hover:bg-[#e9c349]/20">
                          {uploadingTimelineIndex === index ? "Enviando..." : "Selecionar Foto"}
                          <input
                            type="file" accept="image/*"
                            disabled={uploadingTimelineIndex !== null}
                            onChange={(e) => handleTimelineImageUpload(e, index)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-[#c4c7c7]/40">PNG, JPG ou WEBP — máx 20 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button" onClick={addTimelineEvent}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#e9c349]/40 py-4 text-xs font-bold uppercase tracking-widest text-[#e9c349] transition hover:border-[#e9c349] hover:bg-[#e9c349]/5"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              Adicionar Capítulo à Linha do Tempo
            </button>
          </div>
        </section>

        {/* ── Endereço de Entrega ── */}
        <section className="space-y-5 border-t border-white/5 pt-6">
          <div className="flex items-center gap-3 border-b border-[#e9c349]/10 pb-2">
            <span className="material-symbols-outlined text-base text-[#e9c349]">local_shipping</span>
            <h3 className="text-base font-semibold uppercase tracking-wider text-[#e9c349]">Endereço de Entrega do QR Code</h3>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 text-xs text-amber-300">
            <span className="material-symbols-outlined shrink-0 text-base">info</span>
            <span>Preencha o endereço para onde o QR Code físico deve ser enviado. Se a funerária ou família for imprimir por conta própria, ainda assim registre o endereço para uso futuro.</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Nome do Destinatário *</label>
              <input
                type="text"
                value={deliveryAddress.recipientName}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, recipientName: e.target.value }))}
                placeholder="Quem vai receber o QR Code"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">CEP</label>
              <input
                type="text"
                maxLength={9}
                value={deliveryAddress.cep}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                  const fmt = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                  setDeliveryAddress((p) => ({ ...p, cep: fmt }));
                }}
                placeholder="00000-000"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                value={deliveryAddress.estado}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, estado: e.target.value.toUpperCase().slice(0, 2) }))}
                placeholder="SP"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Logradouro (rua, avenida…)</label>
              <input
                type="text"
                value={deliveryAddress.logradouro}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, logradouro: e.target.value }))}
                placeholder="Ex: Rua das Flores"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Número</label>
              <input
                type="text"
                value={deliveryAddress.numero}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, numero: e.target.value }))}
                placeholder="Ex: 123"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Complemento (opcional)</label>
              <input
                type="text"
                value={deliveryAddress.complemento ?? ""}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, complemento: e.target.value }))}
                placeholder="Apto, bloco…"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Bairro</label>
              <input
                type="text"
                value={deliveryAddress.bairro}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, bairro: e.target.value }))}
                placeholder="Ex: Centro"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-[#c4c7c7]/70">Cidade</label>
              <input
                type="text"
                value={deliveryAddress.cidade}
                onChange={(e) => setDeliveryAddress((p) => ({ ...p, cidade: e.target.value }))}
                placeholder="Ex: São Paulo"
                className="w-full rounded-lg border border-white/10 bg-[#0a192f66] px-4 py-2.5 text-[#e0e3e2] placeholder-white/20 focus:border-[#e9c349] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ── Submit ── */}
        <div className="border-t border-white/5 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e9c349] px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#101414] shadow-xl shadow-[#e9c349]/10 transition hover:bg-[#ffe088] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base font-bold">save</span>
            {isSubmitting ? "Salvando..." : submitLabel}
          </button>
        </div>
      </form>

      <MemorialDesktopPreview isOpen={showPreview} onClose={() => setShowPreview(false)} data={form} />
    </>
  );
}

function MediaUploadCard({
  label, icon, accept, inputId, isLoading, loadingLabel, uploadLabel, hint, onFileChange, children,
}: {
  label: string;
  icon: string;
  accept: string;
  inputId: string;
  isLoading: boolean;
  loadingLabel: string;
  uploadLabel: string;
  hint: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-white/5 bg-[#0a192f33] p-5">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c4c7c7]/70">
        <span className="material-symbols-outlined text-base text-[#e9c349]">{icon}</span>
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={`cursor-pointer rounded-full border border-[#e9c349]/30 bg-[#e9c349]/10 px-5 py-2 text-xs font-bold tracking-wider text-[#e9c349] transition hover:bg-[#e9c349] hover:text-[#101414] ${isLoading ? "pointer-events-none opacity-60" : ""}`}
        >
          {isLoading ? loadingLabel : uploadLabel}
          <input type="file" accept={accept} id={inputId} disabled={isLoading} onChange={onFileChange} className="hidden" />
        </label>
        {children}
      </div>
      <p className="text-[10px] text-[#c4c7c7]/40">{hint}</p>
    </div>
  );
}
