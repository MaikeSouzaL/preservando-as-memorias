import Link from "next/link";
import { readPlatformData } from "@/src/lib/platform-data";
import { cycleLabel } from "@/src/lib/platform-types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readPlatformData();

  const invite = (data.config.funeralHomeInvites ?? []).find((i) => i.slug === slug);

  if (!invite || invite.status !== "active") {
    notFound();
  }

  const plan = invite.activePlanId
    ? (data.config.funeralPlans ?? []).find((p) => p.id === invite.activePlanId)
    : null;

  const registerUrl = `/funeraria/cadastro?invite=${slug}`;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0a192f] to-[#0b0f0f] flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#e9c349]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e9c349]/10 border border-[#e9c349]/20 mb-4 shadow-[0_0_30px_rgba(233,195,73,0.1)]">
            <span className="material-symbols-outlined text-3xl text-[#e9c349]">handshake</span>
          </div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c349]">
            Convite exclusivo
          </p>
          <h1 className="mt-1 font-light text-3xl text-white">Preservando Memórias</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a192f66] backdrop-blur-[20px] p-8 shadow-2xl space-y-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#e9c349] mb-1">
              Você foi convidado(a)
            </p>
            <h2 className="text-2xl font-light text-white">{invite.label}</h2>
            {invite.notes && (
              <p className="mt-2 text-sm text-[#c4c7c7]/60">{invite.notes}</p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c4c7c7]/50">
              Condições deste convite
            </p>

            {invite.adminCommissionPercent !== undefined && (
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span className="material-symbols-outlined text-[#e9c349]">percent</span>
                <div>
                  <p className="text-sm text-white font-medium">
                    Comissão de {invite.adminCommissionPercent}%
                  </p>
                  <p className="text-xs text-[#c4c7c7]/50">
                    Percentual aplicado sobre os memoriais criados pela sua funerária
                  </p>
                </div>
              </div>
            )}

            {plan && (
              <div className="flex items-center gap-3 rounded-xl border border-[#e9c349]/15 bg-[#e9c349]/5 px-4 py-3">
                <span className="material-symbols-outlined text-[#e9c349]">star</span>
                <div>
                  <p className="text-sm text-white font-medium">
                    Plano {plan.name} incluído
                  </p>
                  <p className="text-xs text-[#c4c7c7]/50">
                    {plan.description || cycleLabel(plan.cycle)}
                    {plan.memorialLimit != null
                      ? ` · ${plan.memorialLimit} memoriais/mês`
                      : " · Memoriais ilimitados"}
                  </p>
                  {invite.planRenewsAt && (
                    <p className="text-xs text-[#c4c7c7]/50">
                      Válido até {new Date(invite.planRenewsAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!invite.adminCommissionPercent && !plan && (
              <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span className="material-symbols-outlined text-[#c4c7c7]/60">info</span>
                <p className="text-sm text-[#c4c7c7]/60">
                  Condições comerciais serão definidas pelo administrador após aprovação.
                </p>
              </div>
            )}
          </div>

          <Link
            href={registerUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e9c349] px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#0d1010] transition hover:bg-[#ffe28a] shadow-[0_4px_20px_rgba(233,195,73,0.2)]"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            Cadastrar minha funerária
          </Link>

          <p className="text-center text-xs text-[#c4c7c7]/40">
            Já tem cadastro?{" "}
            <Link href="/funeraria/login" className="text-[#e9c349] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
