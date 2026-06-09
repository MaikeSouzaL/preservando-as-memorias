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

    const pendingFuneralHomes = data.funeralHomes
      .filter((fh) => fh.approvalStatus === "pending")
      .map((fh) => ({
        id: fh.id,
        name: fh.name,
        email: fh.email,
        contactName: fh.contactName,
        city: fh.city,
        state: fh.state,
        createdAt: fh.createdAt,
      }));

    return NextResponse.json({
      hasNotifications: pendingFuneralHomes.length > 0,
      pendingFuneralHomes,
      pendingCount: pendingFuneralHomes.length,
      ordersCount: data.orders.length,
      memorialsCount: data.memorials.length,
    });
  } catch {
    return NextResponse.json({ hasNotifications: false }, { status: 500 });
  }
}
