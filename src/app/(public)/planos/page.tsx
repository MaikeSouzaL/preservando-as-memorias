import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";
import { centsToBRL, cycleLabel } from "@/src/lib/platform-types";

export const dynamic = "force-dynamic";

export default async function PlanosPage() {
  const data = await readPlatformData();
  const plans = (data.config.plans ?? []).filter((plan) => plan.active);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-gutter py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-tertiary">
          Planos públicos
        </p>
        <h1 className="font-h2 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-on-surface">
          Escolha como preservar a história da sua família
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">
          Memoriais eternos, galeria de fotos, linha do tempo e muito mais. Escolha o plano que melhor se adapta à sua família.
        </p>
      </header>

      {plans.length === 0 ? (
        /* Estado vazio: admin ainda não configurou os planos */
        <div className="flex flex-col items-center gap-8 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#e9c349]/20 bg-[#e9c349]/5">
            <span className="material-symbols-outlined text-4xl text-[#e9c349]/50">
              local_fire_department
            </span>
          </div>
          <div className="max-w-md">
            <h2 className="font-serif text-2xl font-light text-on-surface">
              Em breve por aqui
            </h2>
            <p className="mt-3 text-on-surface-variant">
              Nossos planos estão sendo preparados. Entre em contato para saber mais sobre como preservar a memória do seu ente querido.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contato"
              className="flex items-center gap-2 rounded-full bg-[#e9c349] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe088]"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Falar com a equipe
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-outline-variant/40 px-6 py-3 text-sm text-on-surface-variant transition hover:border-outline-variant hover:text-on-surface"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const highlight = plan.id === data.config.defaultPlanId;

              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    highlight
                      ? "border-tertiary/50 bg-tertiary/5"
                      : "border-outline-variant/40 bg-surface-container/70"
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e9c349] px-4 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-[#0d1010]">
                      Mais popular
                    </span>
                  )}

                  <p className="mb-2 font-label-caps text-[0.75rem] uppercase tracking-[0.15em] text-on-surface-variant">
                    {plan.name}
                  </p>
                  <h2 className="font-h3 text-[2rem] text-tertiary">
                    {centsToBRL(plan.priceCents)}
                  </h2>
                  <p className="mt-1 text-sm uppercase tracking-[0.14em] text-on-surface-variant">
                    {cycleLabel(plan.cycle)}
                  </p>
                  <p className="mt-4 text-on-surface-variant">{plan.description}</p>

                  <ul className="mt-5 grid flex-1 gap-2 text-sm text-on-surface-variant">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[1rem] text-tertiary">
                          check
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout?plan=${plan.id}`}
                    className={`mt-6 block w-full rounded-full py-3 text-center text-sm transition ${
                      highlight
                        ? "bg-[#e9c349] font-bold uppercase tracking-widest text-[#0d1010] hover:bg-[#ffe088]"
                        : "border border-tertiary/50 text-tertiary hover:bg-tertiary/10"
                    }`}
                  >
                    Escolher plano
                  </Link>
                </article>
              );
            })}
          </section>

          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <Link
              href="/contato"
              className="rounded-full border border-outline-variant/60 px-5 py-2 text-on-surface-variant transition hover:border-tertiary/50 hover:text-tertiary"
            >
              Precisa de ajuda para escolher?
            </Link>
            <p className="text-xs text-on-surface-variant/40">
              Pagamentos processados com segurança. Cancele quando quiser.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
