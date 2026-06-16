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

    // Memoriais com endereço de entrega que o admin ainda não enviou
    const pendingDeliveries = data.memorials
      .filter((m) => m.deliveryAddress?.recipientName && !m.qrSentAt)
      .map((m) => ({
        id: m.id,
        name: m.name,
        source: m.source ?? "customer",
        recipientName: m.deliveryAddress!.recipientName,
        cidade: m.deliveryAddress!.cidade,
        estado: m.deliveryAddress!.estado,
        logradouro: m.deliveryAddress!.logradouro,
        numero: m.deliveryAddress!.numero,
        complemento: m.deliveryAddress!.complemento,
        bairro: m.deliveryAddress!.bairro,
        cep: m.deliveryAddress!.cep,
        createdAt: m.createdAt,
      }));

    return NextResponse.json({
      hasNotifications: pendingFuneralHomes.length > 0 || pendingDeliveries.length > 0,
      pendingFuneralHomes,
      pendingCount: pendingFuneralHomes.length,
      pendingDeliveries,
      pendingDeliveriesCount: pendingDeliveries.length,
      ordersCount: data.orders.length,
      memorialsCount: data.memorials.length,
    });
  } catch {
    return NextResponse.json({ hasNotifications: false }, { status: 500 });
  }
}
