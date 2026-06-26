---
origem: src/lib/platform-types.ts
origem_hash: 985d2f19b9d12a6a261e1191377ccfd2c5eb8b34
gerado_em: 2026-06-26T00:33:19
---

# `src/lib/platform-types.ts`

# `platform-types.ts` — Tipos e utilitários de planos e comissões

Define os tipos TypeScript para o sistema de planos (assinatura mensal/anual/única), configurações da plataforma e convites de funerárias. Exporta funções utilitárias para:

- **`centsToBRL()`** — formata centavos em reais
- **`cycleLabel()`** — traduz ciclo de faturamento
- **`estimateStripeFeeCents()`** — estima taxas Stripe (cartão 3,49%+R$0,39; PIX 0,99%)
- **`calculateCommission()`** — calcula comissão percentual simples
- **`couponDiscountPercent()`** — retorna desconto de cupons fixos (ETERNO10, MEMORIA10, LEGADO20)
- **`calculateOrderTotals()`** — calcula totais com desconto e comissão
- **`calculateCascadeOrderTotals()`** — cascata de comissões: cliente → admin parceiro → dev admin → funerária

Tipos principais: `PlatformPlan`, `FuneralPlan`, `PlatformConfig`, `FuneralHomeInvite`, `BillingCycle`, `PaymentMethod`, `QrDeliveryMode`.

<!-- aurora:relacoes -->

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/ofertas/page.tsx`
- [[page.tsx]] — `src/app/(public)/checkout/page.tsx`
- [[page.tsx]] — `src/app/(public)/convite/[slug]/page.tsx`
- [[page.tsx]] — `src/app/(public)/planos/page.tsx`
- [[route.ts]] — `src/app/api/admin/funeral-home-invites/route.ts`
- [[route.ts]] — `src/app/api/checkout/route.ts`
- [[commercial-settings-panel.tsx]] — `src/components/admin/commercial-settings-panel.tsx`
- [[convites-page-client.tsx]] — `src/components/admin/convites-page-client.tsx`
- [[funeral-settings-panel.tsx]] — `src/components/admin/funeral-settings-panel.tsx`
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`
- [[price-config-panel.tsx]] — `src/components/admin/price-config-panel.tsx`
- [[qr-delivery-panel.tsx]] — `src/components/admin/qr-delivery-panel.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`

## 📤 Exporta
`BillingCycle`, `FuneralHomeInvite`, `FuneralPlan`, `PaymentMethod`, `PlatformConfig`, `PlatformPlan`, `QrDeliveryMode`, `QrDeliveryOverride`, `calculateCascadeOrderTotals`, `calculateCommission`, `calculateOrderTotals`, `centsToBRL`, `couponDiscountPercent`, `cycleLabel`, `estimateStripeFeeCents`

## 🧠 Funções/Componentes definidos
`calculateCascadeOrderTotals`, `calculateCommission`, `calculateOrderTotals`, `centsToBRL`, `couponDiscountPercent`, `cycleLabel`, `estimateStripeFeeCents`

## 📞 O que cada função chama
- `calculateCascadeOrderTotals()` → round
- `calculateCommission()` → round
- `calculateOrderTotals()` → calculateCommission, couponDiscountPercent, max, round
- `centsToBRL()` → format
- `couponDiscountPercent()` → toUpperCase, trim
- `estimateStripeFeeCents()` → round

## 📲 Chamado por
- [[page.tsx]] — `src/app/(admin)/admin/comercial/page.tsx`
- [[page.tsx]] — `src/app/(admin)/admin/ofertas/page.tsx`
- [[page.tsx]] — `src/app/(public)/checkout/page.tsx`
- [[page.tsx]] — `src/app/(public)/convite/[slug]/page.tsx`
- [[page.tsx]] — `src/app/(public)/planos/page.tsx`
- [[route.ts]] — `src/app/api/checkout/route.ts`
- [[commercial-settings-panel.tsx]] — `src/components/admin/commercial-settings-panel.tsx`
- [[funeral-settings-panel.tsx]] — `src/components/admin/funeral-settings-panel.tsx`
- [[funerarias-page-client.tsx]] — `src/components/admin/funerarias-page-client.tsx`
- [[price-config-panel.tsx]] — `src/components/admin/price-config-panel.tsx`
- [[qr-delivery-panel.tsx]] — `src/components/admin/qr-delivery-panel.tsx`

