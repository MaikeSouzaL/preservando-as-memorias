import { PriceConfigPanel } from "@/src/components/admin/price-config-panel";
import { BankDataPanel } from "@/src/components/admin/bank-data-panel";
import { readPlatformData, type PlatformOrder } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function AdminCommercialPage() {
  const data = await readPlatformData();
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
          Famílias e funerárias pagam à plataforma. O Stripe coleta 100%, distribui {100 - data.config.ownerCommissionPercent}% ao administrador e
          retém {data.config.ownerCommissionPercent}% como taxa do sistema.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-4">
        <Metric label="Pedidos pagos" value={paidOrders.length.toString()} />
        <Metric label="Receita bruta" value={formatBRL(grossRevenue)} />
        <Metric label={`Seu repasse (${100 - data.config.ownerCommissionPercent}%)`} value={formatBRL(adminRepasse)} highlight />
        <Metric label={`Taxa do sistema (${data.config.ownerCommissionPercent}%)`} value={formatBRL(commissionRevenue)} />
      </section>

      <BankDataPanel
        grossRevenueCents={grossRevenue}
        platformCommissionCents={commissionRevenue}
      />

      <PriceConfigPanel initialConfig={data.config} />

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
                  <th className="pb-3 text-right font-normal">Total</th>
                  <th className="pb-3 text-right font-normal">Taxa {data.config.ownerCommissionPercent}% (sistema)</th>
                  <th className="pb-3 text-right font-normal">Repasse {100 - data.config.ownerCommissionPercent}% (admin)</th>
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
  return (
    <tr className="border-b border-outline-variant/20">
      <td className="py-4">
        <div className="font-medium text-on-surface">{order.userName}</div>
        <div className="text-xs text-outline">{order.userEmail}</div>
      </td>
      <td className="py-4 text-on-surface-variant">{planName}</td>
      <td className="py-4 uppercase text-on-surface-variant">{order.paymentMethod}</td>
      <td className="py-4 text-right text-on-surface">{formatBRL(order.grossAmountCents)}</td>
      <td className="py-4 text-right text-tertiary">{formatBRL(order.platformCommissionCents)}</td>
      <td className="py-4 text-right text-[#e9c349]">{formatBRL(order.operatorAmountCents)}</td>
    </tr>
  );
}

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
