import { NextResponse } from "next/server";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { getAuthSession } from "@/src/lib/auth-session";

export const dynamic = "force-dynamic";

type MemorialRouteContext = {
  params: Promise<{ id: string }>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLines(value: unknown) {
  return asString(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildYears(birthDate?: string, deathDate?: string) {
  if (!birthDate && !deathDate) return "";

  return `${birthDate ? new Date(birthDate).getFullYear() : "?"} - ${deathDate ? new Date(deathDate).getFullYear() : "?"}`;
}

function canManageMemorial(session: Awaited<ReturnType<typeof getAuthSession>>, ownerId: string) {
  return Boolean(session && (session.isAdmin || ownerId.toLowerCase().trim() === session.email));
}

export async function GET(_request: Request, context: MemorialRouteContext) {
  const { id } = await context.params;
  const data = await readPlatformData();
  const session = await getAuthSession();
  const memorial = data.memorials.find((item) => item.id === id);

  if (!memorial) {
    return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
  }

  if (memorial.status !== "ativo" && !canManageMemorial(session, memorial.ownerId)) {
    return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    memorial,
    qrCode: data.qrCodes.find((item) => item.memorialId === id) ?? null,
    years: buildYears(memorial.birthDate, memorial.deathDate),
  });
}

export async function PATCH(request: Request, context: MemorialRouteContext) {
  try {
    const { id } = await context.params;
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Faça login para editar o memorial." }, { status: 401 });
    }

    const body = await request.json();
    const name = asString(body.name);
    const biography = asString(body.biography);

    if (!name) {
      return NextResponse.json({ error: "Informe o nome completo do ente querido." }, { status: 400 });
    }

    if (!biography) {
      return NextResponse.json({ error: "Escreva pelo menos uma breve história para o memorial." }, { status: 400 });
    }

    const updated = await updatePlatformData((data) => {
      const index = data.memorials.findIndex((item) => item.id === id);

      if (index < 0) {
        return null;
      }

      const current = data.memorials[index];
      if (!canManageMemorial(session, current.ownerId)) {
        return "forbidden" as const;
      }

      const now = new Date().toISOString();
      const birthDate = asString(body.birthDate);
      const deathDate = asString(body.deathDate);
      const gallery = Array.isArray(body.gallery)
        ? body.gallery.slice(0, 12).map((item: { id?: string; title?: string; url: string }, index: number) => ({
            id: item.id || `gal_${id}_${index}_${Date.now().toString(36)}`,
            title: (item.title || `Foto ${index + 1}`).trim(),
            url: item.url.trim(),
          }))
        : parseLines(body.galleryUrls).slice(0, 12).map((line, itemIndex) => {
            const [titlePart, urlPart] = line.includes("|") ? line.split("|") : [`Foto ${itemIndex + 1}`, line];

            return {
              id: current.gallery[itemIndex]?.id ?? `gal_${id}_${itemIndex}_${Date.now().toString(36)}`,
              title: titlePart.trim() || `Foto ${itemIndex + 1}`,
              url: (urlPart ?? line).trim(),
            };
          });

      const timelineYear = asString(body.timelineYear);
      const timelineTitle = asString(body.timelineTitle);
      const timelineDescription = asString(body.timelineDescription);
      const timelineImageUrl = asString(body.timelineImageUrl) || asString(body.imageUrl) || "/images/hero-bg.png";
      const timelineEvents = Array.isArray(body.timelineEvents)
        ? body.timelineEvents.map((event: { id?: string; year?: string; title?: string; description?: string; imageUrl?: string }, index: number) => ({
            id: event.id || `tle_${id}_${index}_${Date.now().toString(36)}`,
            year: asString(event.year) || "Memória",
            title: asString(event.title) || "Momento marcante",
            description: asString(event.description),
            longStory: asString(event.description),
            imageUrl: asString(event.imageUrl) || "/images/hero-bg.png",
          }))
        : (timelineYear || timelineTitle || timelineDescription
            ? [
                {
                  id: current.timelineEvents[0]?.id ?? `tle_${id}_${Date.now().toString(36)}`,
                  year: timelineYear || (birthDate ? String(new Date(birthDate).getFullYear()) : "Memória"),
                  title: timelineTitle || "Uma lembrança especial",
                  description: timelineDescription || biography.slice(0, 180),
                  longStory: timelineDescription || biography,
                  imageUrl: timelineImageUrl,
                },
              ]
            : []);

      const memorial = {
        ...current,
        name,
        nickname: asString(body.nickname) || undefined,
        birthDate: birthDate || undefined,
        deathDate: deathDate || undefined,
        city: asString(body.city) || undefined,
        epitaph: asString(body.epitaph) || "Uma história preservada com carinho.",
        biography,
        imageUrl: asString(body.imageUrl) || "/images/hero-bg.png",
        audioUrl: asString(body.audioUrl) || undefined,
        videoUrl: asString(body.videoUrl) || undefined,
        gallery,
        timelineEvents,
        updatedAt: now,
      };

      data.memorials[index] = memorial;

      let qrCode = data.qrCodes.find((item) => item.memorialId === id);
      if (!qrCode) {
        qrCode = {
          id: `qr_${id}_${Date.now().toString(36)}`,
          memorialId: id,
          publicPath: `/memorial-publico?memorial=${id}`,
          scans: 0,
          status: "ativo" as const,
          createdAt: now,
        };
        data.qrCodes.unshift(qrCode);
      }

      return { memorial, qrCode, years: buildYears(birthDate, deathDate) };
    });

    if (!updated) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    if (updated === "forbidden") {
      return NextResponse.json({ error: "Você não tem permissão para editar este memorial." }, { status: 403 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar o memorial agora." }, { status: 500 });
  }
}
