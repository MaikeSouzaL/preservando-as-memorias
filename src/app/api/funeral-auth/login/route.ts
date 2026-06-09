import { NextResponse } from "next/server";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "@/src/lib/password";
import { serializeFuneralSession } from "@/src/lib/funeral-auth";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha sao obrigatorios." },
        { status: 400 }
      );
    }

    const data = await readPlatformData();
    const funeralHome = data.funeralHomes.find((fh) => fh.email === email);

    if (!funeralHome) {
      return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
    }

    if (funeralHome.approvalStatus === "pending") {
      return NextResponse.json(
        { error: "Cadastro em análise. Você receberá acesso assim que o administrador aprovar sua conta." },
        { status: 403 }
      );
    }

    if (funeralHome.approvalStatus === "rejected") {
      return NextResponse.json(
        { error: "Cadastro não aprovado. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    if (!funeralHome.isActive) {
      return NextResponse.json({ error: "Conta desativada. Entre em contato com o suporte." }, { status: 403 });
    }

    const storedHash = funeralHome.passwordHash;
    const isScrypt = storedHash?.startsWith("scrypt:");
    const isLegacySha256 = !isScrypt && storedHash === createHash("sha256").update(password).digest("hex");

    if (!isScrypt && !isLegacySha256) {
      if (!verifyPassword(password, storedHash)) {
        return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
      }
    } else if (isLegacySha256) {
      // Upgrade SHA256 → scrypt transparently on next login
      const newHash = hashPassword(password);
      await updatePlatformData((d) => {
        const fh = d.funeralHomes.find((f) => f.id === funeralHome.id);
        if (fh) fh.passwordHash = newHash;
      });
    } else if (!verifyPassword(password, storedHash)) {
      return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
    }

    const sessionValue = serializeFuneralSession({
      funeralHomeId: funeralHome.id,
      email: funeralHome.email,
      name: funeralHome.name,
    });

    const response = NextResponse.json({
      funeralHome: {
        id: funeralHome.id,
        name: funeralHome.name,
        email: funeralHome.email,
      },
    });

    response.cookies.set("funeral_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao fazer login.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
