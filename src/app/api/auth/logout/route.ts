import { NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClientServer();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
