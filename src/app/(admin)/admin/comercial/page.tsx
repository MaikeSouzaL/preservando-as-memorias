import { PriceConfigPanel } from "@/src/components/admin/price-config-panel";
import { BankDataPanel } from "@/src/components/admin/bank-data-panel";
import { readPlatformData, type PlatformOrder } from "@/src/lib/platform-data";
import { estimateStripeFeeCents } from "@/src/lib/platform-types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCommercialPage(props: { searchParams?: Promise<{ tab?: string }> }) {
  const data = await readPlatformData();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const activeTab = searchParams.tab || "visao-geral";

  const paidOrders = data.orders.filter((order) => order.status === "paid");
  const grossRevenue = paidOrders.reduce((sum, order) => sum + order.grossAmountCents, 0);
  const commissionRevenue = paidOrders.reduce((sum, order) => sum + order.platformCommissionCents, 0);
  const adminRepasse = grossRevenue - commissionRevenue;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Admin do sistema</p>
        <h1 className="font-h2 text-[clamp(2rem,4vw,3rem)] text-on-surface">Configuração comercial</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Famílias e funerárias pagam à plataforma. A comissão da plataforma (
          <strong className="text-tertiary">{data.config.ownerCommissionPercent}%</strong>) é calculada sobre o{" "}
          <strong className="text-on-surface">valor bruto</strong> — antes da taxa Stripe. A taxa Stripe
          é descontada do repasse ao parceiro, não da comissão da plataforma.
        </p>
      </header>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container/40 p-1">
        {([
          { id: "visao-geral", label: "Visão Geral", icon: "bar_chart" },
          { id: "banco", label: "Dados Bancários", icon: "account_balance" },
          { id: "planos", label: "Planos e Preços", icon: "sell" },
        ] as const).map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === t.id
                ? "border border-tertiary/20 bg-tertiary/10 text-tertiary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </Link>
        ))}
      </div>

      {activeTab === "visao-geral" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <CommercialTabInfo
            icon="bar_chart"
            title="Visão geral financeira"
            description="Resumo de todos os pedidos pagos na plataforma. A receita bruta é o total cobrado dos clientes. A taxa do sistema é retida pela plataforma (Preservando Memórias). Seu repasse é o valor que você recebe após a dedução da taxa."
          />
          <section className="grid gap-5 md:grid-cols-4">
            <Metric label="Pedidos pagos" value={paidOrders.length.toString()} />
            <Metric label="Receita bruta" value={formatBRL(grossRevenue)} />
            <Metric label={`Seu repasse (${100 - data.config.ownerCommissionPercent}%)`} value={formatBRL(adminRepasse)} highlight />
            <Metric label={`Taxa do sistema (${data.config.ownerCommissionPercent}%)`} value={formatBRL(commissionRevenue)} />
          </section>

          <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Pedidos</p>
                <h2 className="font-h3 text-2xl text-on-surface">Últimas compras registradas</h2>
              </div>
              <p className="text-sm text-on-surface-variant">Pedidos confirmados via Stripe.</p>
            </div>

            {paidOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/50 text-outline">
                      <th className="pb-3 font-normal">Cliente</th>
                      <th className="pb-3 font-normal">Plano</th>
                      <th className="pb-3 font-normal">Pagamento</th>
                      <th className="pb-3 text-right font-normal">Total bruto</th>
                      <th className="pb-3 text-right font-normal text-red-400/70">Taxa Stripe (est.)</th>
                      <th className="pb-3 text-right font-normal text-tertiary/80">Plataforma ({data.config.ownerCommissionPercent}%)</th>
                      <th className="pb-3 text-right font-normal text-emerald-400/70">Repasse parceiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidOrders.slice(0, 8).map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        planName={
                          order.planId === "memorial_familia"
                            ? "Memorial Família"
                            : order.planId === "memorial_funeraria"
                            ? "Memorial Funerária"
                            : (data.config.plans?.find((p) => p.id === order.planId)?.name ?? order.planId)
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-outline-variant/50 p-8 text-center text-on-surface-variant">
                Nenhum pedido registrado ainda.
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === "banco" && (
        <div className="animate-in fade-in duration-500 flex flex-col gap-6">
          <CommercialTabInfo
            icon="account_balance"
            title="Dados bancários para repasse"
            description="Cadastre a conta ou chave PIX para onde os repasses devem ser realizados. O Dev Admin (Maike) usa estas informações para fazer a transferência manual do seu saldo após cada período de pagamento."
          />
          <BankDataPanel
            grossRevenueCents={grossRevenue}
            platformCommissionCents={commissionRevenue}
          />
        </div>
      )}

      {activeTab === "planos" && (
        <div className="animate-in fade-in duration-500 flex flex-col gap-6">
          <CommercialTabInfo
            icon="sell"
            title="Preços e planos da plataforma"
            description="Configure o preço avulso cobrado de famílias e de funerárias sem plano ativo. Também é aqui onde você define os planos de assinatura mensais para funerárias — cada plano tem uma cota de memoriais e um valor de excedente quando ultrapassar a cota."
            tip="Os planos criados aqui ficam disponíveis para atribuição em Funerárias → Planos de assinatura."
          />
          <PriceConfigPanel initialConfig={data.config} />
        </div>
      )}
    </div>
  );
}

function CommercialTabInfo({ icon, title, description, tip }: { icon: string; title: string; description: string; tip?: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-outline-variant/20 bg-surface-variant/20 px-5 py-4">
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-xl text-tertiary">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
        {tip && <p className="mt-1 text-xs text-tertiary/70">💡 {tip}</p>}
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <article className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-outline">{label}</p>
      <p className={`mt-2 font-h3 text-3xl ${highlight ? "text-[#e9c349]" : "text-on-surface"}`}>{value}</p>
    </article>
  );
}

function OrderRow({ order, planName }: { order: PlatformOrder; planName: string }) {
  const method = order.paymentMethod === "pix" ? "pix" : "card";
  const stripeFee = estimateStripeFeeCents(order.grossAmountCents, method);
  const parceiro  = order.operatorAmountCents - stripeFee;

  return (
    <tr className="border-b border-outline-variant/20">
      <td className="py-4">
        <div className="font-medium text-on-surface">{order.userName}</div>
        <div className="text-xs text-outline">{order.userEmail}</div>
      </td>
      <td className="py-4 text-on-surface-variant">{planName}</td>
      <td className="py-4 uppercase text-on-surface-variant">{order.paymentMethod}</td>
      <td className="py-4 text-right text-on-surface">{formatBRL(order.grossAmountCents)}</td>
      <td className="py-4 text-right text-red-400">{formatBRL(stripeFee)}</td>
      <td className="py-4 text-right text-tertiary">{formatBRL(order.platformCommissionCents)}</td>
      <td className="py-4 text-right text-emerald-400">{formatBRL(Math.max(0, parceiro))}</td>
    </tr>
  );
}

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
