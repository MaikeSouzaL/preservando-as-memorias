import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { requireAdminSession } from "@/src/lib/api-auth";
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
    const admin = await requireAdminSession();
    if (admin.response) return admin.response;

    const body = await request.json();
    const target = String(body.target ?? "prices");

    const updated = await updatePlatformData((data) => {
      if (target === "prices") {
        const familyCents = Math.round(Number(body.familyMemorialPriceCents));
        const funeralCents = Math.round(Number(body.funeralHomeMemorialPriceCents));
        const commissionPct = Number(body.ownerCommissionPercent);

        if (!Number.isFinite(familyCents) || familyCents < 0)
          throw new Error("Informe um valor válido para o preço de família.");
        if (!Number.isFinite(funeralCents) || funeralCents < 0)
          throw new Error("Informe um valor válido para o preço de funerária.");

        data.config.familyMemorialPriceCents = familyCents;
        data.config.funeralHomeMemorialPriceCents = funeralCents;

        if (Number.isFinite(commissionPct) && commissionPct >= 0 && commissionPct <= 100) {
          data.config.ownerCommissionPercent = commissionPct;
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
