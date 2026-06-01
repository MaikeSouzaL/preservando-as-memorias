import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updatePlatformData, type StaffMember } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const data = await readPlatformData();
    const members = data.staffMembers.filter((m) => m.funeralHomeId === session.funeralHomeId);
    return NextResponse.json({ members });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar equipe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.name || !body.role || !body.phone) {
      return NextResponse.json({ error: "Nome, cargo e telefone sao obrigatorios." }, { status: 400 });
    }

    const member = await updatePlatformData((data) => {
      const newMember: StaffMember = {
        id: "staff_" + Date.now().toString(36),
        funeralHomeId: session.funeralHomeId,
        name: body.name,
        role: body.role,
        phone: body.phone,
        email: body.email,
        commissionPercent: body.commissionPercent,
        schedule: body.schedule || "integral",
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      data.staffMembers.push(newMember);
      return newMember;
    });
    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar membro.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });

    const member = await updatePlatformData((data) => {
      const m = data.staffMembers.find((s) => s.id === body.id && s.funeralHomeId === session.funeralHomeId);
      if (!m) throw new Error("Membro nao encontrado.");
      Object.assign(m, { ...body, id: m.id, funeralHomeId: m.funeralHomeId, createdAt: m.createdAt });
      return m;
    });
    return NextResponse.json({ member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
