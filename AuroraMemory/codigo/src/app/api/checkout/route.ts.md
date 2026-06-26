---
origem: src/app/api/checkout/route.ts
origem_hash: 4f69db3a61c6951c0491483981d6418385429bee
gerado_em: 2026-06-25T23:37:29
---

# `src/app/api/checkout/route.ts`

# API de Checkout (Stripe)

**Responsabilidade:** Processa pagamentos de memoriais e planos via Stripe ou sandbox.

## Função Principal

- **`POST /api/checkout`** — Cria pedido e sessão de pagamento

## Fluxo de Decisão

1. **Valida dados obrigatórios** (nome, email, CPF, telefone, método de pagamento)
2. **Identifica tipo de fluxo:** memorial (família/funerária), oferta ou plano
3. **Calcula preços** via `updatePlatformData`:
   - Memorial funerária: verifica cota do plano ativo (gratuito ou excedente)
   - Memorial família: preço configurado
   - Oferta: preço do `offerLink`
   - Plano: preço do plano
4. **Calcula comissões** (cascade se envolver funerária, simples caso contrário)
5. **Cria pedido** e atualiza memorial como ativo se pago

## Gateways

- **`sandbox`** — simula pagamento, retorna sucesso imediato
- **`stripe`** — cria sessão Checkout com PIX, boleto ou cartão
  - Se funerária tem conta Stripe conectada: usa `application_fee` + `transfer_data`

## Retorno

- `201`: pedido criado + detalhes do gateway (URL checkout ou confirmação)
- `400/500`: erro com mensagem descritiva

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/server, stripe

## 📤 Exporta
`POST`, `dynamic`

## 🧠 Funções/Componentes definidos
`POST`, `asString`, `getStripe`

## 📞 O que cada função chama
- `POST()` → Boolean, asString, calculateCascadeOrderTotals, calculateOrderTotals, create, find, getFullYear, getMonth, getStripe, includes, json, now, toISOString, toString, unshift, updatePlatformData
- `asString()` → trim

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`

