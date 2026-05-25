"use client";

import { useState } from "react";
import Link from "next/link";
import { publicContent } from "@/src/mock-db/public-content";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          FAQ
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Perguntas frequentes
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
          Respostas rapidas para as duvidas mais comuns sobre memorial, QR Code e homenagens.
        </p>
      </header>

      <section className="grid gap-3">
        {publicContent.faq.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.question} className="rounded-xl border border-outline-variant/35 bg-surface-container/70 p-5">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <h2 className="font-h3 text-[1.25rem] text-on-surface">{item.question}</h2>
                <span className="material-symbols-outlined text-tertiary">{isOpen ? "remove" : "add"}</span>
              </button>
              {isOpen ? <p className="mt-3 text-on-surface-variant">{item.answer}</p> : null}
            </article>
          );
        })}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/contato" className="rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
          Ainda com duvidas? Falar com suporte
        </Link>
        <Link href="/sobre" className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Conhecer a plataforma
        </Link>
      </div>
    </main>
  );
}
