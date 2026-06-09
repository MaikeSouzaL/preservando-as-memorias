import { NextResponse } from "next/server";
import { getAuthSession, serializeAuthSession } from "@/src/lib/auth-session";
import { hashPassword } from "@/src/lib/password";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha precisa ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const curator = await Curator.findOne({ email: session.email });
    if (!curator) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    curator.password = hashPassword(password);
    await curator.save();

    const newSession = { email: session.email, isAdmin: session.isAdmin, needsPassword: false };
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_user", serializeAuthSession(newSession), {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Não foi possível definir a senha." }, { status: 500 });
  }
}
