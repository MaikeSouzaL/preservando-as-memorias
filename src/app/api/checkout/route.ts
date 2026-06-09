import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updatePlatformData } from "@/src/lib/platform-data";
import { calculateOrderTotals, type PaymentMethod } from "@/src/lib/platform-types";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userName = asString(body.name);
    const userEmail = asString(body.email);
    const customerDocument = asString(body.cpf);
    const customerPhone = asString(body.phone);
    const paymentMethod = asString(body.paymentMethod) as PaymentMethod;
    const memorialId = asString(body.memorialId);
    const payerType = asString(body.payerType) as "family" | "funeral_home" | "";
    const planId = asString(body.planId);
    const offerLinkId = asString(body.offerLinkId);
    const discountCode = asString(body.discountCode);
    const source = asString(body.source) as "family" | "funeral_home" | "funeral_home_offer" | "plan" | "";

    if (!userName || !userEmail || !customerDocument || !customerPhone) {
      return NextResponse.json(
        { error: "Nome, e-mail, CPF e telefone são obrigatórios." },
        { status: 400 }
      );
    }

    if (!["pix", "card", "boleto"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Selecione um método de pagamento válido." }, { status: 400 });
    }

    const isMemorialFlow = (payerType === "family" || payerType === "funeral_home") && memorialId;
    const isOfferFlow = source === "funeral_home_offer" && offerLinkId;
    const isPlanFlow = Boolean(planId);

    if (!isMemorialFlow && !isOfferFlow && !isPlanFlow) {
      return NextResponse.json(
        { error: "Informe o memorial ou plano para pagamento." },
        { status: 400 }
      );
    }

    const gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "sandbox";

    const order = await updatePlatformData((data) => {
      let priceCents: number;
      let actualPlanId: string;
      let productName: string;
      let funeralHomeStripeAccountId: string | undefined;

      if (isMemorialFlow) {
        priceCents =
          payerType === "family"
            ? data.config.familyMemorialPriceCents
            : data.config.funeralHomeMemorialPriceCents;
        actualPlanId = payerType === "family" ? "memorial_familia" : "memorial_funeraria";
        productName = "Memorial Digital — Preservando Memórias";

        if (payerType === "funeral_home" && memorialId) {
          const memorial = data.memorials.find((m) => m.id === memorialId);
          const funeralHome = memorial?.funeralHomeId
            ? data.funeralHomes.find((fh) => fh.id === memorial.funeralHomeId)
            : undefined;
          funeralHomeStripeAccountId = funeralHome?.stripeAccountId;
        }
      } else if (isOfferFlow) {
        const offer = data.offerLinks.find((o) => o.id === offerLinkId);
        if (!offer) throw new Error("Oferta não encontrada.");
        priceCents = offer.priceCents;
        actualPlanId = "funeral_home_offer";
        productName = offer.title ?? "Serviço de memorial";

        if (memorialId) {
          const memorial = data.memorials.find((m) => m.id === memorialId);
          const funeralHome = memorial?.funeralHomeId
            ? data.funeralHomes.find((fh) => fh.id === memorial.funeralHomeId)
            : undefined;
          funeralHomeStripeAccountId = funeralHome?.stripeAccountId;
        }
      } else {
        const plan = data.config.plans?.find((item) => item.id === planId && item.active);
        if (!plan) throw new Error("Plano indisponível.");
        priceCents = plan.priceCents;
        actualPlanId = planId;
        productName = `Plano ${plan.name}`;
      }

      const totals = calculateOrderTotals(priceCents, data.config.ownerCommissionPercent, discountCode);
      const isPaid = gateway === "sandbox";

      let orderFuneralHomeId: string | undefined;
      if (memorialId) {
        const memorial = data.memorials.find((m) => m.id === memorialId);
        orderFuneralHomeId = memorial?.funeralHomeId;
      }

      const nextOrder = {
        id: `ord_${Date.now().toString(36)}`,
        userName,
        userEmail,
        customerDocument,
        customerPhone,
        planId: actualPlanId,
        paymentMethod,
        discountCode: discountCode || undefined,
        discountCents: totals.discountCents,
        grossAmountCents: totals.grossAmountCents,
        platformCommissionCents: totals.platformCommissionCents,
        operatorAmountCents: totals.operatorAmountCents,
        status: isPaid ? ("paid" as const) : ("pending" as const),
        source: (source || payerType || "plan") as "family" | "funeral_home" | "funeral_home_offer" | "plan",
        offerLinkId: offerLinkId || undefined,
        funeralHomeId: orderFuneralHomeId,
        draftMemorialId: memorialId || undefined,
        payerType: (payerType || undefined) as "funeral_home" | "family" | undefined,
        createdAt: new Date().toISOString(),
        _productName: productName,
        _funeralHomeStripeAccountId: funeralHomeStripeAccountId,
      };

      data.orders.unshift(nextOrder);

      if (memorialId && isPaid) {
        const memorial = data.memorials.find((m) => m.id === memorialId);
        if (memorial) {
          memorial.status = "ativo";
          memorial.paymentStatus = "paid";
          memorial.qrUnlocked = true;
          memorial.updatedAt = new Date().toISOString();
        }
      }

      return nextOrder;
    });

    if (gateway === "sandbox") {
      return NextResponse.json(
        {
          order,
          gateway,
          paymentDetails: { success: true, sandbox: true },
          message: "Pagamento simulado com sucesso!",
        },
        { status: 201 }
      );
    }

    if (gateway === "stripe") {
      const stripe = getStripe();
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

      const stripePaymentMethods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
        paymentMethod === "pix" ? ["pix"] : paymentMethod === "boleto" ? ["boleto"] : ["card"];

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        payment_method_types: stripePaymentMethods,
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: (order as { _productName?: string })._productName ?? "Preservando Memórias",
              },
              unit_amount: order.grossAmountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${baseUrl}/dashboard`,
        metadata: {
          orderId: order.id,
          source: source || payerType || "plan",
          memorialId: memorialId || "",
        },
      };

      const funeralHomeStripeAccountId = (order as { _funeralHomeStripeAccountId?: string })
        ._funeralHomeStripeAccountId;

      if (funeralHomeStripeAccountId) {
        sessionParams.payment_intent_data = {
          application_fee_amount: order.platformCommissionCents,
          transfer_data: { destination: funeralHomeStripeAccountId },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return NextResponse.json(
        {
          order,
          gateway,
          checkoutUrl: session.url,
          sessionId: session.id,
          message: "Redirecionando para o pagamento seguro.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Gateway de pagamento não configurado." }, { status: 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir o pagamento.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
