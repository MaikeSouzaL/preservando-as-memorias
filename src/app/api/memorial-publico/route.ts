import { NextResponse } from "next/server";
import { serializeAuthSession } from "@/src/lib/auth-session";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";
import { updatePlatformData } from "@/src/lib/platform-data";

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

    await connectToDatabase();

    // Encontra ou cria a conta da família
    let curator = await Curator.findOne({ email });
    let needsPassword = false;

    if (!curator) {
      curator = await Curator.create({
        name: familyName,
        email,
        bio: `Família de ${name}`,
        theme: "noturno",
        privacy: "public",
        notifyVelas: true,
        notifyTributos: true,
        multiFactorEnabled: false,
        language: "pt-BR",
        timezone: "GMT-3",
        globalAudio: true,
        isAdmin: false,
      });
      needsPassword = true;
    } else {
      needsPassword = !curator.password;
    }

    // Cria o memorial como pending_payment
    const now = new Date().toISOString();
    const baseId = `mem_${Date.now().toString(36)}`;
    const id = `${baseId}_${Math.random().toString(36).slice(2, 6)}`;

    const gallery: { id: string; title: string; url: string }[] = [];
    const timelineEvents: { id: string; year: string; title: string; description: string; longStory: string; imageUrl: string }[] = [];

    const memorial = {
      id,
      ownerId: email,
      name,
      nickname: asString(body.nickname) || undefined,
      birthDate: asString(body.birthDate) || undefined,
      deathDate: asString(body.deathDate) || undefined,
      city: asString(body.city) || undefined,
      epitaph: asString(body.epitaph) || "Uma história preservada com carinho.",
      biography: asString(body.biography) || "",
      imageUrl: asString(body.imageUrl) || "/images/hero-bg.png",
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
      id: `qr_${baseId}_${Date.now().toString(36)}`,
      memorialId: id,
      publicPath: `/memorial-publico?memorial=${id}`,
      scans: 0,
      status: "ativo" as const,
      kind: "memorial" as const,
      createdAt: now,
    };

    await updatePlatformData((data) => {
      data.memorials.unshift(memorial);
      data.qrCodes.unshift(qrCode);
    });

    const session = { email, isAdmin: false, needsPassword };
    const response = NextResponse.json({ memorialId: id }, { status: 201 });

    response.cookies.set("auth_user", serializeAuthSession(session), {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[memorial-publico]", err);
    return NextResponse.json(
      { error: "Não foi possível criar o memorial agora." },
      { status: 500 }
    );
  }
}
