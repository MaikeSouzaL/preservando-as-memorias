import { NextResponse } from "next/server";
import Stripe from "stripe";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { sendOrderConfirmationEmail, sendAdminPaymentNotification } from "@/src/lib/email";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

async function handlePaymentConfirmed(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const orderId = session.metadata?.orderId ?? "";
  const source = session.metadata?.source ?? "";
  const memorialId = session.metadata?.memorialId ?? "";

  // 1. Update order + memorial status in DB
  const data = await readPlatformData();
  const order = data.orders.find((o) => o.id === orderId);

  await updatePlatformData((d) => {
    const o = d.orders.find((x) => x.id === orderId);
    if (o) {
      (o as { status: string }).status = "paid";
      (o as { stripeSessionId?: string }).stripeSessionId = session.id;
    }

    if ((source === "funeral_home_offer" || source === "funeral_home" || source === "family") && memorialId) {
      const memorial = d.memorials.find((m) => m.id === memorialId);
      if (memorial) {
        memorial.status = "ativo";
        memorial.paymentStatus = "paid";
        memorial.qrUnlocked = true;
        memorial.updatedAt = new Date().toISOString();
      }
    }
  });

  if (!order) return;

  // 2. Transfer 85% to admin's Stripe Connect account (if configured)
  const adminConnectAccountId = process.env.STRIPE_ADMIN_CONNECT_ACCOUNT_ID;
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (adminConnectAccountId && paymentIntentId && order.operatorAmountCents > 0) {
    try {
      await stripe.transfers.create({
        amount: order.operatorAmountCents,
        currency: "brl",
        destination: adminConnectAccountId,
        source_transaction: paymentIntentId,
        metadata: { orderId: order.id, type: "admin_repasse_85" },
      });
    } catch (err) {
      // Log error but don't fail the webhook — payment already confirmed
      console.error("[Stripe Transfer] Falha ao transferir 85% para o admin:", err);
    }
  }

  // 3. Find plan name for emails
  const planName =
    data.config.plans?.find((p) => p.id === order.planId)?.name ??
    (order.planId === "memorial_familia" ? "Memorial Família" :
     order.planId === "memorial_funeraria" ? "Memorial Funerária" :
     order.planId === "funeral_home_offer" ? "Oferta de funerária" : order.planId);

  const emailData = {
    id: order.id,
    userName: order.userName,
    userEmail: order.userEmail,
    planId: order.planId,
    planName,
    grossAmountCents: order.grossAmountCents,
    platformCommissionCents: order.platformCommissionCents,
    operatorAmountCents: order.operatorAmountCents,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
  };

  // 4. Send emails (in parallel, errors are non-fatal)
  await Promise.allSettled([
    sendOrderConfirmationEmail(emailData),
    sendAdminPaymentNotification(emailData),
  ]);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret não configurado." }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handlePaymentConfirmed(event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await updatePlatformData((data) => {
        const order = data.orders.find((o) => o.id === orderId);
        if (order) (order as { status: string }).status = "cancelled";
      });
    }
  }

  return NextResponse.json({ received: true });
}
