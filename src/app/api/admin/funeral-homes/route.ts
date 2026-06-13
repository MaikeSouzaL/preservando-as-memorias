import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();

  const funeralHomes = data.funeralHomes.map((fh) => ({
    id: fh.id,
    name: fh.name,
    email: fh.email,
    contactName: fh.contactName,
    phone: fh.phone,
    cnpj: fh.cnpj,
    city: fh.city,
    state: fh.state,
    isActive: fh.isActive,
    approvalStatus: fh.approvalStatus ?? "approved",
    adminCommissionPercent: fh.adminCommissionPercent ?? 20,
    createdAt: fh.createdAt,
  }));

  return NextResponse.json({ funeralHomes });
}
