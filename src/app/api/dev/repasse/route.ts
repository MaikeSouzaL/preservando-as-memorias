import { NextResponse } from "next/server";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

/** PATCH /api/dev/repasse
 *  Body: { orderId: string }  — marca um pedido como repasse realizado
 *  Body: { markAll: true }    — marca TODOS os pedidos pendentes como realizados
 */
export async function PATCH(request: Request) {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : null;
    const markAll = body.markAll === true;

    if (!orderId && !markAll) {
      return NextResponse.json(
        { error: "Informe orderId ou markAll: true." },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    await updatePlatformData((data) => {
      for (const order of data.orders) {
        if (order.status !== "paid") continue;
        if (order.repasseStatus === "realizado") continue;

        const shouldUpdate = markAll || order.id === orderId;
        if (shouldUpdate) {
          order.repasseStatus = "realizado";
          updatedCount++;
        }
      }
    });

    return NextResponse.json({ ok: true, updatedCount });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar repasse." }, { status: 500 });
  }
}
