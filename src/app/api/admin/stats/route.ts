import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const data = await readPlatformData();
    // Sino amarelo ativa quando houver novas compras (orders) ou novos memoriais ativos
    const hasNotifications = data.orders.length > 0;
    
    return NextResponse.json({
      hasNotifications,
      ordersCount: data.orders.length,
      memorialsCount: data.memorials.length,
    });
  } catch {
    return NextResponse.json({ hasNotifications: false }, { status: 500 });
  }
}
