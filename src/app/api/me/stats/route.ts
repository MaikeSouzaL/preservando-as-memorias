import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  const data = await readPlatformData();
  const memorials = data.memorials.filter(
    (memorial) => memorial.id !== "default" && (session.isAdmin || memorial.ownerId.toLowerCase().trim() === session.email)
  );
  const memorialIds = new Set(memorials.map((memorial) => memorial.id));
  const tributes = data.tributes.filter((tribute) => memorialIds.has(tribute.memorialId));
  const candles = data.candles.filter((candle) => memorialIds.has(candle.memorialId));
  const orders = data.orders.filter((order) => session.isAdmin || order.userEmail.toLowerCase().trim() === session.email);

  return NextResponse.json({
    hasNotifications: tributes.length > 0 || candles.length > 0 || orders.some((order) => order.status === "pending"),
    memorialsCount: memorials.length,
    tributesCount: tributes.length,
    candlesCount: candles.length,
    ordersCount: orders.length,
  });
}
