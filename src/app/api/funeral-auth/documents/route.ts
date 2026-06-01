import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updatePlatformData, type FuneralDocument } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const data = await readPlatformData();
    const documents = data.funeralDocuments.filter((d) => d.funeralHomeId === session.funeralHomeId);
    return NextResponse.json({ documents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar documentos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.type || !body.issueDate) {
      return NextResponse.json({ error: "Tipo e data de emissao sao obrigatorios." }, { status: 400 });
    }

    const document = await updatePlatformData((data) => {
      const newDoc: FuneralDocument = {
        id: "doc_" + Date.now().toString(36),
        funeralHomeId: session.funeralHomeId,
        serviceId: body.serviceId,
        type: body.type,
        documentNumber: body.documentNumber,
        issuer: body.issuer,
        issueDate: body.issueDate,
        expiryDate: body.expiryDate,
        status: body.status || "pendente",
        fileUrl: body.fileUrl,
        notes: body.notes,
        createdAt: new Date().toISOString(),
      };
      data.funeralDocuments.push(newDoc);
      return newDoc;
    });
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar documento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getFuneralSession();
    if (!session) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });

    const document = await updatePlatformData((data) => {
      const doc = data.funeralDocuments.find((d) => d.id === body.id && d.funeralHomeId === session.funeralHomeId);
      if (!doc) throw new Error("Documento nao encontrado.");
      Object.assign(doc, { ...body, id: doc.id, funeralHomeId: doc.funeralHomeId, createdAt: doc.createdAt });
      return doc;
    });
    return NextResponse.json({ document });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
