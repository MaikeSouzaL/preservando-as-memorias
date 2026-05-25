import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { updatePlatformData, type CuratorProfile } from "@/src/lib/platform-data";
import { hashPassword, verifyPassword } from "@/src/lib/password";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function publicProfile(profile: CuratorProfile) {
  const safeProfile: Omit<CuratorProfile, "password" | "passwordHash"> & Partial<Pick<CuratorProfile, "password" | "passwordHash">> = { ...profile };
  delete safeProfile.password;
  delete safeProfile.passwordHash;
  return safeProfile;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    const useMongo = !!process.env.MONGODB_URI;
    let profile: CuratorProfile | null = null;

    if (useMongo) {
      // 1. Conecta ao MongoDB Atlas
      await connectToDatabase();

      // 2. Busca o curador no MongoDB
      const curator = await Curator.findOne({ email });
      if (!curator) {
        return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
      }

      // 3. Verifica a senha hashada (no schema Mongoose o campo é "password")
      const matches = verifyPassword(password, curator.password || "");
      if (!matches) {
        return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
      }

      profile = {
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
        password: undefined,
        passwordHash: curator.password,
      };
    } else {
      // Fallback para o arquivo JSON local
      profile = await updatePlatformData((data) => {
        const index = data.profiles.findIndex((item) => item.email.toLowerCase().trim() === email);
        const current = index >= 0 ? data.profiles[index] : data.profile.email.toLowerCase().trim() === email ? data.profile : null;

        if (!current) {
          return null;
        }

        const hashMatches = verifyPassword(password, current.passwordHash);
        const legacyMatches = !current.passwordHash && current.password === password;

        if (!hashMatches && !legacyMatches) {
          return null;
        }

        const migrated: CuratorProfile = {
          ...current,
          password: undefined,
          passwordHash: current.passwordHash ?? hashPassword(password),
        };

        if (index >= 0) {
          data.profiles[index] = migrated;
        } else {
          data.profiles.push(migrated);
        }

        if (data.profile.email.toLowerCase().trim() === email) {
          data.profile = migrated;
        }

        return migrated;
      });
    }

    if (!profile) {
      return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }

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
