import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { getCurrentCycleUsage, listInvoices, resolveBillingPlan } from "@/src/components/funeral/funeral-home-data";
import { centsToBRL, fmtDateBR, fmtDateLongBR } from "@/src/components/funeral/format";
import { InvoiceStatusBadge } from "@/src/components/funeral/status-badge";
import { FuneralEmptyState } from "@/src/components/funeral/empty-state";

export const dynamic = "force-dynamic";

const BILLING_MODE_LABEL: Record<string, string> = {
  monthly: "Mensalidade com cota de memoriais",
  per_qr: "Cobrança por memorial gerado",
};

export default async function CobrancaPage() {
  const { funeralHome } = await requireFuneralHomePage();
  const plan = await resolveBillingPlan(funeralHome);
  const [usage, invoices] = await Promise.all([
    plan ? getCurrentCycleUsage(funeralHome.id, plan) : Promise.resolve(null),
    listInvoices(funeralHome.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Cobrança</p>
        <h2 className="text-2xl font-semibold text-white">Seu plano e faturas</h2>
      </div>

      {!plan ? (
        <FuneralEmptyState
          icon="receipt_long"
          title="Nenhum plano de cobrança configurado"
          description="Fale com o administrador da plataforma para ativar um plano de cobrança para sua conta."
        />
      ) : (
        <>
          {/* Plano */}
          <section className="rounded-xl border border-white/10 bg-[#0a192f66] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349]">Plano atual</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#c4c7c7]/60">{BILLING_MODE_LABEL[plan.billingMode]}</p>
                {plan.description && <p className="mt-2 max-w-lg text-sm text-[#c4c7c7]/50">{plan.description}</p>}
              </div>
              <div className="flex gap-6 text-right">
                {plan.billingMode === "monthly" && (
                  <div>
                    <p className="text-lg font-bold text-white">{centsToBRL(plan.monthlyFeeCents)}</p>
                    <p className="text-[0.65rem] uppercase tracking-wider text-white/40">por mês</p>
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-white">
                    {plan.billingMode === "monthly" ? plan.includedMemorials : 0}
                  </p>
                  <p className="text-[0.65rem] uppercase tracking-wider text-white/40">inclusos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{centsToBRL(plan.extraMemorialPriceCents)}</p>
                  <p className="text-[0.65rem] uppercase tracking-wider text-white/40">
                    {plan.billingMode === "monthly" ? "por excedente" : "por memorial"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ciclo atual — o que exatamente está sendo cobrado */}
          {usage && (
            <section className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349]">
                    Ciclo atual · {usage.periodLabel}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Estimativa com base no uso até agora. A fatura oficial é fechada pela plataforma no início do próximo ciclo.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{centsToBRL(usage.totalCents)}</p>
                  <p className="text-[0.65rem] uppercase tracking-wider text-white/40">
                    vence {fmtDateLongBR(usage.nextChargeDate)}
                  </p>
                </div>
              </div>

              <dl className="grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
                {usage.billingMode === "monthly" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Mensalidade base</dt>
                    <dd className="font-medium text-white">{centsToBRL(usage.baseFeeCents)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Memoriais publicados no ciclo</dt>
                  <dd className="font-medium text-white">{usage.memorialsCount}</dd>
                </div>
                {usage.billingMode === "monthly" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Inclusos no plano</dt>
                    <dd className="font-medium text-white">{usage.includedMemorials}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">{usage.billingMode === "monthly" ? "Excedentes" : "Cobrados por memorial"}</dt>
                  <dd className="font-medium text-white">
                    {usage.extraCount} × {centsToBRL(plan.extraMemorialPriceCents)} = {centsToBRL(usage.extraFeeCents)}
                  </dd>
                </div>
              </dl>
            </section>
          )}

          {/* Faturas */}
          <section>
            <h3 className="mb-4 text-lg font-semibold text-white">Faturas</h3>
            {invoices.length === 0 ? (
              <FuneralEmptyState
                icon="receipt_long"
                title="Nenhuma fatura emitida ainda"
                description="Faturas aparecem aqui quando a plataforma fecha um ciclo de cobrança do seu plano."
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03] text-[0.65rem] uppercase tracking-wider text-white/40">
                      <th className="px-4 py-3">Período</th>
                      <th className="px-4 py-3">Memoriais</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Vencimento</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="text-white/80">
                        <td className="px-4 py-3">
                          {fmtDateBR(inv.periodStart)} – {fmtDateBR(inv.periodEnd)}
                        </td>
                        <td className="px-4 py-3">
                          {inv.memorialsCount}
                          {inv.extraCount > 0 && <span className="text-white/40"> ({inv.extraCount} excedentes)</span>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{centsToBRL(inv.totalCents)}</td>
                        <td className="px-4 py-3">{fmtDateBR(inv.dueDate)}</td>
                        <td className="px-4 py-3">
                          <InvoiceStatusBadge status={inv.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
