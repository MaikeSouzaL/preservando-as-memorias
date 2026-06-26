---
origem: src/lib/auth-session.ts
origem_hash: 4b7fb4599d0bfd0fd417e81ca0de640dab6f3648
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/auth-session.ts`

# `auth-session.ts` — Sessão de Autenticação

## Responsabilidade
Gerencia a sessão do usuário autenticado via Supabase, fornecendo dados de perfil e permissões.

## Tipos e Funções

- **`AuthSession`**: Tipo que define os dados da sessão (`email`, `userId`, `isAdmin`, `isDevAdmin`, `needsPassword?`).
- **`getAuthSession()`**: Função assíncrona que obtém o usuário atual do Supabase, consulta a tabela `profiles` para permissões (`is_admin`, `is_dev_admin`) e retorna um `AuthSession` ou `null` se não autenticado.
- **`serializeAuthSession()`**: **(depreciado)** Mantido apenas para limpeza de cookies legados no logout.

## Conexões
- **Importa**: `createClientServer` de `src/lib/supabase.ts`
- **Consome API**: Tabela `profiles` do Supabase
- **Usado por**: Múltiplos layouts, páginas e rotas de API (admin, dev, privado, público) para verificar autenticação e permissões.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** profiles

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/(admin)/admin/layout.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/memoriais/page.tsx`
- [[layout.tsx]] — `src/app/(dev)/layout.tsx`
- [[page.tsx]] — `src/app/(private)/assinaturas/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/homenagens/page.tsx`
- [[layout.tsx]] — `src/app/(private)/layout.tsx`
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/ping/route.ts`
- [[route.ts]] — `src/app/api/auth/definir-senha/route.ts`
- [[route.ts]] — `src/app/api/dev/backup/route.ts`
- [[route.ts]] — `src/app/api/me/stats/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/route.ts`
- [[route.ts]] — `src/app/api/memorials/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`
- [[route.ts]] — `src/app/api/profile/password/route.ts`
- [[route.ts]] — `src/app/api/profile/route.ts`
- [[route.ts]] — `src/app/api/upload/route.ts`
- [[page.tsx]] — `src/app/page.tsx`
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`

## 📤 Exporta
`AuthSession`, `getAuthSession`, `serializeAuthSession`

## 🧩 Componentes usados
AuthSession

## 🧠 Funções/Componentes definidos
`getAuthSession`, `serializeAuthSession`

## 📞 O que cada função chama
- `getAuthSession()` → createClientServer, eq, from, getUser, select, single, toLowerCase, trim
- `serializeAuthSession()` → stringify

## 🔁 Chama (arquivos)
- [[supabase.ts]] — `src/lib/supabase.ts`

## 📲 Chamado por
- [[layout.tsx]] — `src/app/(admin)/admin/layout.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/memoriais/page.tsx`
- [[layout.tsx]] — `src/app/(dev)/layout.tsx`
- [[page.tsx]] — `src/app/(private)/assinaturas/page.tsx`
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`
- [[page.tsx]] — `src/app/(private)/homenagens/page.tsx`
- [[layout.tsx]] — `src/app/(private)/layout.tsx`
- [[route.ts]] — `src/app/api/admin/memorial/route.ts`
- [[route.ts]] — `src/app/api/admin/ping/route.ts`
- [[route.ts]] — `src/app/api/auth/definir-senha/route.ts`
- [[route.ts]] — `src/app/api/dev/backup/route.ts`
- [[route.ts]] — `src/app/api/me/stats/route.ts`
- [[route.ts]] — `src/app/api/memorial-publico/route.ts`
- [[route.ts]] — `src/app/api/memorials/[id]/route.ts`
- [[route.ts]] — `src/app/api/memorials/route.ts`
- [[route.ts]] — `src/app/api/platform-config/route.ts`
- [[route.ts]] — `src/app/api/profile/password/route.ts`
- [[route.ts]] — `src/app/api/profile/route.ts`
- [[route.ts]] — `src/app/api/upload/route.ts`
- [[page.tsx]] — `src/app/page.tsx`
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`

