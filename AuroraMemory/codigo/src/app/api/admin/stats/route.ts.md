---
origem: src/app/api/admin/stats/route.ts
origem_hash: 84890c4cfa0d590dfb385c582f0c8b0faba47578
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/admin/stats/route.ts`

# Admin Stats API Route

**Responsabilidade:** Endpoint GET `/api/admin/stats` que retorna métricas e pendências do painel administrativo.

**Funcionalidades:**
- Requer sessão de admin (`requireAdminSession`)
- Retorna funerárias pendentes de aprovação (`pendingFuneralHomes`)
- Retorna memoriais com entrega pendente de QR code (`pendingDeliveries`)
- Retorna admins parceiros (apenas para dev admin) via consulta à tabela `profiles`
- Contagens: `pendingCount`, `pendingDeliveriesCount`, `ordersCount`, `memorialsCount`

**Dependências:** `src/lib/api-auth` (autenticação), `src/lib/platform-data` (dados da plataforma), `src/lib/supabase` (consulta admin parceiros)

**Exporta:** `GET` (força `dynamic`)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`
- **Externos/APIs:** next/server, profiles

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → createAdminClient, eq, filter, from, json, map, readPlatformData, requireAdminSession, select

## 🔁 Chama (arquivos)
- [[api-auth.ts]] — `src/lib/api-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[supabase.ts]] — `src/lib/supabase.ts`

