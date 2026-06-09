import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Legacy NextAuth route — now redirects Google OAuth through Supabase.
 * The frontend should call /api/auth/google-login directly.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const supabase = await createClientServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001"}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001"}/login?error=oauth_failed`);
  }

  return NextResponse.redirect(data.url);
}
