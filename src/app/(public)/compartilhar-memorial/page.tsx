"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MemorialSummary = {
  id: string;
  name: string;
  status: "ativo" | "rascunho";
};

export default function CompartilharMemorialPage() {
  const [memorial, setMemorial] = useState<MemorialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMemorialId = params.get("memorial");

    fetch("/api/memorials")
      .then((response) => response.json())
      .then((payload) => {
        const memorials = Array.isArray(payload.memorials) ? (payload.memorials as MemorialSummary[]) : [];
        const selected =
          memorials.find((item) => item.id === requestedMemorialId) ??
          memorials.find((item) => item.status === "ativo") ??
          null;

        setMemorial(selected);
      })
      .catch(() => setMemorial(null))
      .finally(() => setIsLoading(false));
  }, []);

  const link = useMemo(() => {
    if (!memorial || typeof window === "undefined") return "";
    return `${window.location.origin}/memorial-publico?memorial=${memorial.id}`;
  }, [memorial]);

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-gutter py-12">
        <p className="text-on-surface-variant">Carregando memorial...</p>
      </main>
    );
  }

  if (!memorial) {
    return (
      <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-gutter py-12">
        <header className="mb-8">
          <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
            Compartilhamento
          </p>
          <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
            Nenhum memorial disponível
          </h1>
          <p className="mt-3 text-on-surface-variant">
            Crie um memorial para gerar um link público de compartilhamento.
          </p>
        </header>
        <Link href="/memoriais/criar" className="w-fit rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
          Criar memorial
        </Link>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Veja o memorial de ${memorial.name}: ${link}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Memorial de ${memorial.name}`)}&body=${encodeURIComponent(link)}`;

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-gutter py-12">
      <header className="mb-8">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Compartilhamento
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
          Compartilhar Memorial
        </h1>
        <p className="mt-3 text-on-surface-variant">
          Compartilhe o memorial de {memorial.name} com familiares e amigos.
        </p>
      </header>

      <section className="rounded-xl border border-tertiary/10 bg-surface-container/70 p-6">
        <label className="mb-2 block text-sm text-on-surface-variant">Link público</label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-low/70 px-4 py-3 text-on-surface"
          />
          <button
            onClick={copyLink}
            className="rounded-full border border-tertiary/50 px-5 py-3 text-sm text-tertiary transition hover:bg-tertiary/10"
          >
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { label: "WhatsApp", icon: "chat", href: whatsappUrl },
            { label: "Facebook", icon: "thumb_up", href: facebookUrl },
            { label: "Email", icon: "mail", href: emailUrl },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === "Email" ? undefined : "_blank"}
              rel={item.label === "Email" ? undefined : "noreferrer"}
              className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low/50 px-4 py-3 text-on-surface-variant transition hover:border-tertiary/40 hover:text-tertiary"
            >
              <span className="material-symbols-outlined text-[1.1rem]">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/qr-publico?memorial=${memorial.id}`} className="rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
          Ver QR público
        </Link>
        <Link href={`/memorial-publico?memorial=${memorial.id}`} className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Voltar ao memorial
        </Link>
      </div>
    </main>
  );
}
