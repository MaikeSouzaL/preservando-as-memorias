import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";
import { generateHeartQr } from "@/src/lib/qr-heart";

export const dynamic = "force-dynamic";

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

type QrPublicoPageProps = {
  searchParams: Promise<{
    memorial?: string;
  }>;
};

export default async function QrPublicoPage({ searchParams }: QrPublicoPageProps) {
  const { memorial: requestedMemorialId } = await searchParams;
  const data = await readPlatformData();
  const memorial =
    data.memorials.find((item) => item.id === requestedMemorialId) ??
    data.memorials.find((item) => item.status === "ativo") ??
    null;

  if (!memorial) {
    return (
      <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col items-center px-gutter py-12 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          QR Público
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
          Nenhum memorial disponível
        </h1>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Crie um memorial para gerar o QR Code público correspondente.
        </p>
        <Link href="/memoriais/criar" className="mt-8 rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10">
          Criar memorial
        </Link>
      </main>
    );
  }

  const publicPath = `/memorial-publico?memorial=${memorial.id}`;
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "";
  const birth = fmtDate(memorial.birthDate);
  const death = fmtDate(memorial.deathDate);
  const qrUrl = generateHeartQr(`${baseUrl}${publicPath}`, {
    moduleSize: 9,
    overlay: {
      leftLine1: shortName(memorial.name),
      leftLine2: birth ? `✦ ${birth}` : undefined,
      rightLine1: "✝",
      rightLine2: death,
      color: "#e9c349",
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-1 flex-col items-center px-gutter py-12 text-center">
      <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
        QR Público
      </p>
      <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em]">
        Acesso rápido ao memorial
      </h1>
      <p className="mt-3 max-w-2xl text-on-surface-variant">
        Escaneie o QR Code para abrir o memorial de {memorial.name} no celular.
      </p>

      <section className="mt-8 w-full max-w-md rounded-2xl border border-tertiary/15 bg-surface-container/80 p-6">
        {/* Heart-shaped QR code — SVG data URL, no external request */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR Code de ${memorial.name}`}
          width={360}
          height={390}
          className="mx-auto h-auto w-full max-w-[300px] drop-shadow-[0_4px_32px_rgba(233,195,73,0.12)]"
        />
        <p className="mt-4 break-all text-sm text-on-surface-variant">{publicPath}</p>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={qrUrl}
          download={`qrcode-${memorial.name.toLowerCase().replace(/\s+/g, "-")}.svg`}
          className="rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10"
        >
          Baixar QR
        </a>
        <Link
          href={publicPath}
          className="rounded-full border border-tertiary/50 px-5 py-2 text-tertiary transition hover:bg-tertiary/10"
        >
          Simular escaneamento
        </Link>
        <Link href={`/compartilhar-memorial?memorial=${memorial.id}`} className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Compartilhar memorial
        </Link>
      </div>
    </main>
  );
}
