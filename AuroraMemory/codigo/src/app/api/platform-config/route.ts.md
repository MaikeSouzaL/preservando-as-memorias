---
origem: src/app/api/platform-config/route.ts
origem_hash: 554dcd9eedbe1c98af4b23774bcf63b8f4f0a1b1
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/platform-config/route.ts`

# API de Configuração da Plataforma

**Responsabilidade:** Gerencia configurações globais da plataforma (preços, planos funerários, comissão e modos de entrega QR).

## Endpoints

- **`GET /api/platform-config`** — Retorna configurações públicas e, para admins, dados de pedidos.
- **`PATCH /api/platform-config`** — Atualiza configurações específicas via `target`:
  - `"prices"`: preços de memoriais (família/funerária)
  - `"commission"`: percentual de comissão (apenas dev admin)
  - `"qr_delivery"` / `"funeral_home_qr_delivery"`: modo de entrega QR (`"admin"` ou `"self"`)
  - `"funeral"`: cria/atualiza planos funerários
  - `"funeral_delete"`: remove plano funerário

## Dependências

- **`src/lib/auth-session`** — Sessão do usuário (GET)
- **`src/lib/api-auth`** — Autenticação de admin (PATCH)
- **`src/lib/dev-auth`** — Autenticação de dev admin (comissão)
- **`src/lib/platform-data`** — Leitura/escrita dos dados da plataforma

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`, `PATCH`

## 📞 O que cada função chama
- `GET()` → getAuthSession, json, readPlatformData
- `PATCH()` → Boolean, Number, String, filter, findIndex, includes, isArray, isFinite, json, max, push, requireAdminSession, requireDevAdminSession, round, some, trim, updatePlatformData

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[auth-session.ts]] — `src/lib/auth-session.ts`
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

