import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { text: string; color: string }> = {
  ativo: { text: "Publicado", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: { text: "Aguardando pagamento", color: "text-[#e9c349] bg-[#e9c349]/10 border-[#e9c349]/20" },
  rascunho: { text: "Rascunho", color: "text-outline bg-outline/10 border-outline/20" },
};

async function generateQr(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: "#0b0f0f", light: "#ffffff" },
  });
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.needsPassword) redirect("/definir-senha");

  const data = await readPlatformData();
  const memorials = data.memorials.filter(
    (m) => m.id !== "default" && (session.isAdmin || m.ownerId.toLowerCase().trim() === session.email)
  );

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001";

  // Gera QR code para cada memorial ativo
  const qrMap: Record<string, string> = {};
  await Promise.all(
    memorials
      .filter((m) => m.status === "ativo")
      .map(async (m) => {
        const fullUrl = `${baseUrl}/memorial-publico?memorial=${m.id}`;
        qrMap[m.id] = await generateQr(fullUrl);
      })
  );

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-h2 text-[clamp(1.75rem,3.5vw,2.25rem)] tracking-[-0.01em]">
            Meus Memoriais
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {memorials.length === 0
              ? "Você ainda não criou nenhum memorial."
              : `${memorials.length} memorial${memorials.length !== 1 ? "is" : ""} cadastrado${memorials.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
        <Link
          href="/memoriais/criar"
          className="inline-flex items-center gap-2 rounded-full bg-tertiary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-tertiary/80"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Criar memorial
        </Link>
      </div>

      {memorials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-tertiary/30 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10">
            <span className="material-symbols-outlined text-[2rem] text-tertiary">auto_stories</span>
          </div>
          <h3 className="mb-2 font-h3 text-xl text-on-surface">Nenhum memorial ainda</h3>
          <p className="mb-6 max-w-sm text-sm text-on-surface-variant">
            Crie seu primeiro memorial digital e preserve as memórias de quem você ama.
          </p>
          <Link
            href="/memoriais/criar"
            className="rounded-full bg-tertiary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-tertiary/80"
          >
            Criar primeiro memorial
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {memorials.map((memorial) => {
            const status = statusLabel[memorial.status] ?? statusLabel.rascunho;
            const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : null;
            const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : null;
            const years = birthYear || deathYear ? `${birthYear ?? "?"} – ${deathYear ?? "?"}` : null;
            const publicUrl = `/memorial-publico?memorial=${memorial.id}`;
            const qrDataUrl = qrMap[memorial.id];

            return (
              <article
                key={memorial.id}
                className="flex flex-col overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f] transition duration-300 hover:-translate-y-0.5 hover:border-tertiary/20"
              >
                {/* Foto */}
                <div className="relative h-44 shrink-0">
                  <Image
                    src={memorial.imageUrl || "/images/hero-bg.png"}
                    alt={memorial.name}
                    fill
                    className="object-cover grayscale-[20%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-semibold text-white line-clamp-1">{memorial.name}</h3>
                    {years && <p className="text-xs text-white/60">{years}</p>}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <span className={`self-start rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${status.color}`}>
                    {status.text}
                  </span>

                  {/* QR Code — só para memoriais ativos */}
                  {qrDataUrl && (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-tertiary/10 bg-[#060e1a] p-4">
                      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-outline">QR Code do memorial</p>
                      <div className="rounded-lg bg-white p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrDataUrl} alt={`QR Code — ${memorial.name}`} width={160} height={160} />
                      </div>
                      <a
                        href={qrDataUrl}
                        download={`qrcode-${memorial.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                        className="flex items-center gap-1.5 text-xs text-tertiary transition hover:text-tertiary/70"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Baixar QR Code
                      </a>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="mt-auto flex gap-2">
                    {memorial.status === "ativo" ? (
                      <Link
                        href={publicUrl}
                        target="_blank"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-tertiary/30 py-2 text-xs font-medium text-tertiary transition hover:bg-tertiary/5"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Ver memorial
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?memorialId=${memorial.id}&payerType=family`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-tertiary py-2 text-xs font-semibold uppercase tracking-wider text-[#101414] transition hover:bg-tertiary/80"
                      >
                        <span className="material-symbols-outlined text-sm">payment</span>
                        Pagar para publicar
                      </Link>
                    )}

                    <Link
                      href={`/memoriais/criar?edit=${memorial.id}`}
                      title="Editar memorial"
                      className="flex items-center justify-center rounded-lg border border-outline-variant/30 px-3 py-2 text-outline transition hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          <Link
            href="/memoriais/criar"
            className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-tertiary/20 transition hover:bg-tertiary/5"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tertiary/10">
              <span className="material-symbols-outlined text-xl text-tertiary">add</span>
            </div>
            <p className="text-sm text-on-surface-variant">Criar novo memorial</p>
          </Link>
        </div>
      )}
    </div>
  );
}
