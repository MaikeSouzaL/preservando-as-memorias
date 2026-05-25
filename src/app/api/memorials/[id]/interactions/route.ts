import { NextResponse } from "next/server";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

type MemorialInteractionsContext = {
  params: Promise<{
    id: string;
  }>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function limitText(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

export async function GET(_request: Request, context: MemorialInteractionsContext) {
  try {
    const { id } = await context.params;
    const data = await readPlatformData();
    const memorial = data.memorials.find((item) => item.id === id && item.status === "ativo");

    if (!memorial) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      tributes: data.tributes.filter((tribute) => tribute.memorialId === id && tribute.status === "aprovada"),
      candles: data.candles.filter((candle) => candle.memorialId === id),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar as interações.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, context: MemorialInteractionsContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const type = asString(body.type);

    const created = await updatePlatformData((data) => {
      const memorialExists = data.memorials.some((memorial) => memorial.id === id && memorial.status === "ativo");

      if (!memorialExists) {
        return null;
      }

      if (type === "tribute") {
        const author = limitText(asString(body.author), 80);
        const message = limitText(asString(body.message), 800);

        if (!author || !message) {
          throw new Error("Informe seu nome e a mensagem da homenagem.");
        }

        const isPinned = Boolean(body.isPinned);
        const tribute = {
          id: `trib_${Date.now().toString(36)}`,
          memorialId: id,
          author,
          message,
          tag: limitText(asString(body.tag), 40) || undefined,
          status: (isPinned ? "aprovada" : "pendente") as "aprovada" | "pendente",
          isPinned,
          createdAt: new Date().toISOString(),
        };

        data.tributes.unshift(tribute);
        return { tribute };
      }

      if (type === "candle") {
        const candle = {
          id: `candle_${Date.now().toString(36)}`,
          memorialId: id,
          name: limitText(asString(body.name), 80) || "Visitante",
          isEternal: Boolean(body.isEternal),
          createdAt: new Date().toISOString(),
        };

        data.candles.unshift(candle);
        return { candle };
      }

      throw new Error("Tipo de interação inválido.");
    });

    if (!created) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível registrar a interação.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
