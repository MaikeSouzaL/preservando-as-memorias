---
origem: src/app/(public)/faq/page.tsx
origem_hash: 1c343af115180b94058e7d9b6a8ffa61923b2899
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/faq/page.tsx`

# FAQ Page

Página de perguntas frequentes (rota `/faq`), componente cliente que exibe um acordeão interativo com perguntas e respostas.

## Funcionalidade

- **Estado `openIndex`**: controla qual item do acordeão está aberto (índice 0 por padrão)
- **Renderização**: mapeia `publicContent.faq` (do mock-db) em artigos com botão toggle
- **Interação**: clique no botão alterna entre abrir/fechar o item; ícone `add`/`remove` indica estado

## Links de navegação

- `/contato` — "Ainda com dúvidas? Falar com suporte"
- `/sobre` — "Conhecer a plataforma"

## Dependências

- `publicContent` de `@/src/mock-db/public-content` (dados mockados)
- `Link` do Next.js para navegação interna

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.ts]] — `src/mock-db/public-content.ts`
- **Externos/APIs:** next/link, react

## 📤 Exporta
`FaqPage`, `default`

## 🧩 Componentes usados
Link

## 🧠 Funções/Componentes definidos
`FaqPage`

## 📞 O que cada função chama
- `FaqPage()` → map, setOpenIndex, useState

## 🔁 Chama (arquivos)
- [[public-content.ts]] — `src/mock-db/public-content.ts`

