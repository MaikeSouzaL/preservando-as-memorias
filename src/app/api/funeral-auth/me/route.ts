import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();

    if (!session) {
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
    }

    const data = await readPlatformData();
    const funeralHome = data.funeralHomes.find((fh) => fh.id === session.funeralHomeId);

    if (!funeralHome) {
      return NextResponse.json({ error: "Funeraria nao encontrada." }, { status: 404 });
    }

    const memorials = data.memorials.filter((m) => m.funeralHomeId === funeralHome.id);
    const orders = data.orders.filter((o) => o.funeralHomeId === funeralHome.id);
    const paidOrders = orders.filter((o) => o.status === "paid");
    const pendingOrders = orders.filter((o) => o.status === "pending");

    return NextResponse.json({
      funeralHome: {
        id: funeralHome.id,
        name: funeralHome.name,
        email: funeralHome.email,
        contactName: funeralHome.contactName,
        phone: funeralHome.phone,
        cnpj: funeralHome.cnpj,
        city: funeralHome.city,
        state: funeralHome.state,
        createdAt: funeralHome.createdAt,
      },
      stats: {
        totalMemorials: memorials.length,
        activeMemorials: memorials.filter((m) => m.status === "ativo").length,
        pendingMemorials: memorials.filter((m) => m.status === "pending_payment").length,
        totalPaid: paidOrders.length,
        totalPending: pendingOrders.length,
        totalRevenue: paidOrders.reduce((sum, o) => sum + o.grossAmountCents, 0),
      },
      memorials,
      orders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar dados.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
