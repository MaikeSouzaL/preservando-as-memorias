---
pergunta: Como cadastre nova funeraria
gerado_em: 2026-06-25T22:24:58
---

# Como cadastre nova funeraria

[buscar cadastro funeraria]
(nenhum resultado para 'cadastro funeraria')

[buscar nova funeraria]
(nenhum resultado para 'nova funeraria')

[buscar cadastrar funeraria]
src/app/api/funeral-auth/register/route.ts:120: const message = error instanceof Error ? error.message : "Erro ao cadastrar funeraria.";

# src/app/api/funeral-auth/register/route.ts
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
    const inviteSlug = asString(body.inviteSlug);

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

      // Resolve invite terms (co

# src/app/api/funeral-auth/register/route.ts
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
    const inviteSlug = asString(body.inviteSlug);

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
        throw new Error("Ja existe uma funeraria cadastrada com este emai

## Arquivos consultados
- [[route.ts]] — `src/app/api/funeral-auth/register/route.ts`
