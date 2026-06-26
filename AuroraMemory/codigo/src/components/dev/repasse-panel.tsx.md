---
origem: src/components/dev/repasse-panel.tsx
origem_hash: 10f6d68c910968f8e32169758525c5e4528de418
gerado_em: 2026-06-26T00:33:19
---

# `src/components/dev/repasse-panel.tsx`

# `repasse-panel.tsx` — Painel de Repasses Manuais

**Responsabilidade:** Interface para admin gerenciar transferências manuais ao parceiro (sem Stripe Connect).

## Componentes

- **`RepassePanel`** — Componente principal que exibe:
  - Status dos dados bancários do admin (`adminBankConfigured`, `adminPixKey`)
  - Totais (pendente, já repassado, quantidade de pedidos)
  - Botão para marcar todos como realizados (`markAll`)
  - Tabela de pedidos pendentes com ação individual (`markOne`)
  - Estado local (`localOrders`) sincronizado via `useState`
- **`StripeModeBadge`** — Badge que detecta ambiente Stripe (live/test) via `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **`TotalCard`** — Card reutilizável para exibir indicadores financeiros

## API Consumida

- `PATCH /api/dev/repasse` — Marca repasse como realizado (individual ou em massa)

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `orders` | `PlatformOrder[]` | Lista de pedidos da plataforma |
| `adminBankConfigured` | `boolean` | Se admin possui dados bancários |
| `adminPixKey` | `string \| null` | Chave Pix do admin |

## Conexões

- Importa `PlatformOrder` de `src/lib/platform-data`
- Importado por `src/app/(dev)/dev/page.tsx`

<!-- aurora:relacoes -->

## 🔗 Importa
- [[platform-data.ts]] — `src/lib/platform-data.ts`
- **Externos/APIs:** react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(dev)/dev/page.tsx`

## 📤 Exporta
`RepassePanel`

## 🧩 Componentes usados
PlatformOrder, StripeModeBadge, TotalCard

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
adminBankConfigured, adminPixKey, highlight, icon, label, orders, value

## 🧠 Funções/Componentes definidos
`RepassePanel`, `StripeModeBadge`, `TotalCard`, `brl`, `fmt`, `markAll`, `markOne`

## 📞 O que cada função chama
- `RepassePanel()` → brl, filter, fmt, map, markOne, reduce, toString, useState
- `StripeModeBadge()` → startsWith
- `brl()` → toLocaleString
- `fmt()` → toLocaleDateString
- `markAll()` → brl, confirm, fetch, map, setLocalOrders, setMarkingAll, setMsg, stringify
- `markOne()` → fetch, map, setLocalOrders, setMarking, setMsg, stringify

