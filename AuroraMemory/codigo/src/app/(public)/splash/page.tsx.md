---
origem: src/app/(public)/splash/page.tsx
origem_hash: a8ea67ac37692b69d292fe84454506ba9936130e
gerado_em: 2026-06-25T23:37:29
---

# `src/app/(public)/splash/page.tsx`

# SplashPage

Página de splash/boas-vindas do aplicativo, responsável pela experiência inicial do usuário.

## Funcionalidades Principais

- **Auto-login**: Verifica `localStorage("has_logged_in")` e redireciona automaticamente para `/dashboard` após 1.5s com animação de carregamento
- **Banner de consentimento**: Exibe aviso de cookies/cache quando `cache_consent_accepted` não está presente, com botão "Aceitar e Prosseguir"
- **Botão "Continuar"**: Link para `/dashboard` (se logado) ou `/login` (caso contrário)

## Componentes e Estilo

- Background com overlay dourado e gradiente radial animado (`animate-pulse-glow`)
- Ícone de fogo (`local_fire_department`) com brilho e hover effect
- Título e tagline vindos de `publicContent.brand` (mock-db)
- Animações CSS personalizadas (pulse-glow, loading-bar, fadeIn)

## Props/Parâmetros

- Nenhum (componente cliente sem props)

## Conexões

- **Importa**: `publicContent` de `@/src/mock-db/public-content`
- **Navegação**: `useRouter` para redirecionar para `/dashboard` ou `/login`
- **Armazenamento**: `localStorage` para verificar/definir flags de login e consentimento

<!-- aurora:relacoes -->

## 🔗 Importa
- [[public-content.ts]] — `src/mock-db/public-content.ts`
- **Externos/APIs:** next/image, next/link, next/navigation, react

## 📤 Exporta
`SplashPage`, `default`

## 🧩 Componentes usados
Image, Link

## 🪝 Hooks / efeitos
useEffect, useRouter, useState

## 🧠 Funções/Componentes definidos
`SplashPage`, `handleAcceptConsent`

## 📞 O que cada função chama
- `SplashPage()` → clearTimeout, getItem, push, setHasLoggedIn, setIsRedirecting, setShowCookieConsent, setTimeout, useEffect, useRouter, useState
- `handleAcceptConsent()` → setItem, setShowCookieConsent

