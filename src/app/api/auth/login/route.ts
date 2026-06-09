import { NextRequest, NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { hashPassword, verifyPassword } from "@/src/lib/password";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function publicProfile(profile: any) {
  const safeProfile = { ...profile };
  delete safeProfile.password;
  return safeProfile;
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, "rl:login", { limit: 5, windowSecs: 15 * 60 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    // 1. Conecta ao MongoDB Atlas
    await connectToDatabase();

    // 2. Busca o curador no MongoDB
    const curator = await Curator.findOne({ email });
    if (!curator) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    // 3. Verifica a senha
    const matches = verifyPassword(password, curator.password || "");
    if (!matches) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    const profile = {
      name: curator.name,
      email: curator.email,
      bio: curator.bio,
      theme: curator.theme,
      privacy: curator.privacy,
      notifyVelas: curator.notifyVelas,
      notifyTributos: curator.notifyTributos,
      multiFactorEnabled: curator.multiFactorEnabled,
      language: curator.language,
      timezone: curator.timezone,
      globalAudio: curator.globalAudio,
      isAdmin: curator.isAdmin,
      avatarUrl: curator.avatarUrl,
    };

    const session = {
      email: profile.email,
      isAdmin: profile.isAdmin === true,
    };

    const response = NextResponse.json({
      profile: publicProfile(profile),
      session,
    });

    response.cookies.set("auth_user", serializeAuthSession(session), {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Não foi possível entrar agora." }, { status: 500 });
  }
}
