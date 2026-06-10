import { NextResponse } from "next/server";
import Stripe from "stripe";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function asStr(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

/**
 * POST /api/candle-payment
 *
 * Body: { memorialId, candleName }
 *
 * Sandbox → cria a vela eterna imediatamente e retorna { candle }.
 * Stripe  → cria Checkout Session de R$1 e retorna { checkoutUrl }.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const memorialId = asStr(body.memorialId);
    const candleName = asStr(body.candleName) || "Visitante";

    if (!memorialId) {
      return NextResponse.json({ error: "Memorial não informado." }, { status: 400 });
    }

    const data = await readPlatformData();
    const memorial = data.memorials.find(
      (m) => m.id === memorialId && m.status === "ativo"
    );
    if (!memorial) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    const priceCents = data.config.candlePriceCents ?? 100; // R$1,00
    const gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "sandbox";

    // ── Modo sandbox: cria a vela imediatamente ─────────────────────────────
    if (gateway === "sandbox") {
      const candle = await updatePlatformData((d) => {
        const newCandle = {
          id: `candle_${Date.now().toString(36)}`,
          memorialId,
          name: candleName,
          isEternal: true,
          createdAt: new Date().toISOString(),
          paymentSessionId: `sandbox_${Date.now()}`,
        };
        d.candles.unshift(newCandle);
        return newCandle;
      });

      return NextResponse.json({ candle, gateway: "sandbox" }, { status: 201 });
    }

    // ── Modo Stripe: cria Checkout Session ──────────────────────────────────
    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Chama Eterna — Preservando Memórias",
              description: `Vela eterna no memorial de ${memorial.name}`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/memorial-publico?memorial=${memorialId}&candle_ok={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/memorial-publico?memorial=${memorialId}`,
      metadata: {
        memorialId,
        candleName,
        type: "eternal_candle",
      },
    });

    return NextResponse.json(
      { checkoutUrl: session.url, sessionId: session.id, gateway: "stripe" },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar pagamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
