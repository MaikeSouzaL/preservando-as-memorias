---
origem: src/app/api/admin/complaints/route.ts
origem_hash: 80f878aa4226fd3ab45aed01306cf4d83dc9aedd
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/admin/complaints/route.ts`

# API de Denúncias (Admin)

**Responsabilidade:** CRUD de denúncias da plataforma, restrito a administradores autenticados.

## Endpoints

- **`GET`** — Lista todas as denúncias (`data.complaints`)
- **`POST`** — Cria nova denúncia (body: `target`, `reason`, `reporter` opcional)
- **`PATCH`** — Atualiza status de denúncia (body: `id`, `status`)
- **`DELETE`** — Remove denúncia (query param: `id`)

## Funcionalidades

- **Autenticação:** `requireAdminSession()` valida sessão admin em todos os endpoints
- **Persistência:** Usa `readPlatformData`/`updatePlatformData` para manipular dados
- **Validação:** Campos obrigatórios (`target`, `reason`) e ID para PATCH/DELETE
- **Estrutura de denúncia:** `id`, `target`, `reason`, `reporter`, `status` ("Pendente"|"Resolvido"), `createdAt`

## Dependências

- `src/lib/api-auth` — Middleware de autenticação admin
- `src/lib/platform-data` — Camada de acesso a dados da plataforma

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`DELETE`, `GET`, `PATCH`, `POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`DELETE`, `GET`, `PATCH`, `POST`

## 📞 O que cada função chama
- `DELETE()` → filter, get, json, readPlatformData, requireAdminSession, updatePlatformData
- `GET()` → json, readPlatformData, requireAdminSession
- `PATCH()` → findIndex, json, readPlatformData, requireAdminSession, updatePlatformData
- `POST()` → String, json, now, requireAdminSession, toISOString, trim, unshift, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

