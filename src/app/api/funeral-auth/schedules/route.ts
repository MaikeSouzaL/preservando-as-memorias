import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updatePlatformData, type FuneralSchedule } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const data = await readPlatformData();
    const schedules = data.funeralSchedules
      .filter((s) => s.funeralHomeId === session.funeralHomeId)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return NextResponse.json({ schedules });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar agenda.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.deceasedName || !body.type || !body.dateTime || !body.location) {
      return NextResponse.json({ error: "Nome, tipo, data/hora e local sao obrigatorios." }, { status: 400 });
    }

    const schedule = await updatePlatformData((data) => {
      const newSchedule: FuneralSchedule = {
        id: "sch_" + Date.now().toString(36),
        funeralHomeId: session.funeralHomeId,
        serviceId: body.serviceId,
        deceasedName: body.deceasedName,
        type: body.type,
        dateTime: body.dateTime,
        location: body.location,
        address: body.address,
        status: "agendado",
        assignedStaff: body.assignedStaff || [],
        notes: body.notes,
        createdAt: new Date().toISOString(),
      };
      data.funeralSchedules.push(newSchedule);
      return newSchedule;
    });
    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao agendar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });

    const schedule = await updatePlatformData((data) => {
      const sch = data.funeralSchedules.find((s) => s.id === body.id && s.funeralHomeId === session.funeralHomeId);
      if (!sch) throw new Error("Agendamento nao encontrado.");
      Object.assign(sch, { ...body, id: sch.id, funeralHomeId: sch.funeralHomeId, createdAt: sch.createdAt });
      return sch;
    });
    return NextResponse.json({ schedule });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
