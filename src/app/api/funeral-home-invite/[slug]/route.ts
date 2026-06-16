import { NextResponse } from "next/server";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await readPlatformData();

  const invite = (data.config.funeralHomeInvites ?? []).find((i) => i.slug === slug);
  if (!invite) {
    return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
  }

  if (invite.status !== "active") {
    return NextResponse.json({ error: "Este convite não está mais disponível." }, { status: 410 });
  }

  const plan = invite.activePlanId
    ? (data.config.funeralPlans ?? []).find((p) => p.id === invite.activePlanId)
    : undefined;

  return NextResponse.json({
    invite: {
      id: invite.id,
      slug: invite.slug,
      label: invite.label,
      adminCommissionPercent: invite.adminCommissionPercent,
      activePlanId: invite.activePlanId,
      planName: plan?.name,
      planRenewsAt: invite.planRenewsAt,
      notes: invite.notes,
      status: invite.status,
    },
  });
}
