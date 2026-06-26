---
origem: src/app/api/dev/stats/route.ts
origem_hash: d6e1955410379a4635b4a4eff55b090d5791abe2
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/dev/stats/route.ts`

Este arquivo define a rota de API `GET /api/dev/stats` para exibir estatísticas financeiras do admin.

**Responsabilidade:** Retornar métricas de receita e pedidos pagos recentes, acessível apenas para usuários dev/admin autenticados.

**Função principal:**
- `GET()`: Protegida por `requireDevAdminSession()`. Lê dados da plataforma, filtra pedidos com status "paid", calcula receita bruta (`grossRevenueCents`), comissão do sistema (`systemCutCents`) e repasse ao admin (`adminRepasseCents`). Retorna também os 20 pedidos pagos mais recentes.

**Conexões:**
- `src/lib/dev-auth`: middleware de autenticação dev/admin
- `src/lib/platform-data`: acesso aos dados da plataforma (pedidos, etc.)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server

## 📤 Exporta
`GET`, `dynamic`

## 🧠 Funções/Componentes definidos
`GET`

## 📞 O que cada função chama
- `GET()` → filter, getTime, json, map, readPlatformData, reduce, requireDevAdminSession, slice, sort

## 🔁 Chama (arquivos)
- [[dev-auth.ts]] — `src/lib/dev-auth.ts`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

