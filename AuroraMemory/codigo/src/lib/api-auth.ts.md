---
origem: src/lib/api-auth.ts
origem_hash: f2ea88f3688f02d8553e931366a38d2d198b4cd0
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/api-auth.ts`

## `src/lib/api-auth.ts` — Guarda de Autenticação para Rotas Admin

**Responsabilidade:** Middleware de autorização para endpoints administrativos. Verifica sessão ativa e permissão de administrador.

**Função principal:**
- `requireAdminSession()` → Retorna `AdminGuard` com sessão válida ou resposta de erro (401/403)

**Tipos:**
- `AdminGuard`: União discriminada — `{ session, response: null }` (sucesso) ou `{ session: null, response }` (erro)

**Fluxo:**
1. Obtém sessão via `getAuthSession()` (de `auth-session.ts`)
2. Retorna 401 se não houver sessão
3. Retorna 403 se `isAdmin` for falso
4. Retorna sessão válida se aprovado

**Uso:** Importado por 11 rotas admin (`/api/admin/*`) e `/api/platform-config` para proteger endpoints.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- **Externos/APIs:** next/server

## ⬅️ Importado por
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`
- [[route.ts]] — `src/app/api/admin/complaints/route.ts`
- [[route.ts]] — `src/app/api/admin/contracts/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/[id]/delivery/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/admin/tributes/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`

## 📤 Exporta
`requireAdminSession`

## 🧩 Componentes usados
AdminGuard

## 🧠 Funções/Componentes definidos
`requireAdminSession`

## 📞 O que cada função chama
- `requireAdminSession()` → getAuthSession, json

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`

## 📲 Chamado por
- [[route.ts]] — `src/app/api/admin/bank-data/route.ts`
- [[route.ts]] — `src/app/api/admin/complaints/route.ts`
- [[route.ts]] — `src/app/api/admin/contracts/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/[id]/route.ts`
- [[route.ts]] — `src/app/api/admin/funeral-homes/route.ts`
- [[route.ts]] — `src/app/api/admin/memorial/[id]/delivery/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/admin/tributes/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`

