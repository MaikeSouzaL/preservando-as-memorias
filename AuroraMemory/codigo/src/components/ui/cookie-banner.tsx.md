---
origem: src/components/ui/cookie-banner.tsx
origem_hash: ec7f263e799dc8ac5c350c5ec57400fa498ae101
gerado_em: 2026-06-26T00:33:19
---

# `src/components/ui/cookie-banner.tsx`

### CookieBanner

**Responsabilidade:** Gerenciar o consentimento de cookies do usuário, exibindo um banner fixo no rodapé até que uma escolha seja feita.

**Componentes/Funções:**
- `useCookieConsent()` — Hook que gerencia estado do consentimento via `localStorage` (chave `aurora_cookie_consent`). Retorna `consent` (tipo `'all' | 'essential' | null`) e `accept(type)` para salvar a escolha.
- `CookieBanner` — Componente principal. Renderiza banner com texto explicativo, links para Política de Privacidade e Termos de Uso, e dois botões: "Apenas essenciais" e "Aceitar todos". Some após consentimento.

**Props/Parâmetros:** Nenhum.

**APIs/Endpoints:** Nenhum. Apenas armazenamento local.

**Conexões:** Importado por `src/app/layout.tsx`. Usa `next/link` para navegação interna.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/link, react

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/layout.tsx`

## 📤 Exporta
`CookieBanner`, `default`

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

