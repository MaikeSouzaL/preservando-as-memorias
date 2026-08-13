import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updatePlatformData((data) => {
      const invites = data.config.funeralHomeInvites ?? [];
      const idx = invites.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("Convite não encontrado.");

      if (body.status !== undefined) {
        const validStatuses = ["active", "used", "expired"];
        if (!validStatuses.includes(body.status)) throw new Error("Status inválido.");
        invites[idx] = { ...invites[idx], status: body.status };
      }

      if (body.label !== undefined) {
        invites[idx] = { ...invites[idx], label: String(body.label).trim() };
      }

      if (body.notes !== undefined) {
        invites[idx] = { ...invites[idx], notes: String(body.notes).trim() || undefined };
      }

      data.config.funeralHomeInvites = invites;
      return data.config;
    });

    return NextResponse.json({ config: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar convite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (admin.response) return admin.response;

  try {
    const { id } = await params;

    const updated = await updatePlatformData((data) => {
      const before = data.config.funeralHomeInvites ?? [];
      const after = before.filter((i) => i.id !== id);
      if (before.length === after.length) throw new Error("Convite não encontrado.");
      data.config.funeralHomeInvites = after;
      return data.config;
    });

    return NextResponse.json({ config: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover convite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
