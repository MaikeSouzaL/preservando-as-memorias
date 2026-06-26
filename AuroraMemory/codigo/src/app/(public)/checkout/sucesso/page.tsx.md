---
origem: src/app/(public)/checkout/sucesso/page.tsx
origem_hash: c4df983edff00801e68569df6af2fee002b401c9
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/checkout/sucesso/page.tsx`

# Página de Sucesso do Checkout

**Responsabilidade:** Exibe confirmação de pagamento após checkout bem-sucedido.

## Componentes

- **`CheckoutSucessoPage`** (default): Componente principal que envolve `SucessoContent` em `Suspense` com fallback de carregamento.
- **`SucessoContent`**: Renderiza a tela de confirmação com:
  - Ícone de check e título "Pagamento confirmado"
  - Exibe `order_id` da URL (via `useSearchParams`) em destaque
  - Links para `/dashboard` e `/`

## Props/Parâmetros

- **`order_id`** (query param): ID do pedido recebido do Stripe via URL

## Conexões

- **Next.js**: `useSearchParams` para ler query params; `Link` para navegação
- **Público**: Acessível em `/checkout/sucesso` (rota pública)
- **Dashboard**: Redireciona para `/dashboard` após confirmação

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, next/navigation, react

## 📤 Exporta
`CheckoutSucessoPage`, `default`

## 🧩 Componentes usados
Link, SucessoContent, Suspense

## 🪝 Hooks / efeitos
useSearchParams

## 🧠 Funções/Componentes definidos
`CheckoutSucessoPage`, `SucessoContent`

## 📞 O que cada função chama
- `SucessoContent()` → get, useSearchParams

