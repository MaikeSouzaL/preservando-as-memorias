import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

// Cache em memória para prevenir replay dentro da mesma instância do servidor
const usedSessions = new Set<string>();

/**
 * POST /api/candle-payment/confirm
 *
 * Body: { sessionId }
 *
 * 1. Recupera a Checkout Session do Stripe
 * 2. Verifica payment_status === 'paid'
 * 3. Lê metadata { memorialId, candleName }
 * 4. Verifica anti-replay (session não usada antes)
 * 5. Cria a vela eterna no banco
 * 6. Retorna { candle }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId =
      typeof body.sessionId === "string" ? body.sessionId.trim() : "";

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId não informado." }, { status: 400 });
    }

    // Anti-replay: já processamos esta sessão?
    if (usedSessions.has(sessionId)) {
      return NextResponse.json(
        { error: "Esta sessão já foi processada." },
        { status: 409 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verifica se o pagamento foi de fato concluído
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Pagamento ainda não confirmado." },
        { status: 402 }
      );
    }

    // Verifica que é uma vela eterna (não qualquer outro produto)
    if (session.metadata?.type !== "eternal_candle") {
      return NextResponse.json({ error: "Sessão inválida." }, { status: 400 });
    }

    const memorialId = session.metadata?.memorialId ?? "";
    const candleName = session.metadata?.candleName ?? "Visitante";

    if (!memorialId) {
      return NextResponse.json({ error: "Memorial não identificado na sessão." }, { status: 400 });
    }

    // Marca sessão como usada antes de gravar (evita race condition em retry rápido)
    usedSessions.add(sessionId);

    // Cria a vela eterna
    const candle = await updatePlatformData((data) => {
      // Anti-replay extra: checar no banco se já existe vela com este sessionId
      const alreadyExists = data.candles.some(
        (c) => c.paymentSessionId === sessionId
      );
      if (alreadyExists) return null;

      const newCandle = {
        id: `candle_${Date.now().toString(36)}`,
        memorialId,
        name: candleName,
        isEternal: true,
        createdAt: new Date().toISOString(),
        paymentSessionId: sessionId,
      };
      data.candles.unshift(newCandle);
      return newCandle;
    });

    if (!candle) {
      return NextResponse.json(
        { error: "Vela já confirmada anteriormente." },
        { status: 409 }
      );
    }

    return NextResponse.json({ candle }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao confirmar pagamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
