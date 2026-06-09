import { createClientServer } from "@/src/lib/supabase";

export type AuthSession = {
  email: string;
  isAdmin: boolean;
  isDevAdmin: boolean;
  userId: string;
  needsPassword?: boolean;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createClientServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, is_dev_admin")
      .eq("id", user.id)
      .single();

    return {
      email: user.email.toLowerCase().trim(),
      isAdmin: profile?.is_admin ?? false,
      isDevAdmin: profile?.is_dev_admin ?? false,
      userId: user.id,
    };
  } catch {
    return null;
  }
}

/** @deprecated Session is now managed by Supabase — this helper is kept only for legacy cookie-clearing at logout. */
export function serializeAuthSession(session: AuthSession) {
  return JSON.stringify(session);
}
