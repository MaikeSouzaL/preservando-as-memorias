import { redirect } from "next/navigation";
import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";
import { getAuthSession } from "@/src/lib/auth-session";
import { isDevAdmin, getDevAdminEmail } from "@/src/lib/dev-auth";
import { PlatformAdminPanel } from "@/src/components/dev/platform-admin-panel";

export const dynamic = "force-dynamic";

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function paymentLabel(method: string) {
  const map: Record<string, string> = { pix: "PIX", card: "Cartão", boleto: "Boleto" };
  return map[method] ?? method;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default async function DevPage() {
  const session = await getAuthSession();
  if (!session || !isDevAdmin(session.email)) redirect("/login");

  const data = await readPlatformData();
  const paidOrders = data.orders.filter((o) => o.status === "paid");

  const grossRevenue = paidOrders.reduce((s, o) => s + o.grossAmountCents, 0);
  const systemCut = paidOrders.reduce((s, o) => s + o.platformCommissionCents, 0);
  const adminRepasse = grossRevenue - systemCut;

  const recentOrders = [...paidOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <main className="min-h-dvh bg-[#0c1117] text-on-surface">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-tertiary/10 bg-[#0c1117]/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e9c349]/15">
            <span className="material-symbols-outlined text-base text-[#e9c349]">construction</span>
          </div>
          <span className="text-sm font-semibold text-on-surface">Dev Console</span>
          <span className="rounded-full bg-[#e9c349]/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-[#e9c349]">
            Sistema
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-on-surface-variant transition hover:text-on-surface"
          >
            Painel Admin →
          </Link>
          <span className="text-xs text-on-surface-variant">{getDevAdminEmail()}</span>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Header */}
        <header>
          <p className="mb-1 text-[0.75rem] uppercase tracking-[0.15em] text-[#e9c349]">
            Desenvolvedor do sistema
          </p>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-light text-on-surface">
            Painel de controle
          </h1>
          <p className="mt-2 text-on-surface-variant">
            Você recebe <strong className="text-[#e9c349]">15%</strong> de todas as vendas. O operador da
            plataforma gerencia o restante.
          </p>
        </header>

        {/* Métricas do sistema */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Pedidos pagos" value={paidOrders.length.toString()} icon="receipt_long" />
          <MetricCard label="Receita bruta" value={brl(grossRevenue)} icon="payments" />
          <MetricCard
            label="Meu repasse (15%)"
            value={brl(systemCut)}
            icon="account_balance_wallet"
            highlight
          />
          <MetricCard label="Repasse admin (85%)" value={brl(adminRepasse)} icon="send_money" />
        </section>

        {/* Admin da plataforma */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-medium text-on-surface">Administrador da plataforma</h2>
            <p className="text-sm text-on-surface-variant">
              Designa quem tem acesso ao painel admin e recebe 85% das vendas.
            </p>
          </div>
          <PlatformAdminPanel
            grossRevenueCents={grossRevenue}
            systemCutCents={systemCut}
            adminRepasseCents={adminRepasse}
          />
        </section>

        {/* Tabela de vendas */}
        <section className="rounded-xl border border-tertiary/10 bg-[#0a192f66] p-6">
          <div className="mb-5">
            <h2 className="text-xl font-medium text-on-surface">Todas as vendas</h2>
            <p className="text-sm text-on-surface-variant">Últimas {recentOrders.length} transações pagas.</p>
          </div>

          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-on-surface-variant">Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-outline">
                    <th className="pb-3 font-normal">Cliente</th>
                    <th className="pb-3 font-normal">Plano</th>
                    <th className="pb-3 font-normal">Pagamento</th>
                    <th className="pb-3 font-normal">Data</th>
                    <th className="pb-3 text-right font-normal">Total</th>
                    <th className="pb-3 text-right font-normal text-[#e9c349]">Meu 15%</th>
                    <th className="pb-3 text-right font-normal">Admin 85%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-on-surface">{order.userName}</p>
                        <p className="text-xs text-on-surface-variant">{order.userEmail}</p>
                      </td>
                      <td className="py-3 pr-4 capitalize text-on-surface-variant">{order.planId}</td>
                      <td className="py-3 pr-4 text-on-surface-variant">{paymentLabel(order.paymentMethod)}</td>
                      <td className="py-3 pr-4 text-on-surface-variant">{formatDate(order.createdAt)}</td>
                      <td className="py-3 pr-4 text-right text-on-surface">{brl(order.grossAmountCents)}</td>
                      <td className="py-3 pr-4 text-right font-semibold text-[#e9c349]">
                        {brl(order.platformCommissionCents)}
                      </td>
                      <td className="py-3 text-right text-on-surface-variant">
                        {brl(order.operatorAmountCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-[#e9c349]/30 bg-[#e9c349]/5"
          : "border-tertiary/10 bg-surface-container/40"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`material-symbols-outlined text-xl ${highlight ? "text-[#e9c349]" : "text-on-surface-variant"}`}
        >
          {icon}
        </span>
        <p className="text-[0.7rem] uppercase tracking-[0.1em] text-on-surface-variant">{label}</p>
      </div>
      <p className={`text-2xl font-semibold ${highlight ? "text-[#e9c349]" : "text-on-surface"}`}>{value}</p>
    </div>
  );
}
