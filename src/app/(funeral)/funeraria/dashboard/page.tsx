import Link from "next/link";
import { requireFuneralHomePage } from "@/src/components/funeral/guard";
import { listFuneralHomeMemorials } from "@/src/components/funeral/memorial-data";
import { getCurrentCycleUsage, resolveBillingPlan } from "@/src/components/funeral/funeral-home-data";
import { centsToBRL, currentBillingPeriod, fmtDateLongBR } from "@/src/components/funeral/format";
import { MemorialStatusBadge } from "@/src/components/funeral/status-badge";
import { FuneralEmptyState } from "@/src/components/funeral/empty-state";

export const dynamic = "force-dynamic";

export default async function FuneralOverviewPage() {
  const { funeralHome } = await requireFuneralHomePage();

  const [memorials, plan] = await Promise.all([
    listFuneralHomeMemorials(funeralHome.id),
    resolveBillingPlan(funeralHome),
  ]);
  const usage = plan ? await getCurrentCycleUsage(funeralHome.id, plan) : null;
  const period = currentBillingPeriod();

  const memorialsThisMonth = memorials.filter((m) => m.createdAt >= period.start && m.createdAt < period.end);
  const draftCount = memorials.filter((m) => m.status === "rascunho").length;
  const activeCount = memorials.filter((m) => m.status === "ativo").length;
  const recent = memorials.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-[#e9c349]/80">Visão geral · {period.label}</p>
        <h2 className="text-2xl font-semibold text-white">Olá, {funeralHome.contactName || funeralHome.name}</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon="auto_stories" label="Memoriais este mês" value={String(memorialsThisMonth.length)} />
        <KpiCard icon="qr_code_2" label="QR Codes gerados este mês" value={String(usage?.memorialsCount ?? 0)} />
        <KpiCard
          icon="payments"
          label="Estimativa do ciclo atual"
          value={usage ? centsToBRL(usage.totalCents) : "—"}
          hint={!plan ? "Nenhum plano de cobrança configurado" : undefined}
        />
        <KpiCard
          icon="event_upcoming"
          label="Próxima cobrança"
          value={usage ? fmtDateLongBR(usage.nextChargeDate) : "—"}
        />
      </div>

      {/* Cota do plano mensal */}
      {plan && usage && plan.billingMode === "monthly" && (
        <div className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349]">Plano {plan.name}</p>
              <p className="text-sm text-white/70">
                {centsToBRL(plan.monthlyFeeCents)}/mês · {plan.includedMemorials} memoriais inclusos
                {plan.extraMemorialPriceCents > 0 && <> · excedente {centsToBRL(plan.extraMemorialPriceCents)}/memorial</>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {usage.memorialsCount}/{usage.includedMemorials}
                </p>
                <p className="text-[0.6rem] uppercase tracking-wider text-white/50">usados no ciclo</p>
              </div>
              <div className="w-32">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${usage.extraCount > 0 ? "bg-red-400" : "bg-[#e9c349]"}`}
                    style={{
                      width: `${
                        usage.includedMemorials > 0 ? Math.min(100, (usage.memorialsCount / usage.includedMemorials) * 100) : 100
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-right text-[0.6rem] text-white/40">
                  {usage.extraCount > 0 ? `+${usage.extraCount} excedentes (${centsToBRL(usage.extraFeeCents)})` : "dentro da cota"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {plan && usage && plan.billingMode === "per_qr" && (
        <div className="rounded-xl border border-[#e9c349]/20 bg-[#e9c349]/5 p-5 text-sm text-white/70">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349]">Plano {plan.name}</p>
          <p className="mt-1">
            Sem mensalidade — {centsToBRL(plan.extraMemorialPriceCents)} por memorial publicado. Este mês:{" "}
            <strong className="text-white">{usage.memorialsCount}</strong> memoriais ×{" "}
            {centsToBRL(plan.extraMemorialPriceCents)} = <strong className="text-white">{centsToBRL(usage.totalCents)}</strong>.
          </p>
        </div>
      )}

      {/* Ações rápidas */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/funeraria/dashboard/novo-memorial"
          className="flex items-center gap-3 rounded-xl bg-[#e9c349] px-5 py-4 text-sm font-bold text-[#101414] transition hover:bg-[#ffe28a]"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Cadastrar falecido
        </Link>
        <Link
          href="/funeraria/dashboard/imprimir"
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a192f66] px-5 py-4 text-sm font-semibold text-white transition hover:border-[#e9c349]/30"
        >
          <span className="material-symbols-outlined text-[#e9c349]">qr_code_2</span>
          Imprimir QR Codes
        </Link>
        <Link
          href="/funeraria/dashboard/cobranca"
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a192f66] px-5 py-4 text-sm font-semibold text-white transition hover:border-[#e9c349]/30"
        >
          <span className="material-symbols-outlined text-[#e9c349]">receipt_long</span>
          Ver cobrança completa
        </Link>
      </div>

      {/* Memoriais recentes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Memoriais recentes
            {memorials.length > 0 && (
              <span className="ml-2 text-xs font-normal text-white/40">
                {activeCount} publicados · {draftCount} rascunhos
              </span>
            )}
          </h3>
          {memorials.length > 0 && (
            <Link href="/funeraria/dashboard/memoriais" className="text-xs font-semibold text-[#e9c349] hover:underline">
              Ver todos →
            </Link>
          )}
        </div>

        {memorials.length === 0 ? (
          <FuneralEmptyState
            icon="auto_stories"
            title="Nenhum memorial cadastrado ainda"
            description="Cadastre o primeiro falecido para gerar um memorial digital com QR Code."
            actionHref="/funeraria/dashboard/novo-memorial"
            actionLabel="Cadastrar falecido"
          />
        ) : (
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#0a192f66]">
            {recent.map((m) => (
              <Link
                key={m.id}
                href={`/funeraria/dashboard/novo-memorial/${m.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-white/[0.03]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-white/40">{fmtDateLongBR(m.createdAt)}</p>
                </div>
                <MemorialStatusBadge status={m.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, hint }: { icon: string; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a192f66] p-4">
      <span className="material-symbols-outlined text-xl text-[#e9c349]">{icon}</span>
      <p className="mt-2 text-xl font-bold text-white sm:text-2xl">{value}</p>
      <p className="text-xs text-[#c4c7c7]/60">{label}</p>
      {hint && <p className="mt-1 text-[0.65rem] text-[#c4c7c7]/40">{hint}</p>}
    </div>
  );
}
