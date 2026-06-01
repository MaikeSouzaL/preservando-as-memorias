import { NextResponse } from "next/server";
import { readPlatformData, updatePlatformData, type FuneralHomeOfferLink } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function GET() {
  try {
    const data = await readPlatformData();
    return NextResponse.json({ 
      offerLinks: data.offerLinks || [], 
      funeralHomes: data.funeralHomes || [] 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar as ofertas.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, cycle, priceCents, funeralHomeId } = body;

    if (!cycle || !priceCents) {
      return NextResponse.json({ error: "Ciclo e preço são obrigatórios." }, { status: 400 });
    }

    const newOffer = await updatePlatformData((data) => {
      let finalTitle = title ? String(title).trim() : "";
      const fHomeId = funeralHomeId ? String(funeralHomeId).trim() : undefined;

      if (fHomeId) {
        const fh = data.funeralHomes.find((f) => f.id === fHomeId);
        if (fh) {
          finalTitle = fh.name;
        }
      }

      if (!finalTitle) {
        throw new Error("O título da oferta ou funerária associada é obrigatória.");
      }

      const offer: FuneralHomeOfferLink = {
        id: `offer_${Date.now().toString(36)}`,
        funeralHomeId: fHomeId,
        title: finalTitle,
        slug: generateSlug(finalTitle),
        description: description?.trim() || "",
        cycle,
        priceCents: Number(priceCents),
        status: "active",
        accessCount: 0,
        conversionCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.offerLinks.push(offer);
      return offer;
    });

    return NextResponse.json({ offerLink: newOffer }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar a oferta.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da oferta é obrigatório." }, { status: 400 });
    }

    const updated = await updatePlatformData((data) => {
      const offer = data.offerLinks.find((o) => o.id === id);
      if (!offer) {
        throw new Error("Oferta não encontrada.");
      }

      if (status) {
        offer.status = status;
      }
      offer.updatedAt = new Date().toISOString();
      return offer;
    });

    return NextResponse.json({ offerLink: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível atualizar a oferta.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID da oferta é obrigatório." }, { status: 400 });
    }

    await updatePlatformData((data) => {
      const index = data.offerLinks.findIndex((o) => o.id === id);
      if (index === -1) {
        throw new Error("Oferta não encontrada.");
      }
      data.offerLinks.splice(index, 1);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível excluir a oferta.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
