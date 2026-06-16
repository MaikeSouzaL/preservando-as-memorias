import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { requireAdminSession } from "@/src/lib/api-auth";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

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
    const body = await request.json();
    const target = String(body.target ?? "prices");

    // Commission can only be changed by the dev admin (Maike)
    if (target === "commission") {
      const dev = await requireDevAdminSession();
      if (dev.response) return dev.response;

      const commissionPct = Number(body.ownerCommissionPercent);
      if (!Number.isFinite(commissionPct) || commissionPct < 0 || commissionPct > 100)
        return NextResponse.json({ error: "Informe um percentual entre 0 e 100." }, { status: 400 });

      const updated = await updatePlatformData((data) => {
        data.config.ownerCommissionPercent = commissionPct;
        return data.config;
      });
      return NextResponse.json({ config: updated });
    }

    const admin = await requireAdminSession();
    if (admin.response) return admin.response;

    if (target === "qr_delivery") {
      const mode = String(body.qrDeliveryMode ?? "");
      if (mode !== "admin" && mode !== "self") {
        throw new Error("Modo inválido. Use 'admin' ou 'self'.");
      }
      const updatedQr = await updatePlatformData((data) => {
        data.config.qrDeliveryMode = mode as "admin" | "self";
        return data.config;
      });
      return NextResponse.json({ config: updatedQr });
    }

    if (target === "funeral_delete") {
      const planId = String(body.planId ?? "");
      if (!planId) throw new Error("ID do plano é obrigatório.");
      const updatedDel = await updatePlatformData((data) => {
        const plans = (Array.isArray(data.config.funeralPlans) ? data.config.funeralPlans : [])
          .filter((p) => p && typeof p === "object" && p.id !== planId);
        data.config.funeralPlans = plans;
        if (data.config.defaultFuneralPlanId === planId) {
          data.config.defaultFuneralPlanId = plans[0]?.id ?? undefined;
        }
        return data.config;
      });
      return NextResponse.json({ config: updatedDel });
    }

    const updated = await updatePlatformData((data) => {
      if (target === "prices") {
        const familyCents = Math.round(Number(body.familyMemorialPriceCents));
        const funeralCents = Math.round(Number(body.funeralHomeMemorialPriceCents));

        if (!Number.isFinite(familyCents) || familyCents < 0)
          throw new Error("Informe um valor válido para o preço de família.");
        if (!Number.isFinite(funeralCents) || funeralCents < 0)
          throw new Error("Informe um valor válido para o preço de funerária.");

        data.config.familyMemorialPriceCents = familyCents;
        data.config.funeralHomeMemorialPriceCents = funeralCents;
      }

      if (target === "funeral") {
        const planId = String(body.planId ?? "");
        const plans = data.config.funeralPlans ?? [];
        const idx = plans.findIndex((p) => p.id === planId);

        const priceCents = Math.round(Number(body.price) * 100);
        if (!Number.isFinite(priceCents) || priceCents < 0)
          throw new Error("Informe um valor de preço válido.");

        const validCycle = ["monthly", "annual", "one_time"].includes(String(body.cycle))
          ? (body.cycle as "monthly" | "annual" | "one_time")
          : "one_time";

        const memorialLimit = body.memorialLimit === null || body.memorialLimit === "unlimited"
          ? null
          : body.memorialLimit !== undefined
            ? Math.max(0, Math.round(Number(body.memorialLimit)))
            : undefined;

        const extraMemorialPriceCents = body.extraMemorialPriceCents !== undefined
          ? Math.max(0, Math.round(Number(body.extraMemorialPriceCents) * 100))
          : undefined;

        if (idx === -1) {
          if (!planId) throw new Error("ID do plano é obrigatório para criação.");
          plans.push({
            id: planId,
            name: String(body.name ?? "Novo plano").trim() || "Novo plano",
            description: String(body.description ?? "").trim(),
            priceCents,
            cycle: validCycle,
            active: Boolean(body.active),
            features: [],
            memorialLimit: memorialLimit ?? null,
            extraMemorialPriceCents: extraMemorialPriceCents ?? 0,
            modules: {
              memorials: true,
              schedules: false,
              services: false,
              documents: false,
              inventory: false,
              staff: false,
            },
          });
        } else {
          plans[idx] = {
            ...plans[idx],
            name: String(body.name ?? plans[idx].name).trim(),
            description: String(body.description ?? plans[idx].description).trim(),
            priceCents,
            cycle: validCycle,
            active: Boolean(body.active),
            ...(memorialLimit !== undefined ? { memorialLimit } : {}),
            ...(extraMemorialPriceCents !== undefined ? { extraMemorialPriceCents } : {}),
          };
        }

        data.config.funeralPlans = plans;

        const newDefault = String(body.defaultFuneralPlanId ?? "");
        if (newDefault && plans.some((p) => p.id === newDefault)) {
          data.config.defaultFuneralPlanId = newDefault;
        }
      }

      return data.config;
    });

    return NextResponse.json({ config: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível salvar a configuração.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
