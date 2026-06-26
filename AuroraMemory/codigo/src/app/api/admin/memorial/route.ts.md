---
origem: src/app/api/admin/memorial/route.ts
origem_hash: 24e673112dd1707298b44d02d56cbe30c20c903a
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/memorial/route.ts`

# Admin Memorial API Route

**Responsabilidade:** Cria memoriais diretamente por administradores (parceiros ou dev), sem cobrança, já ativos.

## Função principal
- **`POST`**: Cria memorial com dados fornecidos (nome obrigatório). Usa sessão do admin como owner, ou busca perfil por `contactEmail`. Gera IDs únicos, estrutura galeria e timeline, insere no Supabase via `updatePlatformData`.

## Parâmetros do body
- `name` (obrigatório), `nickname`, `birthDate`, `deathDate`, `city`, `epitaph`, `biography`, `imageUrl`, `audioUrl`, `videoUrl`, `gallery[]`, `timelineEvents[]`, `deliveryAddress`, `contactEmail`

## Conexões
- **auth-session**: valida sessão e permissões admin
- **platform-data**: persiste memorial e QR code no Supabase
- **supabase**: busca perfil por email (profiles)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `str`

## 📞 O que cada função chama
- `POST()` → createAdminClient, eq, error, filter, from, getAuthSession, isArray, json, map, randomUUID, select, single, str, toISOString, toLowerCase, unshift, updatePlatformData
- `str()` → trim

## 🔁 Chama (arquivos)
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

