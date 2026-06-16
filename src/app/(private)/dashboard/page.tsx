import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";
import { generateHeartQr } from "@/src/lib/qr-heart";
import { MemorialCard } from "@/src/components/private/memorial-card";

export const dynamic = "force-dynamic";

/** Format an ISO date string as "DD/MM/AAAA" (Brazilian style). */
function fmtDate(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  return [
    String(d.getUTCDate()).padStart(2, "0"),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCFullYear()),
  ].join("/");
}

/**
 * Shorten a full name to fit inside the heart bump (~13 chars max).
 * Strategy: first name + second name; if still too long, first name only.
 */
function shortName(full: string, max = 13): string {
  const trimmed = full.trim();
  if (trimmed.length <= max) return trimmed;
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    const two = `${parts[0]} ${parts[1]}`;
    if (two.length <= max) return two;
  }
  return parts[0].length <= max ? parts[0] : parts[0].slice(0, max - 1) + "…";
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.needsPassword) redirect("/definir-senha?source=memorial");

  const data = await readPlatformData();
  const memorials = data.memorials.filter(
    (m) => m.id !== "default" && (session.isAdmin || session.isDevAdmin || m.ownerId === session.userId || m.ownerId.toLowerCase().trim() === session.email)
  );

  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001")
    .replace("://preservandomemorias.com.br", "://www.preservandomemorias.com.br");

  const qrMap: Record<string, { dark: string; light: string }> = {};
  for (const m of memorials.filter((m) => m.status === "ativo")) {
    const birth = fmtDate(m.birthDate);
    const death = fmtDate(m.deathDate);
    const qrUrl = `${baseUrl}/memorial-publico?memorial=${m.id}`;
    const overlayBase = {
      leftLine1: shortName(m.name),
      leftLine2: birth ? `✦ ${birth}` : undefined,
      rightLine1: "✝",
      rightLine2: death,
    };
    qrMap[m.id] = {
      dark: generateHeartQr(qrUrl, {
        dark: "#0b0f0f",
        light: "#ffffff",
        overlay: { ...overlayBase, color: "#1c1b1b" },
        bottomUrl: "www.preservandomemorias.com.br",
        bgColor: "#0b1120",
        urlColor: "#e9c349",
      }),
      light: generateHeartQr(qrUrl, {
        dark: "#000000",
        light: "#e9c349",
        overlay: { ...overlayBase, color: "#1c1b1b" },
        bottomUrl: "www.preservandomemorias.com.br",
        bgColor: "#f9f6ef",
        urlColor: "#1c1b1b",
      }),
    };
  }

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
                qrDataUrlDark={qrMap[memorial.id]?.dark ?? null}
                qrDataUrlLight={qrMap[memorial.id]?.light ?? null}
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
