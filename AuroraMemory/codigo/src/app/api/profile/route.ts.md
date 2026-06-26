---
origem: src/app/api/profile/route.ts
origem_hash: 547b9eb28fa2dce5d2c303dbed1bc5f39bf59401
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/profile/route.ts`

# API de Perfil do Usuário

**Responsabilidade:** Gerenciar leitura e atualização do perfil do usuário autenticado.

## Endpoints

- **`GET /api/profile`** — Retorna perfil do usuário logado (requer sessão). Retorna `401` se não autenticado, `404` se perfil não encontrado.
- **`PATCH /api/profile`** — Atualiza campos do perfil (nome, bio, tema, privacidade, notificações, etc.). Valida tipos e sanitiza strings. Retorna perfil atualizado + dados da sessão.

## Funções auxiliares

- **`toPublicProfile(row)`** — Mapeia dados do banco para formato público com valores padrão.
- **`asString(value)`** — Sanitiza string (trim se for string, senão vazio).

## Dependências

- `getAuthSession()` — Obtém sessão do usuário.
- `createClientServer()` — Cliente Supabase server-side.
- Tabela `profiles` no Supabase.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`GET`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`, `asString`, `toPublicProfile`

## 📞 O que cada função chama
- `GET()` → createClientServer, eq, from, getAuthSession, json, select, single, toPublicProfile
- `PATCH()` → asString, createClientServer, eq, from, getAuthSession, json, select, single, toPublicProfile, trim, update
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

