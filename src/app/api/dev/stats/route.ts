import { NextResponse } from "next/server";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();
  const paidOrders = data.orders.filter((o) => o.status === "paid");

  const grossRevenue = paidOrders.reduce((s, o) => s + o.grossAmountCents, 0);
  const systemCut = paidOrders.reduce((s, o) => s + o.platformCommissionCents, 0);
  const adminRepasse = grossRevenue - systemCut;

  const recentOrders = [...paidOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)
    .map((o) => ({
      id: o.id,
      userName: o.userName,
      userEmail: o.userEmail,
      planId: o.planId,
      paymentMethod: o.paymentMethod,
      grossAmountCents: o.grossAmountCents,
      platformCommissionCents: o.platformCommissionCents,
      operatorAmountCents: o.operatorAmountCents,
      createdAt: o.createdAt,
    }));

  return NextResponse.json({
    totalOrders: paidOrders.length,
    grossRevenueCents: grossRevenue,
    systemCutCents: systemCut,
    adminRepasseCents: adminRepasse,
    recentOrders,
  });
}
