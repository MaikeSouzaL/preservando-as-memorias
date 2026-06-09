import { NextResponse } from "next/server";
import { requireAdminSession } from "@/src/lib/api-auth";
import { readPlatformData, updatePlatformData, type AdminBankData } from "@/src/lib/platform-data";
import { encrypt, decrypt } from "@/src/lib/encrypt";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const data = await readPlatformData();

  if (!data.adminBankDataEncrypted) {
    return NextResponse.json({ bankData: null });
  }

  try {
    const bankData: AdminBankData = JSON.parse(decrypt(data.adminBankDataEncrypted));
    return NextResponse.json({ bankData });
  } catch {
    return NextResponse.json({ bankData: null });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();

    const bankData: AdminBankData = {
      holderName: String(body.holderName ?? "").trim(),
      bankName: String(body.bankName ?? "").trim(),
      agency: String(body.agency ?? "").trim(),
      account: String(body.account ?? "").trim(),
      accountType: body.accountType === "poupança" ? "poupança" : "corrente",
      cpfCnpj: String(body.cpfCnpj ?? "").trim(),
      pixKey: String(body.pixKey ?? "").trim() || undefined,
    };

    if (!bankData.holderName || !bankData.bankName || !bankData.agency || !bankData.account || !bankData.cpfCnpj) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    const encrypted = encrypt(JSON.stringify(bankData));

    await updatePlatformData((data) => {
      data.adminBankDataEncrypted = encrypted;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar dados bancários.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
