---
origem: src/app/api/tribute-donation/route.ts
origem_hash: 4cf97d12c82ee1c68d079f2a2933fa1eddfcefe7
gerado_em: 2026-06-26T00:33:19
---

# `src/app/api/tribute-donation/route.ts`

# API de Doação para Homenagem

**Responsabilidade:** Endpoint POST que processa contribuições simbólicas vinculadas a memoriais.

**Função principal:** `POST /api/tribute-donation`
- Recebe `{ memorialId, amountCents, donorName }` no body
- Valida memorial ativo via `readPlatformData()`
- Mínimo de R$1,00 (100 cents)

**Comportamento por gateway:**
- **Sandbox** (`NEXT_PUBLIC_PAYMENT_GATEWAY=sandbox`): retorna `{ gateway: "sandbox" }` (201)
- **Stripe**: cria Checkout Session com PIX/cartão, retorna `{ checkoutUrl, sessionId, gateway: "stripe" }` (201)

**Metadados Stripe:** `memorialId`, `donorName`, `type: "tribute_donation"`

**Dependências:** `readPlatformData()` (busca memoriais), `stripe` SDK (chave `STRIPE_SECRET_KEY`)

**Erros:** 400 (dados inválidos), 404 (memorial não encontrado), 500 (erro interno)

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** next/server, stripe

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asStr`, `getStripe`

## 📞 O que cada função chama
- `POST()` → asStr, create, find, getStripe, json, readPlatformData
- `asStr()` → trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`

