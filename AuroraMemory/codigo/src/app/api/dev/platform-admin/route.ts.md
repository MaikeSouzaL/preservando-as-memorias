---
origem: src/app/api/dev/platform-admin/route.ts
origem_hash: fb094590dd97841b3ffe5ea5f82dda5b56d83f44
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/dev/platform-admin/route.ts`

# API de Administração da Plataforma (Dev)

**Responsabilidade:** Gerenciar o administrador da plataforma (apenas para desenvolvedores).

## Endpoints

- **`GET`** — Retorna dados do admin atual (email, nome, data de criação) ou `null` se não definido.
- **`PATCH`** — Define um novo admin: valida email, verifica se o usuário existe em `profiles`, atualiza `is_admin` no anterior e no novo, persiste em `platformAdminEmail`.
- **`DELETE`** — Remove o admin atual: limpa `is_admin` no perfil e apaga `platformAdminEmail`.

## Dependências

- `requireDevAdminSession()` — protege todas as rotas (exige sessão de dev admin).
- `readPlatformData()` / `updatePlatformData()` — leitura/escrita dos dados da plataforma.
- `createAdminClient()` — cliente Supabase com role de admin.

## Observações

- Força `dynamic` para evitar cache.
- Retorna erros 400 (email inválido) e 404 (usuário inexistente).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`DELETE`, `GET`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`DELETE`, `GET`, `PATCH`

## 📞 O que cada função chama
- `DELETE()` → createAdminClient, eq, from, json, readPlatformData, requireDevAdminSession, update, updatePlatformData
- `GET()` → createAdminClient, eq, from, json, readPlatformData, requireDevAdminSession, select, single
- `PATCH()` → createAdminClient, eq, from, includes, json, readPlatformData, requireDevAdminSession, select, single, toLowerCase, trim, update, updatePlatformData

## 🔁 Chama (arquivos)
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

