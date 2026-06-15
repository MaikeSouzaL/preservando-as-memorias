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

      <nav className="flex gap-6 border-b border-outline-variant/30 text-sm font-semibold uppercase tracking-wider overflow-x-auto">
        <Link 
          href="?tab=visao-geral" 
          className={`whitespace-nowrap pb-3 transition-colors ${activeTab === "visao-geral" ? "border-b-2 border-tertiary text-tertiary" : "text-outline hover:text-on-surface"}`}
        >
          Visão Geral
        </Link>
        <Link 
          href="?tab=banco" 
          className={`whitespace-nowrap pb-3 transition-colors ${activeTab === "banco" ? "border-b-2 border-tertiary text-tertiary" : "text-outline hover:text-on-surface"}`}
        >
          Dados Bancários
        </Link>
        <Link 
          href="?tab=planos" 
          className={`whitespace-nowrap pb-3 transition-colors ${activeTab === "planos" ? "border-b-2 border-tertiary text-tertiary" : "text-outline hover:text-on-surface"}`}
        >
          Planos e Preços
        </Link>
      </nav>

      {activeTab === "visao-geral" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
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
        <div className="animate-in fade-in duration-500">
          <BankDataPanel
            grossRevenueCents={grossRevenue}
            platformCommissionCents={commissionRevenue}
          />
        </div>
      )}

      {activeTab === "planos" && (
        <div className="animate-in fade-in duration-500">
          <PriceConfigPanel initialConfig={data.config} />
        </div>
      )}
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
