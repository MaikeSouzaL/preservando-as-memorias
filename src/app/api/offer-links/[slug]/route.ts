import { NextResponse } from "next/server";
import {  updatePlatformData, type ManagedMemorial } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

type OfferLinkContext = {
  params: Promise<{
    slug: string;
  }>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function limitText(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

function parseLines(value: unknown) {
  return asString(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
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

export async function GET(_request: Request, context: OfferLinkContext) {
  try {
    const { slug } = await context.params;
    
    const result = await updatePlatformData((data) => {
      const offer = data.offerLinks.find((o) => o.slug === slug && o.status === "active");
      if (!offer) {
        return null;
      }
      offer.accessCount += 1;
      return offer;
    });

    if (!result) {
      return NextResponse.json({ error: "Oferta não encontrada ou pausada." }, { status: 404 });
    }

    return NextResponse.json({ offerLink: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar a oferta.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, context: OfferLinkContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const name = limitText(asString(body.name), 120);
    const epitaph = limitText(asString(body.epitaph), 500);
    const biography = limitText(asString(body.biography), 2000);

    if (!name || !epitaph || !biography) {
      return NextResponse.json({ error: "Nome, epitáfio e biografia são obrigatórios." }, { status: 400 });
    }

    const result = await updatePlatformData((data) => {
      const offer = data.offerLinks.find((o) => o.slug === slug && o.status === "active");
      if (!offer) {
        return { error: "Oferta não encontrada ou pausada.", status: 404 };
      }

      const baseId = slugify(name) || "memorial";
      const birthDate = body.birthDate || undefined;
      const deathDate = body.deathDate || undefined;

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
      const timelineEvents =
        timelineYear || timelineTitle || timelineDescription
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
          : [];

      const memorial: ManagedMemorial = {
        id: `mem_${Date.now().toString(36)}`,
        ownerId: "funeral_home_draft",
        name,
        nickname: body.nickname ? limitText(asString(body.nickname), 80) : undefined,
        birthDate,
        deathDate,
        city: body.city ? limitText(asString(body.city), 100) : undefined,
        epitaph,
        biography,
        imageUrl: body.imageUrl || "/images/hero-bg.png",
        audioUrl: body.audioUrl || undefined,
        gallery,
        timelineEvents,
        status: "pending_payment",
        paymentStatus: "pending",
        qrUnlocked: false,
        source: "funeral_home_offer",
        offerLinkId: offer.id,
        visits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.memorials.push(memorial);
      offer.conversionCount += 1;

      return { memorial, offerLink: offer };
    });

    if (result && "error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o memorial.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

