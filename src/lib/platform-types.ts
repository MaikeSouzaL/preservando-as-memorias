export type BillingCycle = "monthly" | "annual" | "one_time";

export type PlatformPlan = {
  id: string;
  name: string;
  description: string;
  cycle: BillingCycle;
  priceCents: number;
  active: boolean;
  memorialLimit: number | null;
  features: string[];
};

export type FuneralPlan = {
  id: string;
  name: string;
  description: string;
  cycle: BillingCycle;
  priceCents: number;
  active: boolean;
  features: string[];
  modules: {
    memorials: boolean;
    schedules: boolean;
    services: boolean;
    documents: boolean;
    inventory: boolean;
    staff: boolean;
  };
};

export type QrDeliveryMode = "admin" | "self";
export type QrDeliveryOverride = "inherit" | "admin" | "self";

export type PlatformConfig = {
  ownerCommissionPercent: number;
  familyMemorialPriceCents: number;
  funeralHomeMemorialPriceCents: number;
  candlePriceCents: number;
  /**
   * Modo global de entrega do QR Code:
   * "admin" → o admin parceiro é responsável por imprimir e enviar o QR ao familiar.
   *           Famílias PRECISAM preencher endereço de entrega no formulário.
   * "self"  → a família/funerária imprime o próprio QR (padrão).
   */
  qrDeliveryMode?: QrDeliveryMode;
  // Legacy plan fields kept for DB backward compatibility
  defaultPlanId?: string;
  plans?: PlatformPlan[];
  defaultFuneralPlanId?: string;
  funeralPlans?: FuneralPlan[];
};

export type PaymentMethod = "pix" | "card" | "boleto";

export function centsToBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function cycleLabel(cycle: BillingCycle) {
  if (cycle === "monthly") return "mensal";
  if (cycle === "annual") return "anual";
  return "pagamento único";
}

/**
 * Estima a taxa cobrada pelo Stripe (valores de referência para o Brasil).
 * Cartão de crédito nacional: 3,49% + R$0,39 por transação.
 * PIX: 0,99% (sem taxa fixa).
 * IMPORTANTE: use apenas para estimativas; confirme no dashboard Stripe.
 */
export function estimateStripeFeeCents(
  amountCents: number,
  method: "card" | "pix" = "card"
): number {
  if (method === "pix") {
    return Math.round(amountCents * 0.0099);
  }
  // Cartão: 3,49% + R$0,39
  return Math.round(amountCents * 0.0349) + 39;
}

export function calculateCommission(amountCents: number, commissionPercent: number) {
  const platformCommissionCents = Math.round((amountCents * commissionPercent) / 100);
  return {
    platformCommissionCents,
    operatorAmountCents: amountCents - platformCommissionCents,
  };
}

export function couponDiscountPercent(couponCode: string) {
  const normalized = couponCode.trim().toUpperCase();

  if (normalized === "ETERNO10" || normalized === "MEMORIA10") return 10;
  if (normalized === "LEGADO20") return 20;
  return 0;
}

export function calculateOrderTotals(priceCents: number, commissionPercent: number, couponCode = "") {
  const discountPercent = couponDiscountPercent(couponCode);
  const discountCents = Math.round((priceCents * discountPercent) / 100);
  const grossAmountCents = Math.max(0, priceCents - discountCents);
  const commission = calculateCommission(grossAmountCents, commissionPercent);

  return {
    discountPercent,
    discountCents,
    grossAmountCents,
    ...commission,
  };
}
