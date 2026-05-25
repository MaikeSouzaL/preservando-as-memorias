import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { hashPassword } from "@/src/lib/password";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function publicProfile(profile: any) {
  const safeProfile = { ...profile };
  delete safeProfile.password;
  return safeProfile;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = asString(body.name);
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Informe nome, e-mail e senha." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha precisa ter pelo menos 8 caracteres." }, { status: 400 });
    }

    // 1. Conecta ao MongoDB Atlas
    await connectToDatabase();

    // 2. Verifica se o e-mail já existe
    const existing = await Curator.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
    }

    // 3. Cria o novo curador no MongoDB
    const isAdmin = email.includes("admin");
    const hashedPassword = hashPassword(password);
    const newCurator = await Curator.create({
      name,
      email,
      bio: asString(body.bio) || `Guardião das memórias da família. Curadoria de lembranças criada por ${name}.`,
      theme: "noturno",
      privacy: "public",
      notifyVelas: true,
      notifyTributos: true,
      multiFactorEnabled: false,
      language: "pt-BR",
      timezone: "GMT-3",
      globalAudio: true,
      isAdmin,
      password: hashedPassword,
    });

    const profile = {
      name: newCurator.name,
      email: newCurator.email,
      bio: newCurator.bio,
      theme: newCurator.theme,
      privacy: newCurator.privacy,
      notifyVelas: newCurator.notifyVelas,
      notifyTributos: newCurator.notifyTributos,
      multiFactorEnabled: newCurator.multiFactorEnabled,
      language: newCurator.language,
      timezone: newCurator.timezone,
      globalAudio: newCurator.globalAudio,
      isAdmin: newCurator.isAdmin,
      avatarUrl: newCurator.avatarUrl,
    };

    const session = {
      email: profile.email,
      isAdmin: profile.isAdmin === true,
    };
    const response = NextResponse.json({ profile: publicProfile(profile), session }, { status: 201 });

    response.cookies.set("auth_user", serializeAuthSession(session), {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Erro no cadastro:", err);
    return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
  }
}
