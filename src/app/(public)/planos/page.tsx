import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";
import { centsToBRL, cycleLabel } from "@/src/lib/platform-types";

export const dynamic = "force-dynamic";

export default async function PlanosPage() {
  const data = await readPlatformData();
  const plans = data.config.plans.filter((plan) => plan.active);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Planos públicos
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Escolha como preservar a história da sua família
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-on-surface-variant">
          Os valores abaixo são os mesmos configurados no painel administrativo. A plataforma calcula automaticamente a comissão de {data.config.ownerCommissionPercent}% sobre cada pedido.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const highlight = plan.id === data.config.defaultPlanId;

          return (
            <article
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                highlight
                  ? "border-tertiary/50 bg-tertiary/5"
                  : "border-outline-variant/40 bg-surface-container/70"
              }`}
            >
              <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">
                {plan.name}
              </p>
              <h2 className="font-h3 text-[2rem] text-tertiary">{centsToBRL(plan.priceCents)}</h2>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-on-surface-variant">{cycleLabel(plan.cycle)}</p>
              <p className="mt-4 text-on-surface-variant">{plan.description}</p>

              <ul className="mt-5 grid gap-2 text-sm text-on-surface-variant">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[1rem] text-tertiary">check</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.id}`}
                className="mt-6 block w-full rounded-full border border-tertiary/50 py-3 text-center text-sm text-tertiary transition hover:bg-tertiary/10"
              >
                Escolher plano
              </Link>
            </article>
          );
        })}
      </section>

      <div className="mt-10 flex justify-center">
        <Link href="/contato" className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary">
          Precisa de ajuda para escolher?
        </Link>
      </div>
    </main>
  );
}

