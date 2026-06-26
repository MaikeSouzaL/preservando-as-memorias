---
origem: src/app/api/memorial-publico/route.ts
origem_hash: 671da27bbb1714b7f8a89b48994b5239882e783f
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/memorial-publico/route.ts`

# API Route: POST /api/memorial-publico

**Responsabilidade:** Cria um memorial público (customer) — lida com criação de usuário, memorial e QR code.

**Função principal:**
- `POST()`: Recebe dados do formulário público, valida campos obrigatórios (email, familyName, name), cria ou localiza usuário no Supabase (auth + profiles), gera memorial com galeria e timeline, e persiste via `updatePlatformData`.

**Parâmetros do body:** `email`, `familyName`, `name` (obrigatórios); `nickname`, `birthDate`, `deathDate`, `city`, `epitaph`, `biography`, `imageUrl`, `audioUrl`, `videoUrl`, `gallery[]`, `timelineEvents[]`, `deliveryAddress`.

**APIs/endpoints:** Consome `profiles` (Supabase) e `auth.admin.createUser` (se service key configurada). Define rota dinâmica (`force-dynamic`).

**Conexões:** Importa `updatePlatformData` (persistência local), `createAdminClient` (Supabase admin), `getAuthSession` (verifica se admin).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`

## 📞 O que cada função chama
- `POST()` → asString, createAdminClient, createUser, eq, error, filter, from, getAuthSession, insert, isArray, json, map, randomUUID, select, single, startsWith, toISOString, toLowerCase, unshift, updatePlatformData
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

