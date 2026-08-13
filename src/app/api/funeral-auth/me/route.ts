import { NextResponse } from "next/server";
import { requireFuneralHomeApi } from "@/src/components/funeral/guard";
import { updateCompanyProfile } from "@/src/components/funeral/funeral-home-data";

export const dynamic = "force-dynamic";

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

export async function GET() {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  const fh = guard.funeralHome;
  return NextResponse.json({
    funeralHome: {
      id: fh.id,
      name: fh.name,
      email: fh.email,
      contactName: fh.contactName,
      phone: fh.phone,
      cnpj: fh.cnpj,
      address: fh.address,
      city: fh.city,
      state: fh.state,
      createdAt: fh.createdAt,
    },
  });
}

/** Atualiza os dados cadastrais editáveis. Nome, e-mail e CNPJ ficam de fora — mudam via suporte. */
export async function PATCH(request: Request) {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    await updateCompanyProfile(guard.funeralHome.id, {
      contactName: asString(body.contactName),
      phone: asString(body.phone),
      address: asString(body.address),
      city: asString(body.city),
      state: asString(body.state),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar dados da empresa.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
