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
  /** Quantos memoriais a funerária pode criar por mês. null = ilimitado. */
  memorialLimit?: number | null;
  /** Preço em centavos por memorial adicional acima do limite mensal. */
  extraMemorialPriceCents?: number;
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

export type FuneralHomeInvite = {
  id: string;
  slug: string;
  label: string;
  /** % da comissão do Admin Parceiro sobre esta funerária (sobrepõe o padrão) */
  adminCommissionPercent?: number;
  /** ID do plano pré-atribuído ao se cadastrar via este link */
  activePlanId?: string | null;
  /** Data de renovação do plano pré-atribuído */
  planRenewsAt?: string | null;
  notes?: string;
  status: "active" | "used" | "expired";
  createdAt: string;
  usedByFuneralHomeId?: string | null;
  usedAt?: string | null;
};

export type PlatformConfig = {
  ownerCommissionPercent: number;
  familyMemorialPriceCents: number;
  funeralHomeMemorialPriceCents: number;
  candlePriceCents: number;
  /**
   * Modo global de entrega do QR Code para FAMÍLIAS:
   * "admin" → o admin parceiro imprime e envia o QR para a família.
   * "self"  → a família imprime o próprio QR (padrão).
   */
  qrDeliveryMode?: QrDeliveryMode;
  /**
   * Modo global de entrega do QR Code para FUNERÁRIAS:
   * "admin" → o admin parceiro imprime e envia o QR para a funerária.
   * "self"  → a funerária imprime o próprio QR (padrão).
   */
  funeralHomeQrDeliveryMode?: QrDeliveryMode;
  // Legacy plan fields kept for DB backward compatibility
  defaultPlanId?: string;
  plans?: PlatformPlan[];
  defaultFuneralPlanId?: string;
  funeralPlans?: FuneralPlan[];
  funeralHomeInvites?: FuneralHomeInvite[];
  /**
   * Quando true (padrão), homenagens criadas no memorial público entram já
   * aprovadas. Quando false, entram pendentes e precisam ser liberadas em
   * Moderação antes de aparecer publicamente.
   */
  autoApproveTributes?: boolean;
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

/**
 * O papel de "representante/operador" foi extinto. Numa venda ao familiar o
 * valor é integralmente da plataforma — não há mais split de 15/85.
 *
 * `operatorAmountCents` fica zerado por compatibilidade com pedidos antigos
 * que ainda leem esse campo.
 */
export function calculateCommission(amountCents: number, _commissionPercent?: number) {
  return {
    platformCommissionCents: amountCents,
    operatorAmountCents: 0,
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

/**
 * Venda intermediada por funerária.
 *
 * O split em cascata de 3 níveis (dono → operador → funerária) acabou junto com
 * o papel de operador. Agora a relação com a funerária é uma assinatura: ela
 * paga mensalidade ou por QR gerado, cobrado via `funeral_invoices` — não sai
 * uma fatia de cada venda.
 *
 * Quando o pagamento passa pela plataforma, o valor é integralmente dela.
 */
export function calculateCascadeOrderTotals(
  grossAmountCents: number,
  _adminCommissionPercent?: number,
  _devAdminPercent?: number
) {
  return {
    adminParceiroGrossCents: 0,
    devAdminAmountCents: grossAmountCents,
    adminParceiroNetCents: 0,
    funeralHomeAmountCents: 0,
    platformCommissionCents: grossAmountCents,
    operatorAmountCents: 0,
    funeralHomeCommissionCents: 0,
  };
}
