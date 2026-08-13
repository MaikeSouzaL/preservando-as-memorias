import { NextResponse } from "next/server";
import { requireFuneralHomeApi } from "@/src/components/funeral/guard";
import { getFuneralHomeMemorial, publishMemorial, updateMemorial } from "@/src/components/funeral/memorial-data";

export const dynamic = "force-dynamic";

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  const memorial = await getFuneralHomeMemorial(guard.funeralHome.id, params.id);
  if (!memorial) return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });

  return NextResponse.json({ memorial });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();

    const patch = {
      name: asString(body.name),
      nickname: asString(body.nickname),
      birthDate: asString(body.birthDate),
      deathDate: asString(body.deathDate),
      city: asString(body.city),
      epitaph: asString(body.epitaph),
      biography: asString(body.biography),
      imageUrl: asString(body.imageUrl),
      audioUrl: asString(body.audioUrl),
      videoUrl: asString(body.videoUrl),
      gallery: asArray<{ title: string; url: string }>(body.gallery),
      timelineEvents: asArray<{ year: string; title: string; description: string; imageUrl: string }>(body.timelineEvents),
      deliveryAddress: body.deliveryAddress ?? undefined,
    };

    const existing = await getFuneralHomeMemorial(guard.funeralHome.id, params.id);
    if (!existing) return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });

    const memorial =
      body.action === "publish"
        ? await publishMemorial(guard.funeralHome.id, params.id, patch)
        : await updateMemorial(guard.funeralHome.id, params.id, patch);

    return NextResponse.json({ memorial });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar memorial.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
