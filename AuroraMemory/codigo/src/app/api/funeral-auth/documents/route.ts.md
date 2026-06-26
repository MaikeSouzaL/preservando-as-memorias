---
origem: src/app/api/funeral-auth/documents/route.ts
origem_hash: 7922004c3d20e4c2a86e070accaafa10fff80e9b
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-auth/documents/route.ts`

# API de Documentos Funerários

**Responsabilidade:** CRUD de documentos funerários autenticados por sessão.

## Endpoints

- **`GET`** — Lista documentos da funerária autenticada (filtra por `funeralHomeId` da sessão)
- **`POST`** — Cria documento (requer `type` e `issueDate` no body; gera `id` e `createdAt` automaticamente)
- **`PATCH`** — Atualiza documento existente (requer `id` no body; protege `id`, `funeralHomeId` e `createdAt`)

## Validações

- Todos os endpoints exigem sessão válida (`getFuneralSession`)
- `POST` valida campos obrigatórios; `PATCH` valida `id`
- Erros retornam status 401 (não autenticado), 400 (validação) ou 500 (interno)

## Dependências

- `getFuneralSession` (src/lib/funeral-auth) — autenticação
- `readPlatformData` / `updatePlatformData` (src/lib/platform-data) — persistência de dados
- `FuneralDocument` — tipo do documento gerenciado

<!-- aurora:relacoes -->

## 🔗 Importa
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `PATCH`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`, `POST`

## 📞 O que cada função chama
- `GET()` → filter, getFuneralSession, json, readPlatformData
- `PATCH()` → assign, find, getFuneralSession, json, updatePlatformData
- `POST()` → getFuneralSession, json, now, push, toISOString, toString, updatePlatformData

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

