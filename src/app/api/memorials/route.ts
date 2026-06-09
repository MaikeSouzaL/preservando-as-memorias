import { NextResponse } from "next/server";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { getAuthSession } from "@/src/lib/auth-session";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function parseLines(value: unknown) {
  return asString(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function GET() {
  const data = await readPlatformData();
  const session = await getAuthSession();

  const memorials = session
    ? data.memorials.filter((memorial) => memorial.id !== "default" && (session.isAdmin || memorial.ownerId.toLowerCase().trim() === session.email))
    : data.memorials.filter((memorial) => memorial.id !== "default" && memorial.status === "ativo");
  const memorialIds = new Set(memorials.map((memorial) => memorial.id));
  const qrCodes = data.qrCodes.filter((qrCode) => qrCode.memorialId && memorialIds.has(qrCode.memorialId));

  return NextResponse.json({ memorials, qrCodes });
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Faça login para criar um memorial." }, { status: 401 });
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

    const created = await updatePlatformData((data) => {
      const now = new Date().toISOString();
      const baseId = slugify(name) || "memorial";
      const id = `mem_${baseId}_${Date.now().toString(36)}`;
      const birthDate = asString(body.birthDate);
      const deathDate = asString(body.deathDate);
      const years =
        birthDate || deathDate
          ? `${birthDate ? new Date(birthDate).getFullYear() : "?"} - ${deathDate ? new Date(deathDate).getFullYear() : "?"}`
          : "";

      const gallery = Array.isArray(body.gallery)
        ? body.gallery.slice(0, 12).map((item: { id?: string; title?: string; url: string }, index: number) => ({
            id: item.id || `gal_${baseId}_${index}_${Date.now().toString(36)}`,
            title: (item.title || `Foto ${index + 1}`).trim(),
            url: item.url.trim(),
          }))
        : parseLines(body.galleryUrls).slice(0, 12).map((line, index) => {
            const [titlePart, urlPart] = line.includes("|") ? line.split("|") : [`Foto ${index + 1}`, line];

            return {
              id: `gal_${baseId}_${index}_${Date.now().toString(36)}`,
              title: titlePart.trim() || `Foto ${index + 1}`,
              url: (urlPart ?? line).trim(),
            };
          });

      const timelineYear = asString(body.timelineYear);
      const timelineTitle = asString(body.timelineTitle);
      const timelineDescription = asString(body.timelineDescription);
      const timelineEvents = Array.isArray(body.timelineEvents)
        ? body.timelineEvents.map((event: { id?: string; year?: string; title?: string; description?: string; imageUrl?: string }, index: number) => ({
            id: event.id || `tle_${baseId}_${index}_${Date.now().toString(36)}`,
            year: asString(event.year) || "Memória",
            title: asString(event.title) || "Momento marcante",
            description: asString(event.description),
            longStory: asString(event.description),
            imageUrl: asString(event.imageUrl) || "/images/hero-bg.png",
          }))
        : (timelineYear || timelineTitle || timelineDescription
            ? [
                {
                  id: `tle_${baseId}_${Date.now().toString(36)}`,
                  year: timelineYear || (birthDate ? String(new Date(birthDate).getFullYear()) : "Memória"),
                  title: timelineTitle || "Uma lembrança especial",
                  description: timelineDescription || biography.slice(0, 180),
                  longStory: timelineDescription || biography,
                  imageUrl: asString(body.timelineImageUrl) || asString(body.imageUrl) || "/images/hero-bg.png",
                },
              ]
            : []);

      const memorial = {
        id,
        ownerId: session.email,
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
        status: "pending_payment" as const,
        paymentStatus: "pending" as const,
        qrUnlocked: false,
        source: "customer" as const,
        visits: 0,
        createdAt: now,
        updatedAt: now,
      };

      const qrCode = {
        id: `qr_${baseId}_${Date.now().toString(36)}`,
        memorialId: id,
        publicPath: `/memorial-publico?memorial=${id}`,
        scans: 0,
        status: "ativo" as const,
        createdAt: now,
      };

      data.memorials.unshift(memorial);
      data.qrCodes.unshift(qrCode);

      return { memorial, qrCode, years };
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível criar o memorial agora." }, { status: 500 });
  }
}
