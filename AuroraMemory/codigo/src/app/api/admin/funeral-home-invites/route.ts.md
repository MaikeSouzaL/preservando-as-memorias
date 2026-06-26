---
origem: src/app/api/admin/funeral-home-invites/route.ts
origem_hash: 7e074ef74d41ff5e9cd7da10d24bd4676973413c
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/funeral-home-invites/route.ts`

## Admin – Convites para Funerárias (API)

**Responsabilidade:** CRUD de convites para funerárias no painel administrativo.

### Endpoints

- **`GET /api/admin/funeral-home-invites`** – Retorna lista de convites e planos funerários atuais.
- **`POST /api/admin/funeral-home-invites`** – Cria novo convite com slug único, label, comissão opcional (0–100%), `activePlanId`, `planRenewsAt` e `notes`.

### Fluxo

1. **`requireAdminSession()`** – Protege ambas as rotas (retorna 401 se não autenticado).
2. **`readPlatformData()` / `updatePlatformData()`** – Lê/atualiza `config.funeralHomeInvites` no armazenamento global.
3. Geração automática de slug (sanitizado + sufixo `Date.now`) se não fornecido.
4. Validações: slug único, comissão entre 0–100, label obrigatório.

### Conexões

- **`src/lib/api-auth`** – Middleware de autenticação admin.
- **`src/lib/platform-data`** – Persistência dos dados da plataforma.
- **`src/lib/platform-types`** – Tipo `FuneralHomeInvite`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `POST`

## 📞 O que cada função chama
- `GET()` → json, readPlatformData, requireAdminSession
- `POST()` → Number, String, find, isNaN, json, normalize, now, replace, requireAdminSession, slice, toISOString, toLowerCase, toString, trim, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

