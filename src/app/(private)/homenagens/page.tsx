import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function HomenagensPage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  const data = await readPlatformData();
  const memorials = data.memorials.filter(
    (m) => m.id !== "default" && (session.isAdmin || m.ownerId.toLowerCase().trim() === session.email)
  );
  const memorialIds = new Set(memorials.map((m) => m.id));
  const tributes = data.tributes.filter((t) => memorialIds.has(t.memorialId));
  const candles = data.candles.filter((c) => memorialIds.has(c.memorialId));

  const totalTributes = tributes.length;
  const totalCandles = candles.length;
  const featuredTribute = tributes[0];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-tertiary/5 blur-[100px]" />

      <header className="relative mb-16">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Homenagens
        </p>
        <h1 className="mb-4 font-h1 text-[clamp(2.3rem,5vw,4rem)] font-light leading-[1.1] tracking-[-0.02em] text-on-surface">
          Mensagens Eternizadas
        </h1>
        <p className="max-w-2xl text-body-lg text-on-surface-variant">
          Palavras permanecem vivas para sempre quando carregam sentimentos verdadeiros.
        </p>
      </header>

      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="space-y-10 lg:col-span-8">
          {featuredTribute ? (
            <article className="group relative overflow-hidden rounded-xl border border-tertiary/10 bg-[var(--pm-card-bg)] p-8 backdrop-blur-[20px]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute left-0 top-0 h-full w-1 bg-tertiary/50" />

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-outline/30 bg-tertiary/10 text-tertiary font-bold text-lg">
                  {featuredTribute.author[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg text-on-surface">{featuredTribute.author}</h3>
                  <p className="text-sm text-tertiary">
                    {featuredTribute.tag || "🕊️ Homenagem"} - {new Date(featuredTribute.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <p className="mb-8 text-body-lg italic leading-relaxed text-on-surface/90">
                &quot;{featuredTribute.message}&quot;
              </p>

              <div className="flex items-center gap-6 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-tertiary">favorite</span>
                  <span className="text-sm">Homenagem Destacada</span>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-16 bg-[var(--pm-card-bg-light)] rounded-xl border border-tertiary/10">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4">favorite_border</span>
              <p className="text-on-surface-variant text-lg">Nenhuma homenagem cadastrada ainda.</p>
            </div>
          )}

          {tributes.length > 1 && (
            <div className="space-y-6">
              <h3 className="font-h3 text-xl mb-4 text-on-surface">Outras Homenagens</h3>
              {tributes.slice(1).map((tribute) => (
                <article
                  key={tribute.id}
                  className="rounded-lg border border-tertiary/10 bg-[var(--pm-card-bg)] p-6 backdrop-blur-[20px] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-outline/20 bg-surface-container-highest text-tertiary font-bold">
                      {tribute.author[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-on-surface">{tribute.author}</h4>
                      <p className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">
                        {tribute.tag || "🕊️ Lembrança"} - {new Date(tribute.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <p className="text-on-surface/80 leading-relaxed italic">&quot;{tribute.message}&quot;</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-8 lg:col-span-4">
          <div className="rounded-xl border border-tertiary/10 bg-[var(--pm-card-bg)] p-6 backdrop-blur-[20px]">
            <h3 className="mb-6 border-b border-tertiary/10 pb-4 text-xl text-on-surface">Métricas de Afeto</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Total de Homenagens</span>
                <span className="font-h3 text-2xl text-tertiary">{totalTributes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Velas Acesas (Visitas)</span>
                <span className="font-h3 text-2xl text-on-surface">{totalCandles}</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-tertiary/10 bg-[var(--pm-card-bg)] p-6 text-center backdrop-blur-[20px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tertiary/10 to-transparent" />
            <span className="material-symbols-outlined relative z-10 mb-2 text-4xl text-tertiary">local_fire_department</span>
            <h3 className="relative z-10 mb-2 text-xl text-on-surface">Velas Acesas</h3>
            <p className="relative z-10 mb-4 text-on-surface-variant">A luz da saudade que permanece brilhando.</p>
            <div className="relative z-10 mb-6 font-h1 text-4xl text-tertiary">{totalCandles}</div>
            <Link
              href="/memoriais/lista"
              className="relative z-10 block w-full rounded-lg border border-tertiary/30 py-2.5 text-on-surface transition-colors hover:bg-tertiary/10 hover:text-tertiary font-semibold text-sm text-center"
            >
              Gerenciar Memoriais
            </Link>
          </div>

          {memorials[0] && (
            <div className="h-64 overflow-hidden rounded-xl border border-outline/10 relative">
              <Image
                src={memorials[0].imageUrl || "/images/hero-bg.png"}
                alt="Paisagem memorial"
                fill
                className="object-cover opacity-60 transition-opacity duration-500 hover:opacity-80"
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

