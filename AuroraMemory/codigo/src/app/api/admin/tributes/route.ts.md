---
origem: src/app/api/admin/tributes/route.ts
origem_hash: 79b26824293d3b180da62935718b7190a3ff77c0
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/tributes/route.ts`

# Admin Tributes API Route

**Responsabilidade:** Gerencia homenagens no painel administrativo (CRUD).

## Endpoints

- **`GET`** → Lista todas as homenagens com nome do memorial associado (`memorialName`). Requer sessão admin.
- **`PATCH`** → Atualiza status de uma homenagem (`aprovada`/`pendente`). Body: `{ id, status }`.
- **`DELETE`** → Remove homenagem por ID. Query param: `id`.

## Função auxiliar

- **`withMemorialNames`** → Enriquece cada tribute com o nome do memorial correspondente (ou "Memorial removido" se não encontrado).

## Dependências

- `requireAdminSession` (autenticação admin)
- `readPlatformData` / `updatePlatformData` (persistência de dados)

## Configuração

- `dynamic = "force-dynamic"` → Sem cache.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`DELETE`, `GET`, `PATCH`, `dynamic`

## 🧩 Componentes usados
ReturnType

## 🧠 Funções/Componentes definidos
`DELETE`, `GET`, `PATCH`, `withMemorialNames`

## 📞 O que cada função chama
- `DELETE()` → filter, get, json, readPlatformData, requireAdminSession, trim, updatePlatformData, withMemorialNames
- `GET()` → json, readPlatformData, requireAdminSession, withMemorialNames
- `PATCH()` → find, json, readPlatformData, requireAdminSession, trim, updatePlatformData, withMemorialNames
- `withMemorialNames()` → find, map

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

