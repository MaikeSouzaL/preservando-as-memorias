---
origem: src/components/ui/cookie-banner.tsx
origem_hash: 2571234da3fe8a51330c33e7fa0fee6059ab2f04
gerado_em: 2026-06-29T18:31:33
---

# `src/components/ui/cookie-banner.tsx`

```markdown
# `src/components/ui/cookie-banner.tsx`

**Responsabilidade** – Banner de consentimento de cookies, armazenando a escolha do usuário no `localStorage`. Exibe-se no rodapé fixo até que o consentimento seja dado.

## Funções / Componentes

- **`CookieBanner()`** – Componente React. Renderiza o banner se `consent` for `null`. Exibe:
  - Mensagem com links para `/politica-privacidade` e `/termos-de-uso`
  - Botões "Apenas essenciais" (`accept('essential')`) e "Aceitar todos" (`accept('all')`)
- **`useCookieConsent()`** – Hook customizado. Gerencia estado local `consent`.
  - **Recebe**: nada.
  - **Retorna**: `{ consent, accept }`.
  - **Chama**: `useState`, `useEffect`, `localStorage.getItem` (ao montar), `setConsent` (internamente), `localStorage.setItem` (em `accept`).
- **`accept(type)`** – Função interna. Salva `

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, react

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/layout.tsx`

## 📤 Exporta
`CookieBanner`

## 🧩 Componentes usados
CookieConsent, Link

## 🪝 Hooks / efeitos
useCookieConsent, useEffect

## 🧠 Funções/Componentes definidos
`CookieBanner`, `accept`, `useCookieConsent`

## 📞 O que cada função chama
- `CookieBanner()` → accept, useCookieConsent
- `accept()` → setConsent, setItem
- `useCookieConsent()` → getItem, setConsent, useEffect, useState

