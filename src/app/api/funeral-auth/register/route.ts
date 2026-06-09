import { NextResponse } from "next/server";
import { updatePlatformData } from "@/src/lib/platform-data";
import { hashPassword } from "@/src/lib/password";

export const dynamic = "force-dynamic";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = asString(body.name);
    const email = asString(body.email).toLowerCase();
    const password = asString(body.password);
    const contactName = asString(body.contactName);
    const phone = asString(body.phone);
    const cnpj = asString(body.cnpj);
    const city = asString(body.city);
    const state = asString(body.state);

    if (!name || !email || !password || !contactName || !phone) {
      return NextResponse.json(
        { error: "Nome, email, senha, contato e telefone sao obrigatorios." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalido." },
        { status: 400 }
      );
    }

    const funeralHome = await updatePlatformData((data) => {
      const existing = data.funeralHomes.find((fh) => fh.email === email);
      if (existing) {
        throw new Error("Ja existe uma funeraria cadastrada com este email.");
      }

      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) + "-" + Date.now().toString(36).slice(-4);

      const newFuneralHome = {
        id: `fh_${Date.now().toString(36)}`,
        name,
        slug,
        contactName,
        email,
        phone,
        cnpj: cnpj || undefined,
        city: city || undefined,
        state: state || undefined,
        passwordHash: hashPassword(password),
        isActive: false,
        approvalStatus: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.funeralHomes.push(newFuneralHome);
      return newFuneralHome;
    });

    return NextResponse.json({
      funeralHome: { ...funeralHome, passwordHash: undefined },
      message: "Cadastro realizado! Aguarde a aprovação do administrador para acessar o sistema.",
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao cadastrar funeraria.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
