import { cookies } from "next/headers";

export type AuthSession = {
  email: string;
  isAdmin: boolean;
  needsPassword?: boolean;
};

export function serializeAuthSession(session: AuthSession) {
  return JSON.stringify(session);
}

function parseAuthCookie(value: string): unknown {
  const candidates = [value];
  let decoded = value;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      decoded = decodeURIComponent(decoded);
      candidates.push(decoded);
    } catch {
      break;
    }
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  return null;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_user");

  if (!authCookie?.value) {
    return null;
  }

  try {
    const session = parseAuthCookie(authCookie.value);
    const sessionRecord = session && typeof session === "object" ? (session as Record<string, unknown>) : null;
    const rawEmail = sessionRecord?.email;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email) {
      return null;
    }

    return {
      email,
      isAdmin: sessionRecord?.isAdmin === true,
    };
  } catch {
    return null;
  }
}
