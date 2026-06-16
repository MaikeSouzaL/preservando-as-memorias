import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** PATCH — marca QR Code como enviado (define qrSentAt = agora) */
export async function PATCH(_req: Request, { params }: Params) {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  const { id } = await params;

  try {
    await updatePlatformData((data) => {
      const memorial = data.memorials.find((m) => m.id === id);
      if (!memorial) throw new Error("Memorial não encontrado.");
      memorial.qrSentAt = new Date().toISOString();
      memorial.updatedAt = new Date().toISOString();
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar memorial.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/** DELETE — desfaz o envio (limpa qrSentAt) */
export async function DELETE(_req: Request, { params }: Params) {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  const { id } = await params;

  try {
    await updatePlatformData((data) => {
      const memorial = data.memorials.find((m) => m.id === id);
      if (!memorial) throw new Error("Memorial não encontrado.");
      memorial.qrSentAt = undefined;
      memorial.updatedAt = new Date().toISOString();
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar memorial.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
