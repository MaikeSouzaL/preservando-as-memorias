---
origem: src/app/api/candle-payment/route.ts
origem_hash: 0997c380c47bb85a5e7efda1e263c8181c922acf
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/candle-payment/route.ts`

# `POST /api/candle-payment`

**Responsabilidade:** Processa pagamento para acender vela eterna em um memorial.

**Fluxo:**
1. Recebe `{ memorialId, candleName }` no body
2. Valida memorial ativo nos dados da plataforma
3. Conforme gateway configurado (`NEXT_PUBLIC_PAYMENT_GATEWAY`):
   - **sandbox** (padrão): cria vela imediatamente, retorna `{ candle, gateway: "sandbox" }`
   - **stripe**: cria Checkout Session de R$1 (configurável via `candlePriceCents`), retorna `{ checkoutUrl, sessionId, gateway: "stripe" }`

**APIs consumidas:** `readPlatformData`, `updatePlatformData` (src/lib/platform-data.ts) — lê/atualiza dados da plataforma (memoriais, velas, config)

**Integração:** Chamado pelo frontend ao acender vela; no modo Stripe, redireciona para sucesso/cancelamento em `/memorial-publico`.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server, stripe

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asStr`, `getStripe`

## 📞 O que cada função chama
- `POST()` → asStr, create, find, getStripe, json, now, readPlatformData, toISOString, toString, unshift, updatePlatformData
- `asStr()` → trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

