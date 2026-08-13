import Link from "next/link";
import { getOwnerStats } from "@/src/lib/owner-stats";

export const dynamic = "force-dynamic";

function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export default async function OwnerOverviewPage() {
  const stats = await getOwnerStats();
  const maxRevenue = Math.max(...stats.monthlySeries.map((m) => m.revenueCents), 1);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.15em] text-tertiary">Painel do dono</p>
        <h1 className="font-h2 text-[clamp(1.75rem,3.5vw,2.5rem)] text-on-surface">Visão geral</h1>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">O que está acontecendo na plataforma agora.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="group" title="Usuários cadastrados" value={stats.users.total.toString()} note={`${stats.users.active30d} ativos nos últimos 30 dias`} />
        <StatCard icon="favorite" title="Memoriais" value={stats.memorials.total.toString()} note={`${stats.memorials.byStatus.ativo} ativos · ${stats.memorials.byStatus.pending_payment} aguardando · ${stats.memorials.byStatus.rascunho} rascunho`} />
        <StatCard icon="qr_code_2" title="QR Codes" value={stats.qrCodes.total.toString()} note={`${stats.qrCodes.scans} escaneamentos no total`} />
        <StatCard icon="attach_money" title="Receita total" value={formatBRL(stats.revenue.totalCents)} note={`${stats.revenue.paidOrdersCount} pedidos pagos`} highlight />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="store" title="Funerárias ativas" value={stats.funeralHomes.active.toString()} note={stats.funeralHomes.pending > 0 ? `${stats.funeralHomes.pending} aguardando aprovação` : "Nenhuma pendência"} href="/painel/funerarias" />
        <StatCard icon="receipt_long" title="Faturas em aberto" value={stats.invoices.openCount.toString()} note={formatBRL(stats.invoices.openTotalCents)} href="/painel/faturas" />
        <StatCard icon="local_shipping" title="Entregas pendentes" value={stats.deliveries.pending.toString()} note="QR Codes a caminho ou por imprimir" href="/painel/entregas" />
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-h3 text-xl text-on-surface">Receita — últimos 6 meses</h2>
        </div>
        <div className="flex min-h-[200px] items-end gap-4 border-b border-outline-variant/20 pb-2">
          {stats.monthlySeries.map((m) => {
            const heightPercent = m.revenueCents > 0 ? Math.max(6, Math.round((m.revenueCents / maxRevenue) * 100)) : 2;
            return (
              <div key={m.key} className="group relative flex h-full w-full flex-col items-center justify-end gap-2">
                <div className="pointer-events-none absolute -top-8 rounded bg-surface-container px-2 py-1 text-[10px] text-tertiary opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {formatBRL(m.revenueCents)}
                </div>
                <div className="relative h-[160px] w-full rounded-t bg-surface-variant/20">
                  <div className="absolute bottom-0 w-full rounded-t bg-tertiary/50 transition-all duration-500 group-hover:bg-tertiary/75" style={{ height: `${heightPercent}%` }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-outline">{m.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
        <h2 className="mb-4 font-h3 text-xl text-on-surface">Memoriais criados por mês</h2>
        <div className="flex min-h-[140px] items-end gap-4">
          {stats.monthlySeries.map((m) => {
            const maxMemorials = Math.max(...stats.monthlySeries.map((x) => x.memorials), 1);
            const heightPercent = m.memorials > 0 ? Math.max(6, Math.round((m.memorials / maxMemorials) * 100)) : 2;
            return (
              <div key={m.key} className="group relative flex h-full w-full flex-col items-center justify-end gap-2">
                <div className="pointer-events-none absolute -top-8 rounded bg-surface-container px-2 py-1 text-[10px] text-tertiary opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {m.memorials}
                </div>
                <div className="relative h-[100px] w-full rounded-t bg-surface-variant/20">
                  <div className="absolute bottom-0 w-full rounded-t bg-secondary/50 transition-all duration-500 group-hover:bg-secondary/75" style={{ height: `${heightPercent}%` }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-outline">{m.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  note,
  highlight,
  href,
}: {
  icon: string;
  title: string;
  value: string;
  note: string;
  highlight?: boolean;
  href?: string;
}) {
  const content = (
    <article className={`rounded-xl border p-5 transition ${highlight ? "border-tertiary/30 bg-tertiary/5" : "border-outline-variant/30 bg-surface-container-low"} ${href ? "hover:border-tertiary/40" : ""}`}>
      <div className="flex items-start justify-between">
        <p className="text-[0.7rem] uppercase tracking-[0.14em] text-outline">{title}</p>
        <span className={`material-symbols-outlined text-[20px] ${highlight ? "text-tertiary" : "text-on-surface-variant"}`}>{icon}</span>
      </div>
      <p className={`mt-3 font-h3 text-2xl ${highlight ? "text-tertiary" : "text-on-surface"}`}>{value}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{note}</p>
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
