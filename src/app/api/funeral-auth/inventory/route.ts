import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updatePlatformData, type InventoryItem } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const data = await readPlatformData();
    const items = data.inventoryItems.filter((i) => i.funeralHomeId === session.funeralHomeId);
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar estoque.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Nome e categoria sao obrigatorios." }, { status: 400 });
    }

    const item = await updatePlatformData((data) => {
      const newItem: InventoryItem = {
        id: "inv_" + Date.now().toString(36),
        funeralHomeId: session.funeralHomeId,
        name: body.name,
        category: body.category,
        description: body.description,
        quantity: body.quantity || 0,
        minQuantity: body.minQuantity || 1,
        unitPriceCents: body.unitPriceCents || 0,
        costPriceCents: body.costPriceCents,
        imageUrl: body.imageUrl,
        status: (body.quantity || 0) > 0 ? "disponivel" : "esgotado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.inventoryItems.push(newItem);
      return newItem;
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });

    const item = await updatePlatformData((data) => {
      const inv = data.inventoryItems.find((i) => i.id === body.id && i.funeralHomeId === session.funeralHomeId);
      if (!inv) throw new Error("Item nao encontrado.");
      Object.assign(inv, { ...body, id: inv.id, funeralHomeId: inv.funeralHomeId, createdAt: inv.createdAt, updatedAt: new Date().toISOString() });
      if (typeof inv.quantity === "number") {
        inv.status = inv.quantity > 0 ? "disponivel" : "esgotado";
      }
      return inv;
    });
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
