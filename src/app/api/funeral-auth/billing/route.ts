import { NextResponse } from "next/server";
import { requireFuneralHomeApi } from "@/src/components/funeral/guard";
import { getCurrentCycleUsage, listInvoices, resolveBillingPlan } from "@/src/components/funeral/funeral-home-data";

export const dynamic = "force-dynamic";

/** Plano, uso do ciclo atual (estimativa) e histórico de faturas da funerária logada. */
export async function GET() {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  const plan = await resolveBillingPlan(guard.funeralHome);
  const usage = plan ? await getCurrentCycleUsage(guard.funeralHome.id, plan) : null;
  const invoices = await listInvoices(guard.funeralHome.id);

  return NextResponse.json({ plan, usage, invoices });
}
