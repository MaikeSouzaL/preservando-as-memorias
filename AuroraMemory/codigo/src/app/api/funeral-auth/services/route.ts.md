---
origem: src/app/api/funeral-auth/services/route.ts
origem_hash: 55b50137d6093c5c81bf8821e86c22031d75f6f0
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/services/route.ts`

# API de Serviços Funerários (Autenticada)

**Responsabilidade:** CRUD de atendimentos funerários para a funerária autenticada.

## Endpoints

- **`GET /api/funeral-auth/services`** — Lista serviços da funerária logada (filtra por `funeralHomeId`)
- **`POST /api/funeral-auth/services`** — Cria novo serviço (campos obrigatórios: `deceasedName`, `deceasedDeathDate`, `familyContactName`, `familyContactPhone`)
- **`PATCH /api/funeral-auth/services`** — Atualiza serviço existente (requer `id` no body)

## Funcionamento

- Todos os endpoints exigem sessão válida (`getFuneralSession`)
- Usa `readPlatformData`/`updatePlatformData` para persistência
- Valida campos obrigatórios no POST e ID no PATCH
- Retorna erros 401 (não autenticado), 400 (validação) ou 500 (genérico)

## Dependências

- `src/lib/funeral-auth` — sessão da funerária
- `src/lib/platform-data` — acesso aos dados da plataforma

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
- `PATCH()` → assign, find, getFuneralSession, json, toISOString, updatePlatformData
- `POST()` → getFuneralSession, json, now, push, toISOString, toString, updatePlatformData

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

