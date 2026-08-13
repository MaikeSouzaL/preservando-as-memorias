import { NextResponse } from "next/server";
import { createClientServer } from "@/src/lib/supabase";
import { getAuthSession } from "@/src/lib/auth-session";
import { checkRateLimit } from "@/src/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Extensão derivada do tipo MIME — nunca do nome do arquivo, que o cliente controla. */
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/aac": "aac",
  "audio/m4a": "m4a",
  "audio/x-m4a": "m4a",
  "audio/mp4": "m4a",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac", "audio/m4a", "audio/x-m4a", "audio/mp4"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_IMAGE_AUDIO_SIZE = 20 * 1024 * 1024;  // 20 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;        // 100 MB

export async function POST(request: Request) {
  const session = await getAuthSession();

  // O upload precisa continuar aberto: o familiar monta o memorial antes de
  // ter conta. Sem login o limite é bem mais apertado, por custo e abuso.
  const limited = await checkRateLimit(
    request as any,
    session ? "rl:upload" : "rl:upload-anon",
    session ? { limit: 60, windowSecs: 60 * 60 } : { limit: 15, windowSecs: 60 * 60 }
  );
  if (limited) return limited;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 400 });
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_AUDIO_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo ${isVideo ? "100" : "20"} MB.` },
        { status: 400 }
      );
    }

    const supabase = await createClientServer();
    const bucket = isAudio ? "memorial-audio" : isVideo ? "memorial-video" : "memorial-images";
    const ext = EXTENSION_BY_TYPE[file.type] ?? (isAudio ? "mp3" : isVideo ? "mp4" : "jpg");
    const userId = session?.userId ?? "anonimo";
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      // Não cair para base64: um vídeo de 100 MB viraria uma string gigante
      // gravada dentro da linha do memorial, inflando o banco em silêncio.
      console.error("Falha no upload para o Supabase Storage:", uploadError);
      return NextResponse.json(
        { error: "Não foi possível enviar o arquivo agora. Tente novamente." },
        { status: 502 }
      );
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
