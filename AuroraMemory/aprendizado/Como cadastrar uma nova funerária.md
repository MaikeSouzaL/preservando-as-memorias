---
pergunta: Como cadastrar uma nova funerária
gerado_em: 2026-06-25T19:55:33
---

# Como cadastrar uma nova funerária

[buscar cadastrar funerária]
(nenhum resultado para 'cadastrar funerária')

[buscar funeraria]
tsconfig.tsbuildinfo:1: {"fileNames":["./node_modules/typescript/lib/lib.es5.d.ts","./node_modules/typescript/lib/lib.es2015.d.ts","./node_modules/typescript/lib/lib.es2016.d.ts","./node_modules/typescript/lib/lib.es2017.d.t
src/components/funeral/funeraria-dashboard-client.tsx:138: export function FunerariaDashboardClient({
src/components/funeral/funeraria-dashboard-client.tsx:148: router.push("/funeraria/login");
src/components/funeral/funeraria-dashboard-client.tsx:194: href="/funeraria/dados-bancarios"
src/components/funeral/funeraria-dashboard-client.tsx:284: href="/funeraria/dashboard/novo-memorial"
src/components/funeral/funeraria-dashboard-client.tsx:303: href="/funeraria/dashboard/novo-memorial"
src/components/admin/admin-shell.tsx:22: { label: "Funerárias", icon: "store", href: "/admin/funerarias" },
src/components/admin/funerarias-page-client.tsx:794: export function FunerariasPageClient() {
src/app/api/webhooks/stripe/route.ts:67: order.planId === "memorial_funeraria" ? "Memorial Funerária" :
src/app/api/funeral-auth/register/route.ts:49: throw new Error("Ja existe uma funeraria cadastrada com este email.");
src/app/api/funeral-auth/register/route.ts:120: const message = error instanceof Error ? error.message : "Erro ao cadastrar funeraria.";
src/app/api/funeral-auth/memorials/route.ts:94: throw new Error("Funeraria nao encontrada ou inativa.");
src/app/api/funeral-auth/me/route.ts:19: return NextResponse.json({ error: "Funeraria nao encontrada." }, { status: 404 

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
  tr

## Arquivos consultados
- [[route.ts]] — `src/app/api/funeral-auth/register/route.ts`
