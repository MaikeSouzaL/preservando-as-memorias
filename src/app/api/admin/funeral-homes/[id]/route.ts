import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = await request.json();
  const action = body.action as string;

  if (action === "set_qr_delivery") {
    const mode = String(body.qrDeliveryMode ?? "");
    if (!["inherit", "admin", "self"].includes(mode)) {
      return NextResponse.json({ error: "Modo inválido." }, { status: 400 });
    }
    const updated = await updatePlatformData((data) => {
      const fh = data.funeralHomes.find((f) => f.id === id);
      if (!fh) throw new Error("Funerária não encontrada.");
      fh.qrDeliveryMode = mode as "inherit" | "admin" | "self";
      fh.updatedAt = new Date().toISOString();
      return { id: fh.id, name: fh.name, qrDeliveryMode: fh.qrDeliveryMode };
    });
    return NextResponse.json({ success: true, funeralHome: updated });
  }

  if (action === "set_plan") {
    const planId = body.planId as string | null;
    const renewsAt = body.planRenewsAt as string | null;

    const updated = await updatePlatformData((data) => {
      const fh = data.funeralHomes.find((f) => f.id === id);
      if (!fh) throw new Error("Funerária não encontrada.");

      if (!planId) {
        // Remover plano
        fh.activePlanId = undefined;
        fh.planStartedAt = undefined;
        fh.planRenewsAt = undefined;
        fh.memorialCountMonth = 0;
        fh.memorialCountResetAt = undefined;
      } else {
        const plan = data.config.funeralPlans?.find((p) => p.id === planId);
        if (!plan) throw new Error("Plano não encontrado.");
        const now = new Date().toISOString();
        fh.activePlanId = planId;
        fh.planStartedAt = now;
        fh.planRenewsAt = renewsAt ?? undefined;
        fh.memorialCountMonth = 0;
        fh.memorialCountResetAt = now;
      }

      fh.updatedAt = new Date().toISOString();
      return {
        id: fh.id,
        name: fh.name,
        activePlanId: fh.activePlanId ?? null,
        planRenewsAt: fh.planRenewsAt ?? null,
      };
    });
    return NextResponse.json({ success: true, funeralHome: updated });
  }

  if (action === "set_commission") {
    const percent = Number(body.adminCommissionPercent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      return NextResponse.json({ error: "Percentual inválido (0–100)." }, { status: 400 });
    }
    const updated = await updatePlatformData((data) => {
      const fh = data.funeralHomes.find((f) => f.id === id);
      if (!fh) throw new Error("Funerária não encontrada.");
      fh.adminCommissionPercent = percent;
      fh.updatedAt = new Date().toISOString();
      return { id: fh.id, name: fh.name, adminCommissionPercent: fh.adminCommissionPercent };
    });
    return NextResponse.json({ success: true, funeralHome: updated });
  }

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }

  const updated = await updatePlatformData((data) => {
    const fh = data.funeralHomes.find((f) => f.id === id);
    if (!fh) throw new Error("Funerária não encontrada.");

    if (action === "approve") {
      fh.approvalStatus = "approved";
      fh.isActive = true;
    } else {
      fh.approvalStatus = "rejected";
      fh.isActive = false;
    }

    fh.updatedAt = new Date().toISOString();
    return { id: fh.id, name: fh.name, approvalStatus: fh.approvalStatus };
  });

  return NextResponse.json({ success: true, funeralHome: updated });
}
