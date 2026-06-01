import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { updatePlatformData, type ManagedMemorial } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLines(value: unknown) {
  return asString(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function limitText(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();

    if (!session) {
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const name = limitText(asString(body.name), 120);
    const nickname = body.nickname ? limitText(asString(body.nickname), 80) : undefined;
    const birthDate = body.birthDate || undefined;
    const deathDate = body.deathDate || undefined;
    const city = body.city ? limitText(asString(body.city), 100) : undefined;
    const epitaph = limitText(asString(body.epitaph), 500);
    const biography = limitText(asString(body.biography), 2000);

    if (!name || !epitaph || !biography) {
      return NextResponse.json(
        { error: "Nome, epitafio e biografia sao obrigatorios." },
        { status: 400 }
      );
    }

    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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

    const memorial = await updatePlatformData((data) => {
      // Verify funeral home still exists and is active
      const funeralHome = data.funeralHomes.find(
        (fh) => fh.id === session.funeralHomeId
      );

      if (!funeralHome || !funeralHome.isActive) {
        throw new Error("Funeraria nao encontrada ou inativa.");
      }

      const newMemorial: ManagedMemorial = {
        id: `mem_${Date.now().toString(36)}`,
        ownerId: "funeral_home",
        name,
        nickname,
        birthDate,
        deathDate,
        city,
        epitaph,
        biography,
        imageUrl: body.imageUrl || "/images/hero-bg.png",
        audioUrl: body.audioUrl || undefined,
        gallery,
        timelineEvents,
        status: "pending_payment",
        paymentStatus: "pending",
        qrUnlocked: false,
        source: "funeral_home",
        funeralHomeId: funeralHome.id,
        visits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.memorials.push(newMemorial);
      return newMemorial;
    });

    return NextResponse.json({ memorial }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar memorial.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
