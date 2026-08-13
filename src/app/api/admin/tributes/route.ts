import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

function withMemorialNames(data: Awaited<ReturnType<typeof readPlatformData>>) {
  return data.tributes.map((tribute) => ({
    ...tribute,
    memorialName: data.memorials.find((memorial) => memorial.id === tribute.memorialId)?.name ?? "Memorial removido",
  }));
}

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const data = await readPlatformData();
    return NextResponse.json({ tributes: withMemorialNames(data) });
  } catch {
    return NextResponse.json({ error: "Falha ao ler homenagens." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const status = body.status === "aprovada" || body.status === "pendente" ? body.status : null;

    if (!id || !status) {
      return NextResponse.json({ error: "Informe a homenagem e o status desejado." }, { status: 400 });
    }

    const updated = await updatePlatformData((data) => {
      const tribute = data.tributes.find((item) => item.id === id);
      if (!tribute) return false;

      tribute.status = status;
      return true;
    });

    if (!updated) {
      return NextResponse.json({ error: "Homenagem não encontrada." }, { status: 404 });
    }

    const data = await readPlatformData();
    return NextResponse.json({ tributes: withMemorialNames(data), success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao atualizar homenagem." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (admin.response) {
      return admin.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim() ?? "";

    if (!id) {
      return NextResponse.json({ error: "Informe a homenagem que deve ser removida." }, { status: 400 });
    }

    const deleted = await updatePlatformData((data) => {
      const initialLength = data.tributes.length;
      data.tributes = data.tributes.filter((tribute) => tribute.id !== id);
      return data.tributes.length < initialLength;
    });

    if (!deleted) {
      return NextResponse.json({ error: "Homenagem não encontrada." }, { status: 404 });
    }

    const data = await readPlatformData();
    return NextResponse.json({ tributes: withMemorialNames(data), success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao excluir homenagem." }, { status: 500 });
  }
}
