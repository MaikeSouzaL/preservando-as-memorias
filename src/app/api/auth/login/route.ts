import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { updatePlatformData, type CuratorProfile } from "@/src/lib/platform-data";
import { hashPassword, verifyPassword } from "@/src/lib/password";

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

    const profile = await updatePlatformData((data) => {
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
  } catch {
    return NextResponse.json({ error: "Não foi possível entrar agora." }, { status: 500 });
  }
}
