import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { updatePlatformData, type CuratorProfile } from "@/src/lib/platform-data";
import { hashPassword } from "@/src/lib/password";

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

    const profile = await updatePlatformData((data) => {
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
  } catch {
    return NextResponse.json({ error: "Não foi possível criar a conta agora." }, { status: 500 });
  }
}
