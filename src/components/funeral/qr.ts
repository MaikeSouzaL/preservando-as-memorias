import { generateHeartQr } from "@/src/lib/qr-heart";
import { fmtDateBR } from "@/src/components/funeral/format";

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

export function memorialPublicUrl(memorialId: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001").replace(
    "://preservandomemorias.com.br",
    "://www.preservandomemorias.com.br"
  );
  return `${baseUrl}/memorial-publico?memorial=${memorialId}`;
}

export type HeartQrPair = { dark: string; light: string };

/**
 * Par de QR em forma de coração para um memorial — versão escura (fundo
 * azul-marinho, pro painel) e clara (dourado sobre creme, pro papel).
 */
export function generateMemorialQrPair(memorial: { id: string; name: string; birthDate?: string; deathDate?: string }): HeartQrPair {
  const url = memorialPublicUrl(memorial.id);
  const overlayBase = {
    leftLine1: shortName(memorial.name),
    leftLine2: memorial.birthDate ? `✦ ${fmtDateBR(memorial.birthDate)}` : undefined,
    rightLine1: "✝",
    rightLine2: memorial.deathDate ? fmtDateBR(memorial.deathDate) : undefined,
  };

  return {
    dark: generateHeartQr(url, {
      dark: "#0b0f0f",
      light: "#ffffff",
      overlay: { ...overlayBase, color: "#1c1b1b" },
      bottomUrl: "www.preservandomemorias.com.br",
      bgColor: "#0b1120",
      urlColor: "#e9c349",
    }),
    light: generateHeartQr(url, {
      dark: "#000000",
      light: "#e9c349",
      overlay: { ...overlayBase, color: "#1c1b1b" },
      bottomUrl: "www.preservandomemorias.com.br",
      bgColor: "#f9f6ef",
      urlColor: "#1c1b1b",
    }),
  };
}
