---
origem: src/app/api/dev/repasse/route.ts
origem_hash: 40ae3fb9249e54a5e0e95bde1a03149e6019af76
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/dev/repasse/route.ts`

# `src/app/api/dev/repasse/route.ts`

**Responsabilidade:** Endpoint de desenvolvimento para marcar repasses financeiros de pedidos como realizados.

**Função principal:**
- `PATCH(request)` — recebe requisição com `orderId` (marca um pedido específico) ou `markAll: true` (marca todos pendentes). Requer sessão de admin de desenvolvimento.

**Parâmetros do body:**
- `orderId?: string` — ID do pedido a marcar
- `markAll?: boolean` — se `true`, marca todos os pedidos com `status === "paid"` e `repasseStatus !== "realizado"`

**APIs/endpoints:** Define `PATCH /api/dev/repasse`

**Conexões:**
- Importa `requireDevAdminSession` de `src/lib/dev-auth` (autenticação)
- Importa `updatePlatformData` de `src/lib/platform-data` (mutação dos dados)
- Exporta `dynamic = "force-dynamic"` (evita cache estático)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`PATCH`, `dynamic`

## 🧠 Funções/Componentes definidos
`PATCH`

## 📞 O que cada função chama
- `PATCH()` → json, requireDevAdminSession, trim, updatePlatformData

## 🔁 Chama (arquivos)
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

