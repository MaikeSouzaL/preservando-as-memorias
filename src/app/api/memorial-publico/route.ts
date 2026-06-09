import { NextResponse } from "next/server";
import { updatePlatformData } from "@/src/lib/platform-data";
import { createAdminClient } from "@/src/lib/supabase";

export const dynamic = "force-dynamic";

function asString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = asString(body.email).toLowerCase();
    const familyName = asString(body.familyName);
    const name = asString(body.name);

    if (!email || !familyName || !name) {
      return NextResponse.json(
        { error: "Nome do falecido, seu nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Find or create the user
    let userId: string;
    let needsPassword = false;

    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("email", email).single();

    if (existingProfile) {
      userId = existingProfile.id;
      // Check if user has a password set via auth
      needsPassword = false;
    } else {
      // Create a new Supabase auth user (passwordless — user will set password later)
      const serviceKeySet = process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("ADICIONE");

      if (serviceKeySet) {
        const { data: newUser, error: createError } = await (supabase as any).auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: familyName, name: familyName },
        });

        if (createError || !newUser?.user) {
          return NextResponse.json({ error: "Não foi possível criar a conta." }, { status: 500 });
        }

        userId = newUser.user.id;
        needsPassword = true;
      } else {
        // Fallback: create profile manually (auth user will be created on first real login)
        userId = crypto.randomUUID();
        await supabase.from("profiles").insert({
          id: userId,
          email,
          name: familyName,
          is_admin: false,
        });
        needsPassword = true;
      }
    }

    // Build memorial objects
    const memorialId = crypto.randomUUID();
    const qrId = crypto.randomUUID();
    const now = new Date().toISOString();

    const rawGallery: { title: string; url: string }[] = Array.isArray(body.gallery)
      ? (body.gallery as { title: string; url: string }[]).filter((g) => g?.url)
      : [];
    const gallery = rawGallery.map((g, i) => ({
      id: crypto.randomUUID(),
      title: asString(g.title) || `Foto ${i + 1}`,
      url: asString(g.url),
    }));

    const rawTimeline: { year: string; title: string; description: string; longStory: string; imageUrl: string }[] =
      Array.isArray(body.timelineEvents)
        ? (body.timelineEvents as any[]).filter((t) => t?.year && t?.title)
        : [];
    const timelineEvents = rawTimeline.map((t) => ({
      id: crypto.randomUUID(),
      year: asString(t.year),
      title: asString(t.title),
      description: asString(t.description),
      longStory: asString(t.longStory),
      imageUrl: asString(t.imageUrl),
    }));

    const memorial = {
      id: memorialId,
      ownerId: userId,
      name,
      nickname: asString(body.nickname) || undefined,
      birthDate: asString(body.birthDate) || undefined,
      deathDate: asString(body.deathDate) || undefined,
      city: asString(body.city) || undefined,
      epitaph: asString(body.epitaph) || "Uma história preservada com carinho.",
      biography: asString(body.biography) || "",
      imageUrl: asString(body.imageUrl) || "/images/hero-bg.png",
      audioUrl: asString(body.audioUrl) || undefined,
      gallery,
      timelineEvents,
      status: "pending_payment" as const,
      paymentStatus: "pending" as const,
      qrUnlocked: false,
      source: "customer" as const,
      visits: 0,
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

    return NextResponse.json({ memorialId, userId, needsPassword }, { status: 201 });
  } catch (err) {
    console.error("[memorial-publico]", err);
    return NextResponse.json({ error: "Não foi possível criar o memorial agora." }, { status: 500 });
  }
}
