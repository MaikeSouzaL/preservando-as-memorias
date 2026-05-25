import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData, updatePlatformData, type BillingCycle } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

const validCycles: BillingCycle[] = ["monthly", "annual", "one_time"];

function toCents(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

export async function GET() {
  const data = await readPlatformData();
  const session = await getAuthSession();

  return NextResponse.json({
    config: data.config,
    ...(session?.isAdmin ? { orders: data.orders } : {}),
  });
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const body = await request.json();
    const updated = await updatePlatformData((data) => {
      const planId = String(body.planId ?? "");
      const plan = data.config.plans.find((item) => item.id === planId);

      if (!plan) {
        throw new Error("Plano não encontrado.");
      }

      const priceCents = toCents(body.price);
      if (priceCents === null) {
        throw new Error("Informe um valor válido para o plano.");
      }

      const cycle = String(body.cycle) as BillingCycle;
      if (!validCycles.includes(cycle)) {
        throw new Error("Selecione uma recorrência válida.");
      }

      plan.name = String(body.name ?? plan.name).trim() || plan.name;
      plan.description = String(body.description ?? plan.description).trim() || plan.description;
      plan.cycle = cycle;
      plan.priceCents = priceCents;
      plan.active = Boolean(body.active);
      data.config.defaultPlanId = String(body.defaultPlanId ?? data.config.defaultPlanId);

      return data.config;
    });

    return NextResponse.json({ config: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível salvar a configuração.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
