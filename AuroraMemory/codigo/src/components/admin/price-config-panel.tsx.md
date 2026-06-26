---
origem: src/components/admin/price-config-panel.tsx
origem_hash: 20a7e787d68c49f62e48e7c29526f95470bf02a3
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/price-config-panel.tsx`

# PriceConfigPanel

## Responsabilidade
Painel administrativo para configurar preços de memoriais (família e funerária) com simulação de repasses.

## Componentes

- **`PriceConfigPanel`**: Componente principal que gerencia estado dos preços e faz PATCH para `/api/platform-config`
- **`PriceInput`**: Input numérico com prefixo R$ e hint do valor atual
- **`BreakdownCard`**: Simulação detalhada de repasse por venda (Stripe + comissão)

## Props Principais

- `initialConfig: PlatformConfig` — configuração atual com preços em centavos e percentual de comissão

## Funcionalidades

- Edição de preços para memorial familiar e funerário
- Simulação em tempo real de repasses (cartão vs PIX)
- Exibe taxas Stripe estimadas e comissão da plataforma
- Feedback visual de salvamento (sucesso/erro)

## Dependências

- **Importa**: `centsToBRL`, `estimateStripeFeeCents`, `PlatformConfig` de `src/lib/platform-types`
- **Consome**: `PATCH /api/platform-config`
- **Importado por**: `src/app/(admin)/admin/comercial/page.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`

## 📤 Exporta
`PriceConfigPanel`

## 🧩 Componentes usados
BreakdownCard, PriceInput

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
commissionPercent, hint, initialConfig, label, onChange, priceCents, value

## 🧠 Funções/Componentes definidos
`BreakdownCard`, `PriceConfigPanel`, `PriceInput`, `handleSave`, `row`

## 📞 O que cada função chama
- `BreakdownCard()` → estimateStripeFeeCents, round, row
- `PriceConfigPanel()` → centsToBRL, parseFloat, round, toFixed, useState
- `PriceInput()` → onChange
- `handleSave()` → fetch, json, parseFloat, round, setIsSaving, setMessage, stringify
- `row()` → centsToBRL

## 🔁 Chama (arquivos)
- [[platform-types.ts]] — `src/lib/platform-types.ts`

