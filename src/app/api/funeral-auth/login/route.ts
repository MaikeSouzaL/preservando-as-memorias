import { NextResponse } from "next/server";
import { readPlatformData } from "@/src/lib/platform-data";
import { verifyPassword } from "@/src/lib/hash";
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

    if (!funeralHome || !funeralHome.isActive) {
      return NextResponse.json(
        { error: "Credenciais invalidas." },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, funeralHome.passwordHash)) {
      return NextResponse.json(
        { error: "Credenciais invalidas." },
        { status: 401 }
      );
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
