import { redirect } from "next/navigation";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData } from "@/src/lib/platform-data";
import { generateHeartQr } from "@/src/lib/qr-heart";
import { FunerariaDashboardClient } from "@/src/components/funeral/funeraria-dashboard-client";

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

export default async function FunerariaDashboardPage() {
  const session = await getFuneralSession();
  if (!session) redirect("/funeraria/login");

  const data = await readPlatformData();
  const funeralHome = data.funeralHomes.find((fh) => fh.id === session.funeralHomeId);
  if (!funeralHome) redirect("/funeraria/login");

  const memorials = data.memorials.filter((m) => m.funeralHomeId === funeralHome.id);

  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001")
    .replace("://preservandomemorias.com.br", "://www.preservandomemorias.com.br");

  const qrMap: Record<string, { dark: string; light: string }> = {};
  for (const m of memorials.filter((m) => m.status === "ativo")) {
    const overlayBase = {
      leftLine1: shortName(m.name),
      leftLine2: fmtDate(m.birthDate) ? `✦ ${fmtDate(m.birthDate)}` : undefined,
      rightLine1: "✝",
      rightLine2: fmtDate(m.deathDate),
    };
    const qrUrl = `${baseUrl}/memorial-publico?memorial=${m.id}`;
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
    <FunerariaDashboardClient
      funeralHome={{
        id: funeralHome.id,
        name: funeralHome.name,
        email: funeralHome.email,
        contactName: funeralHome.contactName,
        phone: funeralHome.phone,
        cnpj: funeralHome.cnpj,
        city: funeralHome.city,
        state: funeralHome.state,
      }}
      memorials={memorials}
      qrMap={qrMap}
    />
  );
}
