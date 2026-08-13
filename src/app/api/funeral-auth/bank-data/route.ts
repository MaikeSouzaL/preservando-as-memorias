import { NextResponse } from "next/server";
import { requireFuneralHomeApi } from "@/src/components/funeral/guard";
import { updateBankData } from "@/src/components/funeral/funeral-home-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  const fh = guard.funeralHome;
  return NextResponse.json({
    bankPixKey: fh.bankPixKey,
    bankHolderName: fh.bankHolderName,
    bankCpfCnpj: fh.bankCpfCnpj,
  });
}

export async function PATCH(request: Request) {
  const guard = await requireFuneralHomeApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const bankPixKey = typeof body.bankPixKey === "string" ? body.bankPixKey.trim() : undefined;
  const bankHolderName = typeof body.bankHolderName === "string" ? body.bankHolderName.trim() : undefined;
  const bankCpfCnpj = typeof body.bankCpfCnpj === "string" ? body.bankCpfCnpj.trim() : undefined;

  await updateBankData(guard.funeralHome.id, { bankPixKey, bankHolderName, bankCpfCnpj });

  return NextResponse.json({ success: true });
}
