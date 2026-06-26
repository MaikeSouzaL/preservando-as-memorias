---
origem: src/app/(admin)/admin/comercial/page.tsx
origem_hash: 6c61caea6c624760093ae5a1b772bb0626c5f6bb
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(admin)/admin/comercial/page.tsx`

# Admin Commercial Page

**Responsabilidade:** Página de configuração comercial do admin, com três abas (Visão Geral, Dados Bancários, Planos e Preços).

## Componentes Chave

- **`AdminCommercialPage`** (default export, async): Server component que carrega dados da plataforma e renderiza abas com métricas financeiras, tabela de pedidos e painéis de configuração.
- **`CommercialTabInfo`**: Card informativo com ícone, título, descrição e dica opcional.
- **`Metric`**: Card exibindo valor formatado em destaque.
- **`OrderRow`**: Linha de tabela com detalhes do pedido (cliente, plano, taxas, repasse).

## Props/Parâmetros

- `searchParams.tab`: Controla aba ativa (`visao-geral`, `banco`, `planos`).

## APIs/Endpoints

- **Consome:** `readPlatformData()` (dados da plataforma), `estimateStripeFeeCents()` (cálculo de taxa Stripe).

## Integração

- Importa `PriceConfigPanel` e `BankDataPanel` para configuração de preços e dados bancários.
- Usa `Link` do Next.js para navegação entre abas via query string.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[bank-data-panel.tsx]] — `src/components/admin/bank-data-panel.tsx`
- [[price-config-panel.tsx]] — `src/components/admin/price-config-panel.tsx`
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`
- **Externos/APIs:** next/link

## 📤 Exporta
`AdminCommercialPage`, `default`, `dynamic`

## 🧩 Componentes usados
BankDataPanel, CommercialTabInfo, Link, Metric, OrderRow, PriceConfigPanel

## 📥 Props recebidas
description, highlight, icon, label, order, planName, tip, title, value

## 🧠 Funções/Componentes definidos
`AdminCommercialPage`, `CommercialTabInfo`, `Metric`, `OrderRow`, `formatBRL`

## 📞 O que cada função chama
- `AdminCommercialPage()` → filter, find, formatBRL, map, readPlatformData, reduce, slice, toString
- `OrderRow()` → estimateStripeFeeCents, formatBRL, max
- `formatBRL()` → format

## 🔁 Chama (arquivos)
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- [[platform-types.ts]] — `src/lib/platform-types.ts`

