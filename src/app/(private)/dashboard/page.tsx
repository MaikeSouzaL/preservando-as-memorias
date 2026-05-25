import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export default async function DashboardPage() {
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
  const qrCodes = data.qrCodes.filter((qr) => memorialIds.has(qr.memorialId));

  const totalMemorials = memorials.length;
  const totalTributes = tributes.length;
  const totalVisits = memorials.reduce((acc, m) => acc + (m.visits ?? 0), 0);
  const activeQRCodes = qrCodes.filter((qr) => qr.status === "ativo").length;

  const recentTributes = tributes.map((t) => ({
    id: t.id,
    when: new Date(t.createdAt).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
    text: `Homenagem de ${t.author}: "${t.message.slice(0, 48)}..."`,
    icon: "volunteer_activism" as const,
    timestamp: new Date(t.createdAt).getTime(),
  }));

  const recentCandles = candles.map((c) => ({
    id: c.id,
    when: new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
    text: `${c.name} acendeu uma vela ${c.isEternal ? "eterna" : "simples"}.`,
    icon: "local_fire_department" as const,
    timestamp: new Date(c.createdAt).getTime(),
  }));

  const recentActivities = [...recentTributes, ...recentCandles]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const featuredMemorial = memorials[0];
  const featuredQrCode = featuredMemorial
    ? qrCodes.find((qr) => qr.memorialId === featuredMemorial.id)
    : null;

  return (
    <>
      <div className="mb-16">
        <h2 className="font-h2 text-[clamp(2rem,4vw,2.5rem)] leading-[1.2] tracking-[-0.01em]">
          Visão Geral
        </h2>
        <p className="text-[1.125rem] text-on-surface-variant">
          Acompanhe a preservação das suas memórias queridas.
        </p>
      </div>

      <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total de memoriais", value: totalMemorials, icon: "auto_stories" },
          { label: "Total de homenagens", value: totalTributes, icon: "volunteer_activism" },
          { label: "Visitas recebidas", value: totalVisits, icon: "visibility" },
          { label: "QR Codes ativos", value: activeQRCodes, icon: "qr_code_2" },
        ].map((item) => (
          <article
            key={item.label}
            className="group flex h-40 flex-col justify-between rounded-xl border border-tertiary/10 bg-[#0a192f] p-6 backdrop-blur-md transition duration-500 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <span className="text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">
                {item.label}
              </span>
              <span className="material-symbols-outlined text-tertiary/70 group-hover:text-tertiary">
                {item.icon}
              </span>
            </div>
            <div className="font-h1 text-[3rem] leading-[1.1] tracking-[-0.02em]">{item.value}</div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-8 flex items-end justify-between">
            <h3 className="font-h3 text-[1.75rem]">Memoriais Recentes</h3>
            <Link href="/memoriais/lista" className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {memorials.slice(0, 2).map((memorial) => {
              const years = memorial.birthDate || memorial.deathDate
                ? `${memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : "?"} - ${memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : "?"}`
                : "Sem datas";

              const mStats = {
                tributes: tributes.filter((t) => t.memorialId === memorial.id).length,
                candles: candles.filter((c) => c.memorialId === memorial.id).length,
              };

              return (
                <article
                  key={memorial.id}
                  className="overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f] transition duration-500 hover:scale-[1.02]"
                >
                  <div className="relative h-64">
                    <Image
                      src={memorial.imageUrl || "/images/hero-bg.png"}
                      alt={memorial.name}
                      fill
                      className="object-cover grayscale-[30%] transition duration-700 hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,18,18,0.9)_0%,rgba(18,18,18,0.2)_50%,transparent_100%)]" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <h4 className="font-h2 text-[2rem] leading-[1.2]">{memorial.name}</h4>
                      <p className="text-on-surface-variant">{years}</p>
                      <p className="italic text-tertiary/90 text-sm line-clamp-1">{`"${memorial.epitaph}"`}</p>
                    </div>
                  </div>
                  <div className="bg-[#0a192f80] p-6">
                    <div className="mb-6 flex items-center justify-between border-b border-tertiary/10 pb-4 text-on-surface-variant">
                      <Stat icon="visibility" value={memorial.visits} label="visitas" />
                      <Stat icon="volunteer_activism" value={mStats.tributes} label="homenagens" />
                      <Stat icon="local_fire_department" value={mStats.candles} label="velas" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/memorial?memorial=${memorial.id}`}
                        target="_blank"
                        className="rounded-full border border-tertiary/50 px-4 py-2 text-sm text-tertiary transition hover:bg-tertiary/5"
                      >
                        Abrir memorial
                      </Link>
                      <div className="flex gap-2">
                        <Link href={`/memoriais/criar?edit=${memorial.id}`} className="p-2 text-on-surface-variant transition hover:text-tertiary">
                          <span className="material-symbols-outlined text-[1.2rem]">edit</span>
                        </Link>
                        {featuredQrCode && (
                          <a
                            href={`/memorial?memorial=${memorial.id}`}
                            target="_blank"
                            className="p-2 text-on-surface-variant transition hover:text-tertiary"
                          >
                            <span className="material-symbols-outlined text-[1.2rem]">qr_code_2</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            <Link
              href="/memoriais/criar"
              className="flex h-[28rem] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-tertiary/30 transition hover:bg-tertiary/5"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10">
                <span className="material-symbols-outlined text-[2.5rem] text-tertiary">add</span>
              </div>
              <h4 className="mb-2 font-h3 text-[1.75rem] text-on-surface">Criar novo memorial</h4>
              <p className="px-8 text-center text-on-surface-variant">
                Inicie a preservação de uma nova história de vida.
              </p>
            </Link>
          </div>
        </section>

        <aside className="space-y-12">
          <section className="rounded-xl border border-tertiary/10 bg-[#0a192f] p-8">
            <h3 className="mb-8 font-h3 text-[1.75rem]">Atividades Recentes</h3>
            <div className="ml-3 space-y-8 border-l border-tertiary/20">
              {recentActivities.map((activity) => (
                <TimelineItem
                  key={activity.id}
                  when={activity.when}
                  text={activity.text}
                  dot={activity.icon}
                />
              ))}
              {recentActivities.length === 0 && (
                <p className="text-on-surface-variant text-sm py-4 italic text-center">Nenhuma interação recente registrada.</p>
              )}
            </div>
          </section>

          {featuredMemorial && (
            <section className="rounded-xl border border-tertiary/10 bg-[#0a192f] p-8 text-center">
              <h3 className="font-h3 text-[1.75rem]">QR Code Destacado</h3>
              <p className="mb-6 text-on-surface-variant">Acesso rápido ao memorial mais recente</p>
              <div className="mb-6 flex justify-center rounded-lg bg-white p-4 shadow-[0_0_30px_rgba(233,195,73,0.1)]">
                {/* QR Code SVG / Icon representativo */}
                <span className="material-symbols-outlined text-[120px] text-black">qr_code_2</span>
              </div>
              <h4 className="mb-4 font-h3 text-[1.2rem] text-on-surface">{featuredMemorial.name}</h4>
              <a
                href={`/memorial?memorial=${featuredMemorial.id}`}
                target="_blank"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-tertiary/50 py-3 text-tertiary transition hover:bg-tertiary/5"
              >
                <span className="material-symbols-outlined">visibility</span>
                <span>Visualizar Memorial</span>
              </a>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5" title={`${value} ${label}`}>
      <span className="material-symbols-outlined text-[1.1rem] text-tertiary/80">{icon}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function TimelineItem({
  when,
  text,
  dot,
}: {
  when: string;
  text: string;
  dot: "volunteer_activism" | "local_fire_department";
}) {
  return (
    <div className="relative pl-8">
      <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-tertiary/50 bg-[#0a192f]">
        <span className="material-symbols-outlined text-[12px] text-tertiary">{dot}</span>
      </div>
      <p className="mb-1 text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">{when}</p>
      <p className="text-sm text-on-surface/90">{text}</p>
    </div>
  );
}
