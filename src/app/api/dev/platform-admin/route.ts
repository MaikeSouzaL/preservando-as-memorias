import { NextResponse } from "next/server";
import { requireDevAdminSession } from "@/src/lib/dev-auth";
import { readPlatformData, updatePlatformData } from "@/src/lib/platform-data";
import { connectToDatabase } from "@/src/lib/mongodb";
import { Curator } from "@/src/models/Curator";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();
  const email = data.platformAdminEmail ?? null;

  if (!email) {
    return NextResponse.json({ admin: null });
  }

  await connectToDatabase();
  const curator = await Curator.findOne({ email }).lean();

  return NextResponse.json({
    admin: curator
      ? { email: curator.email, name: curator.name, createdAt: curator.createdAt }
      : { email, name: null, createdAt: null },
  });
}

export async function PATCH(request: Request) {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const body = await request.json();
  const newEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!newEmail || !newEmail.includes("@")) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  await connectToDatabase();

  const newAdminCurator = await Curator.findOne({ email: newEmail });
  if (!newAdminCurator) {
    return NextResponse.json(
      { error: "Nenhum usuário cadastrado com esse e-mail. O operador precisa criar conta antes." },
      { status: 404 }
    );
  }

  const data = await readPlatformData();
  const previousEmail = data.platformAdminEmail;

  // Revoke isAdmin from previous admin
  if (previousEmail && previousEmail !== newEmail) {
    await Curator.updateOne({ email: previousEmail }, { isAdmin: false });
  }

  // Grant isAdmin to new admin
  await Curator.updateOne({ email: newEmail }, { isAdmin: true });

  await updatePlatformData((d) => { d.platformAdminEmail = newEmail; });

  return NextResponse.json({
    success: true,
    admin: { email: newAdminCurator.email, name: newAdminCurator.name },
  });
}

export async function DELETE() {
  const guard = await requireDevAdminSession();
  if (guard.response) return guard.response;

  const data = await readPlatformData();
  if (data.platformAdminEmail) {
    await connectToDatabase();
    await Curator.updateOne({ email: data.platformAdminEmail }, { isAdmin: false });
    await updatePlatformData((d) => { d.platformAdminEmail = undefined; });
  }

  return NextResponse.json({ success: true });
}
