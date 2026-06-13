import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { readPlatformData } from "@/src/lib/platform-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  if (!session.isDevAdmin) return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });

  const data = await readPlatformData();

  const backup = {
    exportedAt: new Date().toISOString(),
    exportedBy: session.email,
    version: "1.0",
    data: {
      config: data.config,
      memorials: data.memorials,
      qrCodes: data.qrCodes,
      tributes: data.tributes,
      candles: data.candles,
      orders: data.orders,
      funeralHomes: data.funeralHomes.map((fh) => ({
        ...fh,
        // omit sensitive bank data
        bankPixKey: fh.bankPixKey ? "[REDACTED]" : undefined,
        bankCpfCnpj: fh.bankCpfCnpj ? "[REDACTED]" : undefined,
      })),
      offerLinks: data.offerLinks,
      funeralServices: data.funeralServices,
      funeralSchedules: data.funeralSchedules,
      inventoryItems: data.inventoryItems,
      staffMembers: data.staffMembers,
      funeralDocuments: data.funeralDocuments,
      profiles: data.profiles.map((p) => ({
        name: p.name,
        email: p.email,
        bio: p.bio,
        theme: p.theme,
        privacy: p.privacy,
        language: p.language,
        timezone: p.timezone,
        isAdmin: p.isAdmin,
      })),
      complaints: data.complaints,
      contractAcceptances: data.contractAcceptances,
    },
  };

  return NextResponse.json(backup);
}
