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

export type PlatformConfig = {
  ownerCommissionPercent: number;
  defaultPlanId: string;
  plans: PlatformPlan[];
  candlePriceCents: number;
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
