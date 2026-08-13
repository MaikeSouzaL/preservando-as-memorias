import { NextResponse } from "next/server";
import { requireOwnerSession } from "@/src/lib/api-auth";
import { getOwnerStats } from "@/src/lib/owner-stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireOwnerSession();
  if (guard) return guard;

  const stats = await getOwnerStats();
  return NextResponse.json(stats);
}
