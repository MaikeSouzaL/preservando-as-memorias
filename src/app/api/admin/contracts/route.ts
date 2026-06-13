import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { saveContractAcceptance, getContractAcceptances } from "@/src/lib/platform-data";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const contracts = await getContractAcceptances(guard.session!.email);
  const devToAdmin = contracts.filter((c) => c.type === "dev_to_admin");

  return NextResponse.json({
    hasSigned: devToAdmin.length > 0,
    signedAt: devToAdmin[0]?.acceptedAt ?? null,
    contracts,
  });
}

export async function POST(request: Request) {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const body = await request.json();
  const type = body.type as string;

  if (type !== "dev_to_admin" && type !== "admin_to_funeral") {
    return NextResponse.json({ error: "Tipo de contrato inválido." }, { status: 400 });
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const contract = await saveContractAcceptance({
    type: type as "dev_to_admin" | "admin_to_funeral",
    signerEmail: guard.session!.email,
    signerName: body.signerName ?? undefined,
    funeralHomeId: body.funeralHomeId ?? undefined,
    acceptedAt: new Date().toISOString(),
    ipAddress: ip,
    contractVersion: body.contractVersion ?? "1.0",
  });

  return NextResponse.json({ success: true, contract }, { status: 201 });
}
