import { NextResponse } from "next/server";
import { getFuneralSession } from "@/src/lib/funeral-auth";
import { readPlatformData, updateFuneralHomeBankData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getFuneralSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const data = await readPlatformData();
  const fh = data.funeralHomes.find((f) => f.id === session.funeralHomeId);
  if (!fh) return NextResponse.json({ error: "Funerária não encontrada." }, { status: 404 });

  return NextResponse.json({
    bankPixKey: fh.bankPixKey ?? null,
    bankHolderName: fh.bankHolderName ?? null,
    bankCpfCnpj: fh.bankCpfCnpj ?? null,
    adminCommissionPercent: fh.adminCommissionPercent,
  });
}

export async function PATCH(request: Request) {
  const session = await getFuneralSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await request.json();
  const bankPixKey = typeof body.bankPixKey === "string" ? body.bankPixKey.trim() : undefined;
  const bankHolderName = typeof body.bankHolderName === "string" ? body.bankHolderName.trim() : undefined;
  const bankCpfCnpj = typeof body.bankCpfCnpj === "string" ? body.bankCpfCnpj.trim() : undefined;

  await updateFuneralHomeBankData(session.funeralHomeId, { bankPixKey, bankHolderName, bankCpfCnpj });

  return NextResponse.json({ success: true });
}
