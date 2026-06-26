---
origem: src/app/api/candle-payment/confirm/route.ts
origem_hash: e79cd410c7e9f61119272984e641007ff5839449
gerado_em: 2026-06-26T00:33:20
---

# `src/app/api/candle-payment/confirm/route.ts`

# `POST /api/candle-payment/confirm`

Confirma pagamento Stripe de vela eterna e cria registro no banco.

**Fluxo:**
1. Recebe `{ sessionId }` no body
2. Recupera sessão Stripe e valida `payment_status === 'paid'`
3. Verifica `metadata.type === "eternal_candle"` e extrai `memorialId`, `candleName`
4. Anti-replay: cache em memória (`usedSessions`) + verificação no banco via `updatePlatformData`
5. Cria vela eterna com `paymentSessionId` e retorna `{ candle }` (status 201)

**Respostas de erro:**
- `400`: sessionId ausente, tipo inválido ou memorial não identificado
- `402`: pagamento não confirmado
- `409`: sessão já processada (replay)
- `500`: erro interno

**Dependências:** `src/lib/platform-data.ts` (updatePlatformData), Stripe SDK

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server, stripe

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `getStripe`

## 📞 O que cada função chama
- `POST()` → add, getStripe, has, json, now, retrieve, some, toISOString, toString, trim, unshift, updatePlatformData

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

