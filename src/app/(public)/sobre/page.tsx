import Link from "next/link";
import { publicContent } from "@/src/mock-db/public-content";

export default function SobrePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Sobre a plataforma
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Tecnologia a servico da memoria afetiva
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">{publicContent.about.story}</p>
      </header>

      <section className="mb-8 rounded-xl border border-tertiary/10 bg-surface-container/70 p-6">
        <h2 className="mb-3 font-h3 text-[1.5rem]">Nossa missao</h2>
        <p className="leading-8 text-on-surface-variant">{publicContent.about.mission}</p>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {publicContent.about.values.map((value) => (
          <article key={value} className="rounded-xl border border-outline-variant/30 bg-surface-container-low/70 p-5">
            <div className="mb-2 flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined">favorite</span>
              <h3 className="font-h3 text-[1.2rem]">{value}</h3>
            </div>
            <p className="text-on-surface-variant">
              Este principio orienta a experiencia de cada tela, mensagem e interacao da plataforma.
            </p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/planos" className="rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
          Ver planos
        </Link>
        <Link href="/contato" className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Falar com suporte
        </Link>
      </div>
    </main>
  );
}
