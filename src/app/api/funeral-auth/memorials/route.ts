import { NextResponse } from "next/server";
import { requireFuneralHomeApi } from "@/src/components/funeral/guard";
import { createDraftMemorial } from "@/src/components/funeral/memorial-data";

export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Cria o rascunho do memorial. De propósito, só o nome é obrigatório aqui —
 * este endpoint atende o passo rápido do atendimento (família na frente,
 * poucos minutos). O restante (epitáfio, biografia, fotos...) é preenchido
 * depois, na tela de publicação, via PATCH /memorials/[id].
 */
export async function POST(request: Request) {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const memorial = await createDraftMemorial(guard.funeralHome, {
      name: asString(body.name),
      nickname: asString(body.nickname) || undefined,
      birthDate: asString(body.birthDate) || undefined,
      deathDate: asString(body.deathDate) || undefined,
      city: asString(body.city) || undefined,
    });

    return NextResponse.json({ memorial }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar memorial.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
