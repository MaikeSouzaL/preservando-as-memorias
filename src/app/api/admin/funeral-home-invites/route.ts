import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import type { FuneralHomeInvite } from "@/src/lib/platform-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  const data = await readPlatformData();
  return NextResponse.json({
    invites: data.config.funeralHomeInvites ?? [],
    funeralPlans: data.config.funeralPlans ?? [],
  });
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  try {
    const body = await request.json();

    const label = String(body.label ?? "").trim();
    if (!label) throw new Error("Informe um nome para o convite.");

    const rawSlug = String(body.slug ?? "").trim();
    const slug = rawSlug
      ? rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      : label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) + "-" + Date.now().toString(36).slice(-4);

    if (!slug) throw new Error("Slug inválido.");

    const adminCommissionPercent =
      body.adminCommissionPercent !== undefined && body.adminCommissionPercent !== ""
        ? Number(body.adminCommissionPercent)
        : undefined;

    if (adminCommissionPercent !== undefined && (isNaN(adminCommissionPercent) || adminCommissionPercent < 0 || adminCommissionPercent > 100)) {
      throw new Error("Comissão deve ser entre 0 e 100.");
    }

    const invite: FuneralHomeInvite = {
      id: `inv_${Date.now().toString(36)}`,
      slug,
      label,
      adminCommissionPercent,
      activePlanId: body.activePlanId || null,
      planRenewsAt: body.planRenewsAt || null,
      notes: String(body.notes ?? "").trim() || undefined,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const updated = await updatePlatformData((data) => {
      const existing = (data.config.funeralHomeInvites ?? []).find((i) => i.slug === slug);
      if (existing) throw new Error(`Já existe um convite com o slug "${slug}".`);

      data.config.funeralHomeInvites = [...(data.config.funeralHomeInvites ?? []), invite];
      return data.config;
    });

    return NextResponse.json({ invite, config: updated }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar convite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
