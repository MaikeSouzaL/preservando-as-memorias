import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const data = await readPlatformData();
    return NextResponse.json({ complaints: data.complaints || [] });
  } catch {
    return NextResponse.json({ error: "Falha ao ler denúncias" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const body = await request.json();
    const { target, reason, reporter } = body;

    if (!target || !reason) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const newComplaint = {
      id: `rep_${Date.now()}`,
      target: String(target).trim(),
      reason: String(reason).trim(),
      reporter: String(reporter || "Visitante Anônimo").trim(),
      status: "Pendente" as const,
      createdAt: new Date().toISOString(),
    };

    await updatePlatformData((data) => {
      if (!data.complaints) data.complaints = [];
      data.complaints.unshift(newComplaint);
    });

    return NextResponse.json({ complaint: newComplaint, success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao criar denúncia" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
    }

    const updated = await updatePlatformData((data) => {
      if (!data.complaints) return false;
      const index = data.complaints.findIndex((c) => c.id === id);
      if (index === -1) return false;
      
      data.complaints[index].status = status as "Pendente" | "Resolvido";
      return true;
    });

    if (!updated) {
      return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 });
    }

    const data = await readPlatformData();
    return NextResponse.json({ complaints: data.complaints || [], success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar denúncia" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const deleted = await updatePlatformData((data) => {
      if (!data.complaints) return false;
      const originalLength = data.complaints.length;
      data.complaints = data.complaints.filter((c) => c.id !== id);
      return data.complaints.length < originalLength;
    });

    if (!deleted) {
      return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 });
    }

    const data = await readPlatformData();
    return NextResponse.json({ complaints: data.complaints || [], success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir denúncia" }, { status: 500 });
  }
}
