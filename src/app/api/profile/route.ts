import { NextResponse } from "next/server";
import { updatePlatformData, type CuratorProfile } from "@/src/lib/platform-data";
import { getAuthSession, serializeAuthSession } from "@/src/lib/auth-session";
import { hashPassword } from "@/src/lib/password";

export const dynamic = "force-dynamic";

function publicProfile(profile: CuratorProfile) {
  const safeProfile: Omit<CuratorProfile, "password" | "passwordHash"> & Partial<Pick<CuratorProfile, "password" | "passwordHash">> = { ...profile };
  delete safeProfile.password;
  delete safeProfile.passwordHash;
  return safeProfile;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function defaultProfile(email: string, name = "Novo Curador"): CuratorProfile {
  return {
    name,
    email,
    bio: "Guardião das memórias da família. Curadoria emocional de histórias e lembranças.",
    theme: "noturno",
    privacy: "public",
    notifyVelas: true,
    notifyTributos: true,
    multiFactorEnabled: false,
    language: "pt-BR",
    timezone: "GMT-3",
    globalAudio: true,
    isAdmin: email.includes("admin"),
  };
}

export async function GET() {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }

  const profile = await updatePlatformData((data) => {
    const found = data.profiles.find((item) => item.email.toLowerCase().trim() === session.email);

    if (found) {
      return found;
    }

    const next = data.profile.email.toLowerCase().trim() === session.email ? data.profile : defaultProfile(session.email);
    data.profiles.push(next);

    if (data.profile.email.toLowerCase().trim() === session.email) {
      data.profile = next;
    }

    return next;
  });

  return NextResponse.json({ profile: publicProfile(profile) });
}

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
    }

    const body = await request.json();
    const currentEmail = session.email;
    const nextEmail = asString(body.email).toLowerCase() || currentEmail;

    const updatedProfile = await updatePlatformData((data) => {
      const index = data.profiles.findIndex((p) => p.email.toLowerCase().trim() === currentEmail);
      const current: CuratorProfile =
        index !== -1
          ? data.profiles[index]
          : data.profile.email.toLowerCase().trim() === currentEmail
            ? data.profile
            : defaultProfile(currentEmail, asString(body.name) || "Novo Curador");

      const next: CuratorProfile = {
        ...current,
        name: asString(body.name) || current.name,
        email: nextEmail,
        bio: typeof body.bio === "string" ? body.bio : current.bio,
        theme: typeof body.theme === "string" ? body.theme : current.theme,
        privacy: body.privacy === "public" || body.privacy === "protected" || body.privacy === "private" ? body.privacy : current.privacy,
        notifyVelas: typeof body.notifyVelas === "boolean" ? body.notifyVelas : current.notifyVelas,
        notifyTributos: typeof body.notifyTributos === "boolean" ? body.notifyTributos : current.notifyTributos,
        multiFactorEnabled: typeof body.multiFactorEnabled === "boolean" ? body.multiFactorEnabled : current.multiFactorEnabled,
        language: typeof body.language === "string" ? body.language : current.language,
        timezone: typeof body.timezone === "string" ? body.timezone : current.timezone,
        globalAudio: typeof body.globalAudio === "boolean" ? body.globalAudio : current.globalAudio,
        isAdmin: session.isAdmin ? (typeof body.isAdmin === "boolean" ? body.isAdmin : current.isAdmin) : current.isAdmin,
        avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : current.avatarUrl,
        password: undefined,
        passwordHash: asString(body.password) ? hashPassword(asString(body.password)) : current.passwordHash,
      };

      if (index !== -1) {
        data.profiles[index] = next;
      } else {
        data.profiles.push(next);
      }

      if (data.profile.email.toLowerCase().trim() === currentEmail || data.profile.email.toLowerCase().trim() === nextEmail) {
        data.profile = next;
      }

      data.memorials = data.memorials.map((memorial) =>
        memorial.ownerId.toLowerCase().trim() === currentEmail ? { ...memorial, ownerId: nextEmail } : memorial
      );

      return next;
    });

    const nextSession = {
      email: updatedProfile.email,
      isAdmin: updatedProfile.isAdmin === true,
    };
    const response = NextResponse.json({ profile: publicProfile(updatedProfile), session: nextSession });

    response.cookies.set("auth_user", serializeAuthSession(nextSession), {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erro desconhecido" }, { status: 400 });
  }
}
