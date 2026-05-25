"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  calculateOrderTotals,
  centsToBRL,
  cycleLabel,
  type PaymentMethod,
  type PlatformConfig,
  type PlatformPlan,
} from "@/src/lib/platform-types";

type CheckoutOrder = {
  id: string;
  planId: string;
  grossAmountCents: number;
  discountCents: number;
  platformCommissionCents: number;
  operatorAmountCents: number;
};

const emptyForm = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan") ?? "";
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [formData, setFormData] = useState(emptyForm);
  const [discountCode, setDiscountCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    fetch("/api/platform-config")
      .then((response) => response.json())
      .then((payload) => setConfig(payload.config))
      .catch(() => setError("Não foi possível carregar os planos agora."));
  }, []);

  const activePlans = useMemo(() => config?.plans.filter((plan) => plan.active) ?? [], [config]);
  const selectedPlan = useMemo(() => {
    if (!config) return null;
    const normalizedRequest = requestedPlan.toLowerCase();

    return (
      activePlans.find((plan) => plan.id === requestedPlan) ??
      activePlans.find((plan) => plan.name.toLowerCase() === normalizedRequest) ??
      activePlans.find((plan) => plan.id === config.defaultPlanId) ??
      activePlans[0] ??
      null
    );
  }, [activePlans, config, requestedPlan]);

  const previewTotals = useMemo(() => {
    if (!selectedPlan || !config) return null;
    return calculateOrderTotals(selectedPlan.priceCents, config.ownerCommissionPercent, discountCode);
  }, [config, discountCode, selectedPlan]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        planId: selectedPlan.id,
        paymentMethod,
        discountCode,
      }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Não foi possível confirmar a assinatura.");
      return;
    }

    setOrder(payload.order);
  }

  if (!config || !selectedPlan || !previewTotals) {
    return <CheckoutLoading message={error || "Carregando planos..."} />;
  }

  if (order) {
    return <CheckoutSuccess order={order} plan={selectedPlan} />;
  }

  return (
    <div className="relative min-h-screen bg-[#101414] text-[#e0e3e2] selection:bg-[#e9c349]/20 selection:text-[#e9c349]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#e9c349]/3 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#e9c349]/2 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-container-max px-gutter py-28">
        <header className="mb-12">
          <Link href="/planos" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#e9c349] hover:underline">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar para planos
          </Link>
          <h1 className="mt-4 font-h1 text-[clamp(2.2rem,5vw,3.5rem)] font-light leading-[1.1] text-[#e5e2e1]">
            Finalize sua <span className="italic text-[#e9c349]">assinatura</span>
          </h1>
          <p className="mt-2 text-[#c4c7c7]">
            O pedido será registrado no painel administrativo e a comissão de {config.ownerCommissionPercent}% será calculada automaticamente.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-7">
            <section className="rounded-xl border border-white/5 bg-[#1c2020]/40 p-6 backdrop-blur-md">
              <h2 className="mb-6 flex items-center gap-3 font-h3 text-xl text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#e9c349]">person</span>
                1. Dados do cliente
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <TextInput label="Nome completo" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: João da Silva" />
                <TextInput label="E-mail" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Ex: joao@email.com" />
                <TextInput label="CPF" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" />
                <TextInput label="Celular / WhatsApp" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(11) 99999-0000" />
              </div>
            </section>

            <section className="rounded-xl border border-white/5 bg-[#1c2020]/40 p-6 backdrop-blur-md">
              <h2 className="mb-6 flex items-center gap-3 font-h3 text-xl text-[#e5e2e1]">
                <span className="material-symbols-outlined text-[#e9c349]">credit_card</span>
                2. Método de pagamento
              </h2>

              <div className="mb-8 grid grid-cols-3 gap-4">
                <PaymentButton current={paymentMethod} value="pix" label="Pix" icon="qr_code" onClick={setPaymentMethod} />
                <PaymentButton current={paymentMethod} value="card" label="Cartão" icon="credit_card" onClick={setPaymentMethod} />
                <PaymentButton current={paymentMethod} value="boleto" label="Boleto" icon="receipt" onClick={setPaymentMethod} />
              </div>

              {paymentMethod === "pix" ? (
                <PaymentInfo icon="qr_code_2" title="Pagamento instantâneo com Pix">
                  O QR Code de pagamento será gerado pelo gateway real na próxima etapa de integração. Neste MVP, o pedido é registrado como pago para validar o fluxo.
                </PaymentInfo>
              ) : null}

              {paymentMethod === "card" ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <TextInput label="Número do cartão" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" required />
                  <TextInput label="Nome do titular" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder="JOÃO H S ALMEIDA" required />
                  <TextInput label="Validade" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/AA" required />
                  <TextInput label="Código CVC" name="cardCvc" value={formData.cardCvc} onChange={handleInputChange} placeholder="123" required />
                </div>
              ) : null}

              {paymentMethod === "boleto" ? (
                <PaymentInfo icon="barcode" title="Pagamento por boleto">
                  O boleto real será emitido pelo gateway. Por enquanto, a confirmação registra o pedido para o painel comercial.
                </PaymentInfo>
              ) : null}
            </section>

            {error ? <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#e9c349] py-4 text-center text-xs font-semibold uppercase tracking-widest text-[#1c1b1b] transition-all hover:bg-[#ffe088] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">{isSubmitting ? "hourglass_top" : "lock"}</span>
              {isSubmitting ? "Registrando pagamento..." : `Confirmar assinatura - ${centsToBRL(previewTotals.grossAmountCents)}`}
            </button>
          </form>

          <aside className="space-y-6 lg:col-span-5">
            <OrderSummary
              plan={selectedPlan}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              totals={previewTotals}
              commissionPercent={config.ownerCommissionPercent}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

function CheckoutSuccess({ order, plan }: { order: CheckoutOrder; plan: PlatformPlan }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#101414] px-4 py-20 text-[#e0e3e2]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image src="/images/hero-bg.png" alt="" fill className="object-cover opacity-20 blur-[4px]" />
        <div className="absolute inset-0 bg-[#101414]/90 backdrop-blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#e9c349]/20 bg-[#1c2020]/80 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9c349]/10 text-[#e9c349]">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <h1 className="font-h2 text-3xl font-light text-[#e5e2e1]">Assinatura ativada</h1>
        <p className="mt-4 text-[#c4c7c7]">
          O pedido <strong className="text-[#e9c349]">{order.id}</strong> foi registrado para o plano <strong className="text-[#e9c349]">{plan.name}</strong>.
        </p>

        <div className="my-6 grid gap-3 rounded-lg border border-white/5 bg-[#0b0f0f]/40 p-4 text-left text-sm">
          <SummaryLine label="Total pago" value={centsToBRL(order.grossAmountCents)} strong />
          <SummaryLine label="Comissão da plataforma" value={centsToBRL(order.platformCommissionCents)} />
          <SummaryLine label="Repasse ao operador" value={centsToBRL(order.operatorAmountCents)} />
        </div>

        <Link href="/dashboard" className="block w-full rounded-full bg-[#e9c349] py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#1c1b1b] transition hover:bg-[#ffe088]">
          Ir para o dashboard
        </Link>
      </div>
    </div>
  );
}

function OrderSummary({
  plan,
  totals,
  discountCode,
  setDiscountCode,
  commissionPercent,
}: {
  plan: PlatformPlan;
  totals: ReturnType<typeof calculateOrderTotals>;
  discountCode: string;
  setDiscountCode: (value: string) => void;
  commissionPercent: number;
}) {
  return (
    <div className="rounded-xl border border-[#e9c349]/15 bg-[#1c2020]/70 p-6 shadow-xl backdrop-blur-md">
      <h2 className="mb-4 font-h3 text-xl text-[#e5e2e1]">Resumo da compra</h2>

      <div className="border-b border-white/5 pb-4">
        <p className="text-xs uppercase tracking-wider text-[#c4c7c7]/50">Plano selecionado</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h3 className="font-h3 text-lg text-[#e9c349]">{plan.name}</h3>
          <span className="text-right font-semibold text-[#e5e2e1]">
            {centsToBRL(plan.priceCents)}
            <small className="block text-xs font-normal text-[#c4c7c7]/70">{cycleLabel(plan.cycle)}</small>
          </span>
        </div>
        <p className="mt-1 text-sm text-[#c4c7c7]/80">{plan.description}</p>
      </div>

      <ul className="my-5 space-y-3 border-b border-white/5 pb-5 text-sm text-[#c4c7c7]/80">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span className="material-symbols-outlined text-base text-[#e9c349]">check</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mb-5 border-b border-white/5 pb-5">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]/50">Cupom de desconto</label>
        <input
          type="text"
          value={discountCode}
          onChange={(event) => setDiscountCode(event.target.value)}
          placeholder="Ex: MEMORIA10"
          className="w-full rounded border border-white/10 bg-transparent px-3 py-2 text-xs uppercase tracking-widest text-[#e5e2e1] outline-none focus:border-[#e9c349]/40"
        />
        {totals.discountPercent > 0 ? (
          <p className="mt-2 text-xs text-[#e9c349]">{totals.discountPercent}% de desconto aplicado.</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <SummaryLine label="Subtotal" value={centsToBRL(plan.priceCents)} />
        {totals.discountCents > 0 ? <SummaryLine label="Desconto" value={`- ${centsToBRL(totals.discountCents)}`} /> : null}
        <SummaryLine label="Total" value={centsToBRL(totals.grossAmountCents)} strong />
        <SummaryLine label={`Comissão ${commissionPercent}%`} value={centsToBRL(totals.platformCommissionCents)} />
        <SummaryLine label="Repasse ao operador" value={centsToBRL(totals.operatorAmountCents)} />
      </div>
    </div>
  );
}

function TextInput({
  label,
  required = true,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-wider text-[#c4c7c7]/80">{label}</span>
      <input
        {...props}
        required={required}
        className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-[#e5e2e1] placeholder-white/20 outline-none transition-all focus:border-b-[#e9c349]"
      />
    </label>
  );
}

function PaymentButton({
  current,
  value,
  label,
  icon,
  onClick,
}: {
  current: PaymentMethod;
  value: PaymentMethod;
  label: string;
  icon: string;
  onClick: (value: PaymentMethod) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-2 rounded-lg border py-4 transition-all ${
        active ? "border-[#e9c349] bg-[#e9c349]/5 text-[#e9c349]" : "border-white/5 bg-[#0b0f0f]/30 text-[#c4c7c7] hover:border-white/10"
      }`}
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function PaymentInfo({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-white/5 bg-[#0b0f0f]/50 p-6 text-center">
      <span className="material-symbols-outlined mb-2 text-5xl text-[#e9c349] opacity-80">{icon}</span>
      <h3 className="font-h3 text-lg text-[#e5e2e1]">{title}</h3>
      <p className="mx-auto max-w-md text-sm text-on-surface-variant">{children}</p>
    </div>
  );
}

function SummaryLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 text-sm ${strong ? "border-t border-white/5 pt-3 text-base font-semibold text-[#e5e2e1]" : "text-[#c4c7c7]/80"}`}>
      <span>{label}</span>
      <span className={strong ? "font-h2 text-xl text-[#e9c349]" : "text-[#e5e2e1]"}>{value}</span>
    </div>
  );
}

function CheckoutLoading({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#101414] text-[#e9c349]">
      <span className="font-label-caps text-xs uppercase tracking-widest">{message}</span>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading message="Carregando checkout..." />}>
      <CheckoutContent />
    </Suspense>
  );
}

