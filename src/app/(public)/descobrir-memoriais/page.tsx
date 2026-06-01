import Image from "next/image";
import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function getYears(birthDate?: string, deathDate?: string) {
  if (!birthDate && !deathDate) return "Datas não informadas";

  return `${birthDate ? new Date(birthDate).getFullYear() : "?"} - ${deathDate ? new Date(deathDate).getFullYear() : "?"}`;
}

export default async function DescobrirMemoriaisPage() {
  const data = await readPlatformData();
  const memorials = data.memorials
    .filter((item) => item.status === "ativo")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-gutter py-12">
      <header className="mb-8">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Descoberta
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
          Descobrir Memoriais
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">
          Explore histórias públicas preservadas por famílias que desejam manter seus legados vivos.
        </p>
      </header>

      <section className="mb-8 grid gap-4 rounded-xl border border-tertiary/10 bg-surface-container/70 p-5 md:grid-cols-3">
        <Metric label="Memoriais públicos" value={memorials.length.toString()} />
        <Metric label="Visitas registradas" value={memorials.reduce((total, item) => total + item.visits, 0).toString()} />
        <Metric label="Homenagens" value={data.tributes.filter((item) => item.status === "aprovada").length.toString()} />
      </section>

      {memorials.length === 0 ? (
        <section className="rounded-xl border border-dashed border-tertiary/25 bg-surface-container/40 p-10 text-center">
          <h2 className="font-h3 text-2xl text-on-surface">Nenhum memorial público ainda</h2>
          <p className="mx-auto mt-3 max-w-xl text-on-surface-variant">
            Assim que um cliente criar um memorial ativo, ele aparecerá aqui e poderá ser acessado pelo QR Code.
          </p>
          <Link href="/planos" className="mt-6 inline-flex rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
            Ver planos
          </Link>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memorials.map((memorial) => {
            const publicPath = `/memorial-publico?memorial=${memorial.id}`;
            const tributeCount = data.tributes.filter((tribute) => tribute.memorialId === memorial.id && tribute.status === "aprovada").length;

            return (
              <article key={memorial.id} className="overflow-hidden rounded-xl border border-tertiary/10 bg-surface-container-low/60">
                <div className="relative h-52">
                  <Image src={memorial.imageUrl || "/images/hero-bg.png"} alt={memorial.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,15,15,0.9)_8%,rgba(11,15,15,0.15)_58%,transparent_100%)]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-h3 text-[1.3rem] text-on-surface">{memorial.name}</h2>
                    <p className="text-sm text-on-surface-variant">{getYears(memorial.birthDate, memorial.deathDate)}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-on-surface-variant">{memorial.epitaph}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
                    <span>{memorial.visits} visitas</span>
                    <span>{tributeCount} homenagens</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={publicPath} className="flex-1 rounded-full border border-tertiary/50 px-4 py-2 text-center text-sm text-tertiary transition hover:bg-tertiary/10">
                      Ver memorial
                    </Link>
                    <Link href={`/qr-publico?memorial=${memorial.id}`} className="rounded-full border border-outline-variant/60 px-4 py-2 text-sm text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
                      QR
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
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
