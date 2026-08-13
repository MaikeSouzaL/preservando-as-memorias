import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth-session";
import { updatePlatformData } from "@/src/lib/platform-data";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

/** Acessível por admin parceiro OU dev admin — cria memorial já ativo, sem cobrança. */
export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão obrigatória." }, { status: 401 });
  }
  if (!session.isAdmin && !session.isDevAdmin) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const name = str(body.name);
    if (!name) {
      return NextResponse.json({ error: "Nome do falecido é obrigatório." }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Usa o próprio usuário admin como owner do memorial
    let ownerId = session.userId;

    // Se informou e-mail de responsável, tenta usar esse perfil como owner
    const contactEmail = str(body.contactEmail).toLowerCase();
    if (contactEmail) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", contactEmail)
        .single();
      if (existingProfile) ownerId = existingProfile.id;
    }

    const memorialId = crypto.randomUUID();
    const qrId = crypto.randomUUID();
    const now = new Date().toISOString();

    const rawGallery: { title: string; url: string }[] = Array.isArray(body.gallery)
      ? (body.gallery as { title: string; url: string }[]).filter((g) => g?.url)
      : [];
    const gallery = rawGallery.map((g, i) => ({
      id: crypto.randomUUID(),
      title: str(g.title) || `Foto ${i + 1}`,
      url: str(g.url),
    }));

    const rawTimeline: { year: string; title: string; description: string; longStory: string; imageUrl: string }[] =
      Array.isArray(body.timelineEvents)
        ? (body.timelineEvents as any[]).filter((t) => t?.year && t?.title)
        : [];
    const timelineEvents = rawTimeline.map((t) => ({
      id: crypto.randomUUID(),
      year: str(t.year),
      title: str(t.title),
      description: str(t.description),
      longStory: str(t.longStory),
      imageUrl: str(t.imageUrl),
    }));

    const memorial = {
      id: memorialId,
      ownerId,
      name,
      nickname: str(body.nickname) || undefined,
      birthDate: str(body.birthDate) || undefined,
      deathDate: str(body.deathDate) || undefined,
      city: str(body.city) || undefined,
      epitaph: str(body.epitaph) || "Uma história preservada com carinho.",
      biography: str(body.biography) || "",
      imageUrl: str(body.imageUrl) || "/images/hero-bg.png",
      audioUrl: str(body.audioUrl) || undefined,
      videoUrl: str(body.videoUrl) || undefined,
      gallery,
      timelineEvents,
      // Ativo imediatamente — criado por admin, sem cobrança
      status: "ativo" as const,
      paymentStatus: "paid" as const,
      qrUnlocked: true,
      source: "customer" as const,
      visits: 0,
      deliveryAddress: body.deliveryAddress?.recipientName ? body.deliveryAddress : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const qrCode = {
      id: qrId,
      memorialId,
      publicPath: `/memorial-publico?memorial=${memorialId}`,
      scans: 0,
      status: "ativo" as const,
      kind: "memorial" as const,
      createdAt: now,
    };

    await updatePlatformData((data) => {
      data.memorials.unshift(memorial);
      data.qrCodes.unshift(qrCode);
    });

    return NextResponse.json({ memorialId, publicUrl: `/memorial-publico?memorial=${memorialId}` }, { status: 201 });
  } catch (err) {
    console.error("[admin/memorial]", err);
    return NextResponse.json({ error: "Não foi possível criar o memorial." }, { status: 500 });
  }
}
