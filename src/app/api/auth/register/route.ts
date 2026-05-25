import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { updatePlatformData, type CuratorProfile } from "@/src/lib/platform-data";
import { hashPassword } from "@/src/lib/password";
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
    const name = asString(body.name);
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Informe nome, e-mail e senha." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "A senha precisa ter pelo menos 8 caracteres." }, { status: 400 });
    }

    const useMongo = !!process.env.MONGODB_URI;
    let profile: CuratorProfile;

    if (useMongo) {
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
        password: hashedPassword, // No schema Mongoose o campo é password
      });

      profile = {
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
        password: undefined,
        passwordHash: newCurator.password,
      };
    } else {
      // Fallback para o arquivo JSON local
      profile = await updatePlatformData((data) => {
        const index = data.profiles.findIndex((item) => item.email.toLowerCase().trim() === email);
        const isAdmin = email.includes("admin");
        const current = index >= 0 ? data.profiles[index] : null;
        const next: CuratorProfile = {
          name,
          email,
          bio:
            asString(body.bio) ||
            `Guardião das memórias da família. Curadoria de lembranças criada por ${name}.`,
          theme: current?.theme ?? "noturno",
          privacy: current?.privacy ?? "public",
          notifyVelas: current?.notifyVelas ?? true,
          notifyTributos: current?.notifyTributos ?? true,
          multiFactorEnabled: current?.multiFactorEnabled ?? false,
          language: current?.language ?? "pt-BR",
          timezone: current?.timezone ?? "GMT-3",
          globalAudio: current?.globalAudio ?? true,
          isAdmin: current?.isAdmin ?? isAdmin,
          avatarUrl: current?.avatarUrl,
          password: undefined,
          passwordHash: hashPassword(password),
        };

        if (index >= 0) {
          data.profiles[index] = next;
        } else {
          data.profiles.push(next);
        }

        data.profile = next;
        return next;
      });
    }

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
