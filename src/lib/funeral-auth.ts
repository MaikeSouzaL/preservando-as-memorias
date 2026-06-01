import { cookies } from "next/headers";

export type FuneralSession = {
  funeralHomeId: string;
  email: string;
  name: string;
};

export async function getFuneralSession(): Promise<FuneralSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("funeral_session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(sessionCookie.value);
    const session = JSON.parse(decoded);
    
    if (!session?.funeralHomeId || !session?.email) {
      return null;
    }

    return {
      funeralHomeId: session.funeralHomeId,
      email: session.email,
      name: session.name || "",
    };
  } catch {
    return null;
  }
}

export function serializeFuneralSession(session: FuneralSession): string {
  return encodeURIComponent(JSON.stringify(session));
}
