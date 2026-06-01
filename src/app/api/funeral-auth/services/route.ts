import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updatePlatformData, type FuneralService } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const data = await readPlatformData();
    const services = data.funeralServices.filter((s) => s.funeralHomeId === session.funeralHomeId);
    return NextResponse.json({ services });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar atendimentos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.deceasedName || !body.deceasedDeathDate || !body.familyContactName || !body.familyContactPhone) {
      return NextResponse.json({ error: "Nome do falecido, data do obito, contato e telefone da familia sao obrigatorios." }, { status: 400 });
    }

    const service = await updatePlatformData((data) => {
      const newService: FuneralService = {
        id: "svc_" + Date.now().toString(36),
        funeralHomeId: session.funeralHomeId,
        deceasedName: body.deceasedName,
        deceasedBirthDate: body.deceasedBirthDate,
        deceasedDeathDate: body.deceasedDeathDate,
        deceasedCauseOfDeath: body.deceasedCauseOfDeath,
        deceasedDocumentNumber: body.deceasedDocumentNumber,
        familyContactName: body.familyContactName,
        familyContactPhone: body.familyContactPhone,
        familyContactEmail: body.familyContactEmail,
        familyContactRelation: body.familyContactRelation || "familiar",
        serviceType: body.serviceType || "sepultamento",
        casketType: body.casketType,
        additionalServices: body.additionalServices || [],
        totalAmountCents: body.totalAmountCents || 0,
        paidAmountCents: body.paidAmountCents || 0,
        paymentMethod: body.paymentMethod,
        status: "em_andamento",
        notes: body.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.funeralServices.push(newService);
      return newService;
    });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar atendimento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });

    const service = await updatePlatformData((data) => {
      const svc = data.funeralServices.find((s) => s.id === body.id && s.funeralHomeId === session.funeralHomeId);
      if (!svc) throw new Error("Atendimento nao encontrado.");
      Object.assign(svc, { ...body, id: svc.id, funeralHomeId: svc.funeralHomeId, createdAt: svc.createdAt, updatedAt: new Date().toISOString() });
      return svc;
    });
    return NextResponse.json({ service });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
