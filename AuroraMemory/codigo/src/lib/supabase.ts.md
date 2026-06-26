---
origem: src/lib/supabase.ts
origem_hash: d61f0098413749424e541ed95f991a73187af99a
gerado_em: 2026-06-25T23:37:23
---

# `src/lib/supabase.ts`

# `src/lib/supabase.ts` — Clientes Supabase

**Responsabilidade:** Fornece clientes Supabase configurados para diferentes contextos (sessão de usuário vs. admin).

## Funções exportadas

- **`createClientServer()`** — Cliente server-side vinculado à sessão do usuário via cookies. Usa `createServerClient` do `@supabase/ssr`. Ideal para API Routes e Server Components.
- **`createAdminClient()`** — Cliente admin com `service_role_key`, ignorando RLS. Desabilita refresh automático de token e persistência de sessão. Usa `fetch` sem cache. **Apenas para código server-side confiável.**

## Configuração

- `SUPABASE_URL` e `SUPABASE_ANON_KEY` de variáveis de ambiente `NEXT_PUBLIC_*`
- `SUPABASE_SERVICE_KEY` de variável privada `SUPABASE_SERVICE_ROLE_KEY`

## Consumo

Importado por ~20 arquivos (rotas API, auth, profile, upload, etc.) para operações no banco e autenticação.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** @supabase/ssr, @supabase/supabase-js, next/headers

## ⬅️ Importado por
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/ping/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/auth/[...nextauth]/route.ts`
- [[route.ts]] — `src/app/api/auth/definir-senha/route.ts`
- [[route.ts]] — `src/app/api/auth/login/route.ts`
- [[route.ts]] — `src/app/api/auth/logout/route.ts`
- [[route.ts]] — `src/app/api/auth/register/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/confirm/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/request/route.ts`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/users/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/profile/password/route.ts`
- [[route.ts]] — `src/app/api/profile/route.ts`
- [[route.ts]] — `src/app/api/upload/route.ts`
- [[route.ts]] — `src/app/auth/callback/route.ts`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

## 📤 Exporta
`createAdminClient`, `createClientServer`

## 🧠 Funções/Componentes definidos
`createAdminClient`, `createClientServer`, `getAll`, `setAll`

## 📞 O que cada função chama
- `createAdminClient()` → createClient, fetch
- `createClientServer()` → cookies, createServerClient
- `getAll()` → getAll
- `setAll()` → forEach, set

## 📲 Chamado por
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/ping/route.ts`
- [[route.ts]] — `src/app/api/admin/stats/route.ts`
- [[route.ts]] — `src/app/api/auth/[...nextauth]/route.ts`
- [[route.ts]] — `src/app/api/auth/definir-senha/route.ts`
- [[route.ts]] — `src/app/api/auth/login/route.ts`
- [[route.ts]] — `src/app/api/auth/logout/route.ts`
- [[route.ts]] — `src/app/api/auth/register/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/confirm/route.ts`
- [[route.ts]] — `src/app/api/auth/reset-password/request/route.ts`
- [[route.ts]] — `src/app/api/dev/platform-admin/route.ts`
- [[route.ts]] — `src/app/api/dev/users/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/profile/password/route.ts`
- [[route.ts]] — `src/app/api/profile/route.ts`
- [[route.ts]] — `src/app/api/upload/route.ts`
- [[route.ts]] — `src/app/auth/callback/route.ts`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

