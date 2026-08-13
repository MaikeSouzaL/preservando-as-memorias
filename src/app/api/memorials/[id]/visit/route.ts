import { NextResponse } from "next/server";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

type MemorialVisitContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: MemorialVisitContext) {
  try {
    const { id } = await context.params;

    const result = await updatePlatformData((data) => {
      const memorial = data.memorials.find((item) => item.id === id && item.status === "ativo");

      if (!memorial) {
        return null;
      }

      memorial.visits = (memorial.visits ?? 0) + 1;
      memorial.updatedAt = new Date().toISOString();

      const qrCode = data.qrCodes.find((item) => item.memorialId === id);
      if (qrCode) {
        qrCode.scans = (qrCode.scans ?? 0) + 1;
        qrCode.lastScanAt = memorial.updatedAt;
      }

      return {
        visits: memorial.visits,
        scans: qrCode?.scans ?? 0,
        lastScanAt: qrCode?.lastScanAt,
      };
    });

    if (!result) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Não foi possível registrar a visita." }, { status: 500 });
  }
}
