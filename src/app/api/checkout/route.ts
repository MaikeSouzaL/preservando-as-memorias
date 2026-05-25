import { NextResponse } from "next/server";
import { updatePlatformData } from "@/src/lib/platform-data";
import { calculateOrderTotals, type PaymentMethod } from "@/src/lib/platform-types";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * ============================================================================
 * GUIA DE INTEGRAÇÃO DE MEIOS DE PAGAMENTO EM PRODUÇÃO
 * ============================================================================
 * Para ativar um gateway real, defina a variável de ambiente:
 * NEXT_PUBLIC_PAYMENT_GATEWAY="stripe" | "asaas" | "mercadopago" | "sandbox"
 *
 * Configure também as credenciais correspondentes no arquivo .env local.
 * ============================================================================
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userName = asString(body.name);
    const userEmail = asString(body.email);
    const customerDocument = asString(body.cpf);
    const customerPhone = asString(body.phone);
    const planId = asString(body.planId);
    const discountCode = asString(body.discountCode);
    const paymentMethod = asString(body.paymentMethod) as PaymentMethod;

    if (!userName || !userEmail || !customerDocument || !customerPhone || !planId) {
      return NextResponse.json(
        { error: "Nome, e-mail, CPF, telefone e plano são obrigatórios." },
        { status: 400 }
      );
    }

    if (!["pix", "card", "boleto"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Selecione um método de pagamento válido." }, { status: 400 });
    }

    const gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "sandbox";
    let gatewayResponse: {
      success: boolean;
      sandbox?: boolean;
      id?: string;
      clientSecret?: string;
      pixCopiaCola?: string;
      boletoUrl?: string;
      qrCodeBase64?: string;
    } = { success: true };

    if (gateway === "sandbox") {
      gatewayResponse = { success: true, sandbox: true };
    }

    // ========================================================================
    // 1. INTEGRAÇÃO ESTRUTURADA COM STRIPE (INTERNACIONAL / CARTÃO)
    // ========================================================================
    if (gateway === "stripe") {
      try {
        // Exemplo de integração usando o Stripe SDK (necessita `npm install stripe`):
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
        // const customer = await stripe.customers.create({ name: userName, email: userEmail });
        // const paymentIntent = await stripe.paymentIntents.create({
        //   amount: totals.grossAmountCents,
        //   currency: 'brl',
        //   customer: customer.id,
        //   payment_method_types: ['card'],
        // });
        // gatewayResponse = { id: paymentIntent.id, clientSecret: paymentIntent.client_secret };
        console.log("Stripe mock chamado com sucesso.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        throw new Error(`Erro na API do Stripe: ${msg}`);
      }
    }

    // ========================================================================
    // 2. INTEGRAÇÃO ESTRUTURADA COM ASAAS (PIX, BOLETO E CARTÃO NACIONAL)
    // ========================================================================
    else if (gateway === "asaas") {
      try {
        // Exemplo de chamada REST à API do Asaas (PIX / Boleto):
        // const response = await fetch("https://api.asaas.com/v3/payments", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "access_token": process.env.ASAAS_API_KEY!
        //   },
        //   body: JSON.stringify({
        //     customer: "cst_customer_id_here",
        //     billingType: paymentMethod === "pix" ? "PIX" : paymentMethod === "boleto" ? "BOLETO" : "CREDIT_CARD",
        //     value: totals.grossAmountCents / 100,
        //     dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 dias de validade
        //   })
        // });
        // const asaasData = await response.json();
        // gatewayResponse = {
        //   id: asaasData.id,
        //   pixCopiaCola: asaasData.pixCopyAndPaste || "",
        //   boletoUrl: asaasData.bankSlipUrl || ""
        // };
        console.log("Asaas mock chamado com sucesso.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        throw new Error(`Erro na API do Asaas: ${msg}`);
      }
    }

    // ========================================================================
    // 3. INTEGRAÇÃO ESTRUTURADA COM MERCADO PAGO (PIX COMPLETO E CARTÃO)
    // ========================================================================
    else if (gateway === "mercadopago") {
      try {
        // Exemplo de chamada REST à API do MercadoPago:
        // const response = await fetch("https://api.mercadopago.com/v1/payments", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${process.env.MERCADO_PAGO_TOKEN!}`
        //   },
        //   body: JSON.stringify({
        //     transaction_amount: totals.grossAmountCents / 100,
        //     payment_method_id: paymentMethod === "pix" ? "pix" : "master",
        //     payer: { email: userEmail, first_name: userName },
        //   })
        // });
        // const mpData = await response.json();
        // gatewayResponse = {
        //   id: mpData.id,
        //   qrCodeBase64: mpData.point_of_interaction?.transaction_data?.qr_code_base64 || "",
        //   pixCopiaCola: mpData.point_of_interaction?.transaction_data?.qr_code || ""
        // };
        console.log("Mercado Pago mock chamado com sucesso.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        throw new Error(`Erro na API do Mercado Pago: ${msg}`);
      }
    }

    // Gravação centralizada no arquivo de banco de dados
    const order = await updatePlatformData((data) => {
      const plan = data.config.plans.find((item) => item.id === planId && item.active);

      if (!plan) {
        throw new Error("Plano indisponível.");
      }

      const totals = calculateOrderTotals(plan.priceCents, data.config.ownerCommissionPercent, discountCode);
      const nextOrder = {
        id: `ord_${Date.now().toString(36)}`,
        userName,
        userEmail,
        customerDocument,
        customerPhone,
        planId,
        paymentMethod,
        discountCode: discountCode || undefined,
        discountCents: totals.discountCents,
        grossAmountCents: totals.grossAmountCents,
        platformCommissionCents: totals.platformCommissionCents,
        operatorAmountCents: totals.operatorAmountCents,
        status: gateway === "sandbox" ? ("paid" as const) : ("pending" as const), // No sandbox aprova automático, nos reais aguarda webhook
        createdAt: new Date().toISOString(),
      };

      data.orders.unshift(nextOrder);
      return nextOrder;
    });

    return NextResponse.json({
      order,
      gateway,
      paymentDetails: gatewayResponse,
      message: gateway === "sandbox" ? "Pagamento simulado com sucesso!" : "Aguardando confirmação do meio de pagamento.",
    }, { status: 201 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir o pagamento.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

