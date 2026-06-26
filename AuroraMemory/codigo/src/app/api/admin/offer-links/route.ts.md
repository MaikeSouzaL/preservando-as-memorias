---
origem: src/app/api/admin/offer-links/route.ts
origem_hash: 88df6aaacfaf3d6b721cb82e3e99a69fb346a6b6
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/offer-links/route.ts`

# Admin Offer Links API Route

**Responsabilidade:** CRUD de links de ofertas de funerárias (admin).

## Endpoints

- **`GET`** — Retorna todas as ofertas e funerárias cadastradas.
- **`POST`** — Cria nova oferta. Se `funeralHomeId` for informado, título é herdado do nome da funerária. Campos obrigatórios: `cycle`, `priceCents`.
- **`PATCH`** — Atualiza `status` de uma oferta pelo `id`.
- **`DELETE`** — Remove oferta pelo parâmetro `id` na query string.

## Funções auxiliares

- **`generateSlug(title)`** — Gera slug a partir do título (normaliza, remove acentos, trunca em 60 caracteres).

## Dependências

- **`readPlatformData` / `updatePlatformData`** (`src/lib/platform-data.ts`) — Leitura e escrita dos dados da plataforma (arquivo JSON).

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`DELETE`, `GET`, `PATCH`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`DELETE`, `GET`, `PATCH`, `POST`, `generateSlug`

## 📞 O que cada função chama
- `DELETE()` → findIndex, get, json, splice, updatePlatformData
- `GET()` → json, readPlatformData
- `PATCH()` → find, json, toISOString, updatePlatformData
- `POST()` → Number, String, find, generateSlug, json, now, push, toISOString, toString, trim, updatePlatformData
- `generateSlug()` → normalize, replace, slice, toLowerCase

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

