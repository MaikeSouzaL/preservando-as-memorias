---
origem: src/app/api/funeral-auth/inventory/route.ts
origem_hash: b05730d2f77746467e04bebf160b06b871f13e14
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/funeral-auth/inventory/route.ts`

## API de Estoque (Funerária)

**Responsabilidade:** CRUD de itens de inventário para uma funerária autenticada.

### Endpoints

- **`GET /api/funeral-auth/inventory`** — Retorna itens de estoque da funerária logada (filtrados por `funeralHomeId`).
- **`POST /api/funeral-auth/inventory`** — Cria novo item. Requer `name` e `category` no body. Define `status` como "disponivel" se `quantity > 0`.
- **`PATCH /api/funeral-auth/inventory`** — Atualiza item existente (requer `id`). Recalcula `status` baseado na `quantity`.

### Autenticação

Todos os endpoints usam `getFuneralSession()` para validar sessão; retornam 401 se não autenticado.

### Dependências

- `src/lib/funeral-auth` — sessão da funerária
- `src/lib/platform-data` — `readPlatformData` (leitura) e `updatePlatformData` (escrita transacional)

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

