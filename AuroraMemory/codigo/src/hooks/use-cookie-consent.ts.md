---
origem: src/hooks/use-cookie-consent.ts
origem_hash: 03ef4d6d85a459d10734d0270c557ca6ae751848
gerado_em: 2026-06-25T23:37:25
---

# `src/hooks/use-cookie-consent.ts`

## `useCookieConsent` Hook

**Responsabilidade:** Gerenciar o consentimento de cookies do usuário, persistindo a escolha no `localStorage`.

**Função principal:**
- `useCookieConsent()` — Hook React que retorna:
  - `consent`: estado atual (`'all'`, `'essential'` ou `null`)
  - `accept(type)`: salva a escolha no `localStorage` e atualiza o estado
  - `reset()`: remove o consentimento armazenado

**Detalhes:**
- Chave de armazenamento: `aurora_cookie_consent`
- Inicializa lendo o `localStorage` via `useEffect`
- Exporta o tipo `CookieConsent` para uso em outros componentes

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## 📤 Exporta
`CookieConsent`, `useCookieConsent`

## 🧩 Componentes usados
CookieConsent

## 🪝 Hooks / efeitos
useCookieConsent, useEffect

## 🧠 Funções/Componentes definidos
`accept`, `reset`, `useCookieConsent`

## 📞 O que cada função chama
- `accept()` → setConsent, setItem
- `reset()` → removeItem, setConsent
- `useCookieConsent()` → getItem, setConsent, useEffect, useState

