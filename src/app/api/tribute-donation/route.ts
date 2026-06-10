import { NextResponse } from "next/server";
import Stripe from "stripe";
import { readPlatformData } from "@/src/lib/platform-data";

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
 * POST /api/tribute-donation
 *
 * Body: { memorialId, amountCents, donorName }
 *
 * Registra uma contribuição simbólica vinculada a uma homenagem.
 * A homenagem em si já foi salva antes de chamar este endpoint.
 *
 * Sandbox → retorna { gateway: "sandbox" } sem criar sessão Stripe.
 * Stripe  → cria Checkout Session e retorna { checkoutUrl, gateway: "stripe" }.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const memorialId = asStr(body.memorialId);
    const donorName  = asStr(body.donorName) || "Visitante";
    const amountCents = typeof body.amountCents === "number" ? body.amountCents : 0;

    if (!memorialId) {
      return NextResponse.json({ error: "Memorial não informado." }, { status: 400 });
    }

    if (amountCents < 100) {
      return NextResponse.json({ error: "Valor mínimo de R$1,00." }, { status: 400 });
    }

    const data = await readPlatformData();
    const memorial = data.memorials.find(
      (m) => m.id === memorialId && m.status === "ativo"
    );
    if (!memorial) {
      return NextResponse.json({ error: "Memorial não encontrado." }, { status: 404 });
    }

    const gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "sandbox";

    // ── Modo sandbox ─────────────────────────────────────────────────────────
    if (gateway === "sandbox") {
      return NextResponse.json({ gateway: "sandbox" }, { status: 201 });
    }

    // ── Stripe: cria Checkout Session para a doação ──────────────────────────
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
              name: "Contribuição Simbólica — Preservando Memórias",
              description: `Doação de ${donorName} ao memorial de ${memorial.name}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/memorial-publico?memorial=${memorialId}&tribute_ok=1`,
      cancel_url: `${baseUrl}/memorial-publico?memorial=${memorialId}`,
      metadata: {
        memorialId,
        donorName,
        type: "tribute_donation",
      },
    });

    return NextResponse.json(
      { checkoutUrl: session.url, sessionId: session.id, gateway: "stripe" },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao processar doação.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
