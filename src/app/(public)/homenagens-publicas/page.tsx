import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function HomenagensPublicasPage() {
  const data = await readPlatformData();
  const activeMemorials = data.memorials.filter((item) => item.status === "ativo");
  const tributeFeed = data.tributes
    .filter((item) => item.status === "aprovada")
    .map((item) => ({
      ...item,
      memorialName: data.memorials.find((memorial) => memorial.id === item.memorialId)?.name ?? "Memorial",
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Comunidade
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
          Homenagens Públicas
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">
          Mensagens de carinho deixadas por visitantes que ajudam a manter viva cada memória.
        </p>
      </header>

      <section className="mb-8 grid gap-4 rounded-xl border border-tertiary/10 bg-surface-container/70 p-5 md:grid-cols-3">
        <Metric label="Mensagens exibidas" value={tributeFeed.length.toString()} />
        <Metric label="Memoriais ativos" value={activeMemorials.length.toString()} />
        <Metric label="Velas acesas" value={data.candles.length.toString()} />
      </section>

      {tributeFeed.length === 0 ? (
        <section className="rounded-xl border border-dashed border-tertiary/25 bg-surface-container/40 p-10 text-center">
          <h2 className="font-h3 text-2xl text-on-surface">Nenhuma homenagem pública ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-on-surface-variant">
            As mensagens aprovadas enviadas nos memoriais aparecerão aqui automaticamente.
          </p>
          <Link href="/descobrir-memoriais" className="mt-6 inline-flex rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
            Descobrir memoriais
          </Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {tributeFeed.map((item) => (
            <article key={item.id} className="rounded-xl border border-outline-variant/30 bg-surface-container-low/70 p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-h3 text-[1.2rem] text-on-surface">{item.memorialName}</p>
                <span className="rounded-full border border-tertiary/35 px-3 py-1 text-xs uppercase tracking-[0.12em] text-tertiary">
                  Publicado
                </span>
              </div>
              <p className="text-on-surface">{item.message}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
                <span>{item.author}</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/descobrir-memoriais" className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Descobrir memoriais
        </Link>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-tertiary/10 bg-surface-container-high/40 p-4">
      <p className="text-[0.75rem] uppercase tracking-[0.14em] text-on-surface-variant">{label}</p>
      <p className="mt-2 font-h3 text-[1.8rem] text-tertiary">{value}</p>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
