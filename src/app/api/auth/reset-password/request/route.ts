import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { Resend } from "resend";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "rl:reset-request", { limit: 3, windowSecs: 60 * 60 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    await connectToDatabase();
    const curator = await Curator.findOne({ email });

    // Always return success to prevent email enumeration
    if (!curator || !curator.password) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expires = new Date(Date.now() + TOKEN_TTL_MS);

    await Curator.updateOne(
      { email },
      { resetPasswordTokenHash: tokenHash, resetPasswordExpires: expires }
    );

    const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001";
    const resetUrl = `${baseUrl}/nova-senha?token=${token}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const from = process.env.EMAIL_FROM ?? "Preservando as Memórias <noreply@preservandasmemorias.com.br>";

      await resend.emails.send({
        from,
        to: email,
        subject: "Redefinição de senha — Preservando as Memórias",
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#101414;font-family:Arial,sans-serif;color:#e0e3e2">
  <div style="max-width:520px;margin:40px auto;padding:32px;background:#1c2020;border-radius:16px;border:1px solid rgba(233,195,73,0.15)">
    <div style="text-align:center;margin-bottom:28px">
      <div style="width:56px;height:56px;background:rgba(233,195,73,0.1);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
        <span style="font-size:28px">🔑</span>
      </div>
      <h1 style="margin:0;font-size:22px;font-weight:300;color:#e5e2e1">Redefinir senha</h1>
    </div>

    <p style="font-size:14px;color:#c4c7c7;line-height:1.6;margin:0 0 8px">
      Recebemos uma solicitação para redefinir a senha da conta associada a <strong style="color:#e5e2e1">${email}</strong>.
    </p>
    <p style="font-size:14px;color:#c4c7c7;line-height:1.6;margin:0 0 24px">
      O link é válido por <strong style="color:#e9c349">15 minutos</strong>. Se você não fez essa solicitação, ignore este email.
    </p>

    <div style="text-align:center;margin:28px 0">
      <a href="${resetUrl}"
         style="display:inline-block;padding:14px 36px;background:#e9c349;color:#1c1b1b;text-decoration:none;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase">
        Criar nova senha
      </a>
    </div>

    <p style="font-size:12px;color:rgba(196,199,199,0.4);text-align:center;margin:0">
      Link válido até ${expires.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} de hoje. Não compartilhe este email.
    </p>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a solicitação." }, { status: 500 });
  }
}
