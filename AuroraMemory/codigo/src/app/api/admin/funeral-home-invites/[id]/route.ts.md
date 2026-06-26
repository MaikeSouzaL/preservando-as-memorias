---
origem: src/app/api/admin/funeral-home-invites/[id]/route.ts
origem_hash: 9c9dff9edf39aaaff8d93e07ae77fe9a311eef98
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/funeral-home-invites/[id]/route.ts`

# `route.ts` — Admin: Gerenciamento de Convites de Funerárias

**Responsabilidade:** Endpoints `PATCH` e `DELETE` para administradores atualizarem ou removerem convites individuais de funerárias.

## Endpoints

- **`PATCH`** — Atualiza campos de um convite (`status`, `label`, `notes`). Valida status contra `["active", "used", "expired"]`. Retorna `{ config }` atualizado ou erro 400.
- **`DELETE`** — Remove um convite pelo `id`. Retorna `{ config }` atualizado ou erro 400 se não encontrado.

## Dependências

- `requireAdminSession` (autenticação) — bloqueia requisições não-admin.
- `updatePlatformData` — mutação atômica dos dados da plataforma.

## Relações

- Consome `src/lib/api-auth` e `src/lib/platform-data`.
- Exporta handlers para rota dinâmica `[id]`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`DELETE`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`DELETE`, `PATCH`

## 📞 O que cada função chama
- `DELETE()` → filter, json, requireAdminSession, updatePlatformData
- `PATCH()` → String, findIndex, includes, json, requireAdminSession, trim, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

