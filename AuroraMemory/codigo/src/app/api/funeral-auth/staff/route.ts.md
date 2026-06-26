---
origem: src/app/api/funeral-auth/staff/route.ts
origem_hash: 829fc2bd6ec86bce0e7e6579383bff4b0e0f24fa
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/funeral-auth/staff/route.ts`

# API de Staff (Funerária)

**Responsabilidade:** CRUD de membros da equipe vinculados à funerária autenticada.

## Endpoints

- **`GET /api/funeral-auth/staff`** — Lista membros da funerária da sessão atual.
- **`POST /api/funeral-auth/staff`** — Cria novo membro (requer `name`, `role`, `phone` no body).
- **`PATCH /api/funeral-auth/staff`** — Atualiza membro existente (requer `id` no body).

## Funcionamento

- Autentica via `getFuneralSession()` — retorna 401 se não autenticado.
- Lê/escreve dados em `readPlatformData()` / `updatePlatformData()`.
- Filtra membros por `funeralHomeId` da sessão.
- Gera ID no formato `staff_<timestamp>`.

## Dependências

- `src/lib/funeral-auth` — sessão da funerária.
- `src/lib/platform-data` — persistência e tipo `StaffMember`.

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

