---
origem: src/app/api/funeral-auth/schedules/route.ts
origem_hash: 1ce8facd0c9a252413e754e3b7aee1b3bed7d883
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/schedules/route.ts`

# API de Agendamentos Funerários (Autenticado)

**Responsabilidade:** CRUD de agendamentos funerários para a funerária autenticada.

## Endpoints

- **`GET /`** — Lista agendamentos da funerária logada, ordenados por data/hora (mais antigos primeiro). Retorna `{ schedules: FuneralSchedule[] }`.
- **`POST /`** — Cria novo agendamento. Requer `deceasedName`, `type`, `dateTime`, `location` no body. Retorna `{ schedule }` (status 201).
- **`PATCH /`** — Atualiza agendamento existente. Requer `id` no body. Preserva `id`, `funeralHomeId` e `createdAt`.

## Autenticação

Todos os endpoints exigem sessão ativa (`getFuneralSession()`). Retorna 401 se não autenticado.

## Dependências

- `src/lib/funeral-auth` — sessão da funerária
- `src/lib/platform-data` — `readPlatformData` (GET) e `updatePlatformData` (POST/PATCH)

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
- `GET()` → filter, getFuneralSession, getTime, json, readPlatformData, sort
- `PATCH()` → assign, find, getFuneralSession, json, updatePlatformData
- `POST()` → getFuneralSession, json, now, push, toISOString, toString, updatePlatformData

## 🔁 Chama (arquivos)
- [[funeral-auth.ts]] — `src/lib/funeral-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

