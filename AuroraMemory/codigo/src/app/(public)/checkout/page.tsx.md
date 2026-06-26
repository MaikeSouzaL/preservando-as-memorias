---
origem: src/app/(public)/checkout/page.tsx
origem_hash: 890aec35747f9b0cc766887a68c3dc3148a39908
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/checkout/page.tsx`

# Página de Checkout (`/checkout`)

**Responsabilidade:** Página de finalização de compra para assinaturas de planos ou publicação de memoriais.

## Componentes principais

- **`CheckoutPage`** — Componente raiz com `Suspense` para carregar `CheckoutContent`
- **`CheckoutContent`** — Lógica central: gerencia formulário, métodos de pagamento (Pix, cartão, boleto), cálculo de totais e submissão via `POST /api/checkout`
- **`OrderSummary`** / **`MemorialOrderSummary`** — Resumo da compra com valores, descontos e comissões
- **`CheckoutSuccess`** / **`MemorialCheckoutSuccess`** — Telas de confirmação pós-pagamento

## Parâmetros de URL (searchParams)

- `memorialId`, `payerType` (family/funeral_home) — modo memorial
- `plan` — plano selecionado (modo assinatura)
- `email`, `name` — pré-preenchimento do formulário

## Fluxo

1. Carrega `PlatformConfig` via `GET /api/platform-config`
2. Em modo memorial, busca nome do memorial em `GET /api/memorials/:id`
3. Exibe formulário com dados pessoais + método de pagamento
4. Submete para `POST /api/checkout` e redireciona para `checkoutUrl` ou mostra sucesso

## Dependências

- `src/lib/platform-types` — tipos `PaymentMethod`, `PlatformConfig`, funções `calculateOrderTotals`, `centsToBRL`, `cycleLabel`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/image, next/link, next/navigation, react

## 📤 Exporta
`CheckoutPage`, `default`

## 🧩 Componentes usados
CheckoutContent, CheckoutLoading, CheckoutOrder, CheckoutSuccess, HTMLFormElement, HTMLInputElement, Image, Link, MemorialCheckoutSuccess, MemorialOrderSummary, OrderSummary, PaymentButton, PaymentInfo, PaymentMethod, PlatformConfig, SummaryLine, Suspense, TextInput

## 🪝 Hooks / efeitos
useEffect, useMemo, useSearchParams, useState

## 📥 Props recebidas
children, commissionPercent, current, discountCode, icon, label, memorialId, memorialName, message, onClick, order, payerType, plan, priceCents, props, required, setDiscountCode, strong, title, totals, value

## 🧠 Funções/Componentes definidos
`CheckoutContent`, `CheckoutLoading`, `CheckoutPage`, `CheckoutSuccess`, `MemorialCheckoutSuccess`, `MemorialOrderSummary`, `OrderSummary`, `PaymentButton`, `PaymentInfo`, `SummaryLine`, `TextInput`, `handleInputChange`, `handleSubmit`

## 📞 O que cada função chama
- `CheckoutContent()` → Boolean, calculateOrderTotals, catch, centsToBRL, fetch, filter, find, get, json, setConfig, setError, setFormData, setMemorialName, then, toLowerCase, useEffect, useMemo, useSearchParams, useState
- `CheckoutSuccess()` → centsToBRL
- `MemorialCheckoutSuccess()` → centsToBRL
- `MemorialOrderSummary()` → centsToBRL
- `OrderSummary()` → centsToBRL, cycleLabel, map, setDiscountCode
- `PaymentButton()` → onClick
- `handleInputChange()` → setFormData
- `handleSubmit()` → fetch, json, preventDefault, setError, setIsSubmitting, setOrder, stringify

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

