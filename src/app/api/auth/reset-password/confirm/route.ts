import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";
import { hashPassword } from "@/src/lib/password";

export const dynamic = "force-dynamic";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || token.length !== 64) {
      return NextResponse.json({ error: "Token inválido." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres." }, { status: 400 });
    }

    await connectToDatabase();

    const tokenHash = hashToken(token);
    const curator = await Curator.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!curator) {
      return NextResponse.json(
        { error: "Link expirado ou inválido. Solicite um novo." },
        { status: 400 }
      );
    }

    const newHash = hashPassword(password);

    await Curator.updateOne(
      { _id: curator._id },
      {
        password: newHash,
        $unset: { resetPasswordTokenHash: "", resetPasswordExpires: "" },
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível redefinir a senha." }, { status: 500 });
  }
}
