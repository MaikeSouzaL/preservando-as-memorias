---
origem: src/app/api/admin/ping/route.ts
origem_hash: 18071f3b6383671d3bcc1a00132248c8b5bb943e
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/admin/ping/route.ts`

# Admin Ping API Route

**Responsabilidade:** Registrar silenciosamente o timestamp de acesso de administradores parceiros no sistema.

**Endpoint:** `POST /api/admin/ping`

**Funcionamento:**
- Chamado pelo `AdminShell` no mount do componente
- Verifica se o usuário é admin (`isAdmin`) e **não** é dev admin (`isDevAdmin`)
- Atualiza o campo `last_seen_at` na tabela `profiles` do Supabase com o timestamp atual
- Retorna `{ ok: true }` em caso de sucesso, `{ ok: false }` caso contrário

**Dependências:**
- `getAuthSession()` de `src/lib/auth-session` — obtém sessão do usuário
- `createAdminClient()` de `src/lib/supabase` — cliente Supabase com permissões de admin

**Configuração:** `dynamic = "force-dynamic"` garante execução em tempo real sem cache.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`

## 📞 O que cada função chama
- `POST()` → createAdminClient, eq, from, getAuthSession, json, toISOString, update

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

