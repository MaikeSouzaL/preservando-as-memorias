import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Supabase OAuth callback handler.
 * Supabase redirects here after Google (or any provider) authentication.
 * It exchanges the code for a session and redirects the user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClientServer();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
