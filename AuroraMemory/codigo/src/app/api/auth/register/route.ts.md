---
origem: src/app/api/auth/register/route.ts
origem_hash: 357da8875a5c89d52cc738402a8c673047d75cfd
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/auth/register/route.ts`

## `src/app/api/auth/register/route.ts`

**Responsabilidade:** Endpoint de cadastro de usuários (`POST /api/auth/register`).

**Função principal:**
- `POST(request)`: Processa registro com nome, email e senha; valida campos (senha ≥ 8 caracteres); cria usuário via Supabase Auth; insere perfil na tabela `profiles` via admin client (bypass RLS); retorna dados do perfil e sessão.

**Parâmetros/Props:**
- `request`: `NextRequest` com JSON body (`name`, `email`, `password`)

**APIs/Endpoints:**
- Define: `POST /api/auth/register`
- Consome: Supabase Auth (`signUp`), tabela `profiles` (`upsert`)

**Integrações:**
- `src/lib/supabase.ts`: `createClientServer()` (auth), `createAdminClient()` (bypass RLS)
- `src/lib/rate-limit.ts`: `checkRateLimit()` — 5 tentativas/hora
- Redireciona confirmação email para `/auth/callback`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`

## 📞 O que cada função chama
- `POST()` → asString, checkRateLimit, createAdminClient, createClientServer, error, from, includes, json, signUp, toLowerCase, upsert
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[rate-limit.ts]] — `src/lib/rate-limit.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

