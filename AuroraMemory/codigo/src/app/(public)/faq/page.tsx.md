---
origem: src/app/(public)/faq/page.tsx
origem_hash: a5859f81fd073422e4c85e69abd1504f980a4cee
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/faq/page.tsx`

### `src/app/(public)/faq/page.tsx`

**Responsabilidade:** Página pública de FAQ (Perguntas Frequentes) do memorial.

**Componente principal:**
- **`FaqPage`** (default export) — *não recebe props*. Renderiza lista de perguntas/respostas em acordeão.

**Funcionalidades:**
- `useState<number>(0)` — controla qual item está aberto (índice); `-1` = todos fechados.
- `faqItems` — array estático com 5 pares `{ question, answer }`.
- Botão em cada item alterna `openIndex`; exibe `answer` condicionalmente.
- Links para `/contato` e `/sobre` usando `next/link`.

**Bibliotecas:** `react` (useState), `next/link`.

**Conexões:** Página pública acessível via rota `/faq`; links internos para `/contato` e `/sobre`.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, react

## 📤 Exporta
`FaqPage`, `default`

## 🧩 Componentes usados
Link

## 🧠 Funções/Componentes definidos
`FaqPage`

## 📞 O que cada função chama
- `FaqPage()` → map, setOpenIndex, useState

