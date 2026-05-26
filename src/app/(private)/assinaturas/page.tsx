import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export default async function AssinaturasPage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  const data = await readPlatformData();
  const { config } = data;
  const orders = data.orders.filter((order) => session.isAdmin || order.userEmail.toLowerCase().trim() === session.email);
  const memorials = data.memorials.filter(
    (memorial) => memorial.id !== "default" && (session.isAdmin || memorial.ownerId.toLowerCase().trim() === session.email)
  );

  const activePlans = config.plans.filter((p) => p.active);

  // Determinar a assinatura ativa simulando com base nas ordens pagas reais ou no primeiro plano ativo
  const lastPaidOrder = [...orders].filter((o) => o.status === "paid").pop();
  const currentPlan = activePlans.find((p) => p.id === lastPaidOrder?.planId) || activePlans[0];

  const renewDate = lastPaidOrder
    ? new Date(new Date(lastPaidOrder.createdAt).setMonth(new Date(lastPaidOrder.createdAt).getMonth() + 1))
    : new Date(new Date().setMonth(new Date().getMonth() + 1));

  const formatPrice = (priceCents: number, cycle: string) => {
    const value = (priceCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    if (cycle === "monthly") return `${value}/mês`;
    if (cycle === "annual") return `${value}/ano`;
    return `${value} (único)`;
  };

  const featuredImageUrl = memorials[0]?.imageUrl || "/images/hero-bg.png";

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#121212]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#0a192f]/50 to-[#121212]" />
        <div className="absolute left-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-tertiary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-tertiary/5 blur-[100px]" />
      </div>

      <main className="flex flex-col gap-24 pb-section-gap">
        <section className="flex min-h-[50vh] flex-col items-center gap-10 lg:min-h-[60vh] lg:flex-row">
          <div className="z-10 flex flex-1 flex-col gap-6">
            <div className="w-fit rounded-full border border-inverse-surface/20 bg-inverse-surface/5 px-3 py-1">
              <span className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Planos e Assinaturas</span>
            </div>

            <h1 className="font-h1 text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.1] text-on-surface">
              Preserve Memórias <br />
              <span className="italic text-tertiary">Eternamente</span>
            </h1>

            <p className="max-w-xl text-body-lg text-on-surface-variant">
              Escolha o plano ideal para eternizar histórias, sentimentos e legados familiares com segurança para as próximas gerações.
            </p>
          </div>

          <div className="relative w-full flex-1 h-[300px] md:h-[400px] overflow-hidden rounded-xl border border-tertiary/10 bg-[#0a192f]/40 p-2 shadow-2xl backdrop-blur-md">
            <Image
              src={featuredImageUrl}
              alt="Memorial digital premium"
              fill
              className="rounded-lg object-cover opacity-85 mix-blend-luminosity transition-all duration-700 hover:opacity-100 hover:mix-blend-normal"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 to-transparent" />
          </div>
        </section>

        {currentPlan && (
          <section className="rounded-2xl border border-tertiary/15 bg-[#0a192f]/35 p-8 backdrop-blur-md">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">Plano Ativo</p>
                <h2 className="font-h3 text-[1.9rem] text-on-surface">{currentPlan.name}</h2>
              </div>
              <p className="text-on-surface-variant">
                {currentPlan.cycle === "one_time" ? "Acesso Vitalício Garantido" : `Próxima Renovação: ${renewDate.toLocaleDateString("pt-BR")}`}
              </p>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {currentPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[1rem] text-tertiary">check</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 border-t border-tertiary/10 pt-6">
              <Link href="/planos" className="rounded-full bg-tertiary px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-on-tertiary transition hover:bg-tertiary-fixed">
                Mudar de Plano
              </Link>
            </div>
          </section>
        )}

        <section>
          <div className="mb-8 text-center">
            <h2 className="font-h2 text-[clamp(2rem,4vw,2.8rem)] font-light italic text-tertiary">
              Algumas histórias merecem viver para sempre.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {activePlans.map((plan) => {
              const isCurrent = plan.id === currentPlan?.id;

              return (
                <article
                  key={plan.name}
                  className={`rounded-2xl border p-7 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 ${
                    isCurrent
                      ? "border-tertiary bg-tertiary/5 shadow-[0_0_20px_rgba(233,195,73,0.12)]"
                      : "border-tertiary/10 bg-[#0a192f]/35"
                  }`}
                >
                  <p className="mb-2 text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">{plan.name}</p>
                  <h3 className="font-h3 text-[2rem] text-tertiary">{formatPrice(plan.priceCents, plan.cycle)}</h3>
                  <p className="mt-2 text-on-surface-variant text-sm min-h-[40px]">{plan.description}</p>

                  <ul className="mt-5 grid gap-2 text-sm text-on-surface-variant">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[1rem] text-tertiary">check</span>
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={isCurrent ? "#" : `/checkout?plan=${plan.name}`}
                    className={`mt-6 block w-full rounded-full py-3 text-center text-xs uppercase tracking-[0.13em] font-semibold transition-all ${
                      isCurrent
                        ? "border border-tertiary bg-tertiary/10 text-tertiary"
                        : "border border-tertiary/50 text-tertiary hover:bg-tertiary/10"
                    }`}
                  >
                    {isCurrent ? "Plano Atual" : "Escolher Plano"}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

