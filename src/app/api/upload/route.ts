import { NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";
import { getAuthSession } from "@/src/lib/auth-session";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "audio/m4a", "audio/x-m4a", "audio/mp4"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo 20 MB." }, { status: 400 });
    }

    const supabase = await createClientServer();
    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type);
    const bucket = isAudio ? "memorial-audio" : "memorial-images";
    const ext = file.name.split(".").pop() ?? (isAudio ? "mp3" : "jpg");
    const userId = session?.userId ?? "anonymous";
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      // Fallback para base64 se o storage falhar (ex.: sem service role key)
      const base64 = Buffer.from(buffer).toString("base64");
      return NextResponse.json({ success: true, url: `data:${file.type};base64,${base64}` });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
