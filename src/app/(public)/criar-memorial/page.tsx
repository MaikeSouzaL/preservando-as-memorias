"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
};

const empty: FormData = {
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
};

export default function CriarMemorialPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const payload = await res.json();
      if (res.ok && payload.url) {
        set("imageUrl", payload.url);
      } else {
        setError("Não foi possível enviar a foto.");
      }
    } finally {
      setUploading(false);
    }
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
        {/* Header */}
        <div className="mb-10 text-center">
          <a href="/landing" className="mb-8 inline-flex items-center gap-2 text-sm text-[#c4c7c7]/60 transition hover:text-[#e9c349]">
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
          {/* Foto */}
          <section className="flex flex-col items-center gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#e9c349]/30 bg-[#0a192f]/60 transition hover:border-[#e9c349]/60"
            >
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt="Foto" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-center">
                  {uploading ? (
                    <span className="material-symbols-outlined animate-spin text-2xl text-[#e9c349]/60">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-3xl text-[#e9c349]/40">add_a_photo</span>
                      <span className="text-xs text-[#c4c7c7]/50">Adicionar foto</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            {form.imageUrl && (
              <button type="button" onClick={() => set("imageUrl", "")} className="text-xs text-[#c4c7c7]/50 transition hover:text-red-400">
                Remover foto
              </button>
            )}
          </section>

          {/* Dados do falecido */}
          <section className="rounded-2xl border border-white/5 bg-[#0a192f]/50 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#e9c349]">
              Dados do falecido
            </h2>
            <div className="grid gap-4">
              <Field label="Nome completo *" value={form.name} onChange={(v) => set("name", v)} placeholder="Ex: Maria da Silva" />
              <Field label="Apelido / como era chamado" value={form.nickname} onChange={(v) => set("nickname", v)} placeholder="Opcional" />
              <div className="grid gap-4 sm:grid-cols-2">
                <DateField label="Data de nascimento" value={form.birthDate} onChange={(v) => set("birthDate", v)} />
                <DateField label="Data de falecimento" value={form.deathDate} onChange={(v) => set("deathDate", v)} />
              </div>
              <Field label="Cidade" value={form.city} onChange={(v) => set("city", v)} placeholder="Ex: São Paulo, SP" />
              <Field
                label="Frase / epitáfio"
                value={form.epitaph}
                onChange={(v) => set("epitaph", v)}
                placeholder="Uma frase que o representa..."
              />
              <TextArea
                label="Biografia"
                value={form.biography}
                onChange={(v) => set("biography", v)}
                placeholder="Conte a história de vida, feitos, personalidade, o que será lembrado..."
              />
            </div>
          </section>

          {/* Dados da família */}
          <section className="rounded-2xl border border-white/5 bg-[#0a192f]/50 p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#e9c349]">
              Seus dados
            </h2>
            <div className="grid gap-4">
              <Field label="Seu nome *" value={form.familyName} onChange={(v) => set("familyName", v)} placeholder="Seu nome completo" />
              <Field
                label="Seu e-mail *"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="Você receberá o acesso ao memorial aqui"
              />
            </div>
          </section>

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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-[#c4c7c7]/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="rounded-lg border border-white/10 bg-[#0b0f0f]/60 px-3 py-2.5 text-sm text-[#e0e3e2] placeholder-white/20 outline-none transition focus:border-[#e9c349]/40 resize-y"
      />
    </label>
  );
}
