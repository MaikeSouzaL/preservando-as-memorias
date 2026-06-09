import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";
import { MemorialCard } from "@/src/components/private/memorial-card";

export const dynamic = "force-dynamic";

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
  if (session.needsPassword) redirect("/definir-senha?source=memorial");

  const data = await readPlatformData();
  const memorials = data.memorials.filter(
    (m) => m.id !== "default" && (session.isAdmin || m.ownerId.toLowerCase().trim() === session.email)
  );

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001";

  const qrMap: Record<string, string> = {};
  await Promise.all(
    memorials
      .filter((m) => m.status === "ativo")
      .map(async (m) => {
        qrMap[m.id] = await generateQr(`${baseUrl}/memorial-publico?memorial=${m.id}`);
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
          href="/criar-memorial"
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
            href="/criar-memorial"
            className="rounded-full bg-tertiary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#101414] transition hover:bg-tertiary/80"
          >
            Criar primeiro memorial
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {memorials.map((memorial) => {
            const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : null;
            const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : null;
            const years = birthYear || deathYear ? `${birthYear ?? "?"} – ${deathYear ?? "?"}` : null;

            return (
              <MemorialCard
                key={memorial.id}
                id={memorial.id}
                name={memorial.name}
                years={years}
                imageUrl={memorial.imageUrl || "/images/hero-bg.png"}
                status={memorial.status as "ativo" | "pending_payment" | "rascunho"}
                publicUrl={`/memorial-publico?memorial=${memorial.id}`}
                editUrl={`/memoriais/criar?edit=${memorial.id}`}
                qrDataUrl={qrMap[memorial.id] ?? null}
              />
            );
          })}

          <Link
            href="/criar-memorial"
            className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-tertiary/20 transition hover:bg-tertiary/5"
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
