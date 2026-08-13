import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData } from "@/src/lib/platform-data";
import { createAdminClient } from "@/src/lib/supabase";

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

    // Atividade dos admins parceiros — só retornado para o dev admin
    let adminPartners: { id: string; name: string; email: string; lastSeenAt: string | null }[] = [];
    if (admin.session?.isDevAdmin) {
      const supabase = await createAdminClient();
      const { data: partnerRows } = await supabase
        .from("profiles")
        .select("id, name, email, last_seen_at")
        .eq("is_admin", true)
        .eq("is_dev_admin", false);
      adminPartners = (partnerRows ?? []).map((r) => ({
        id: r.id,
        name: r.name ?? r.email,
        email: r.email,
        lastSeenAt: r.last_seen_at ?? null,
      }));
    }

    return NextResponse.json({
      hasNotifications: pendingFuneralHomes.length > 0 || pendingDeliveries.length > 0,
      pendingFuneralHomes,
      pendingCount: pendingFuneralHomes.length,
      pendingDeliveries,
      pendingDeliveriesCount: pendingDeliveries.length,
      adminPartners,
      ordersCount: data.orders.length,
      memorialsCount: data.memorials.length,
    });
  } catch {
    return NextResponse.json({ hasNotifications: false }, { status: 500 });
  }
}
