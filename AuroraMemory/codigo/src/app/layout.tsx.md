---
origem: src/app/layout.tsx
origem_hash: c06b98e0ddb178ae2a76b60271b2ff10c632fd51
gerado_em: 2026-06-25T23:37:29
---

# `src/app/layout.tsx`

# Root Layout (`src/app/layout.tsx`)

**Responsabilidade:** Layout raiz da aplicação Next.js, define estrutura HTML base e componentes globais.

**Componentes chave:**
- `RootLayout`: Componente principal que envolve toda a aplicação com `<html>` e `<body>`
- `PwaRegister`: Registra service worker para PWA
- `PwaInstallBanner`: Banner de instalação do PWA
- `CookieBanner`: Banner de consentimento de cookies

**Props:** `children` (ReactNode) - conteúdo das páginas filhas

**Metadados:** Título "Preservando Memórias", descrição sobre memorial digital com QR Code

**Fontes externas:** Material Symbols e Material Icons do Google Fonts

**Conexões:** Importa estilos globais (`globals.css`), componentes de PWA e cookie banner; exporta metadados e layout padrão do Next.js.

<!-- aurora:relacoes -->

## 🔗 Importa
- [[globals.css]] — `src/app/globals.css`
- [[pwa-register.tsx]] — `src/app/pwa-register.tsx`
- [[cookie-banner.tsx]] — `src/components/ui/cookie-banner.tsx`
- [[pwa-install-banner.tsx]] — `src/components/ui/pwa-install-banner.tsx`
- **Externos/APIs:** next

## 📤 Exporta
`RootLayout`, `default`, `metadata`

## 🧩 Componentes usados
CookieBanner, PwaInstallBanner, PwaRegister

## 📥 Props recebidas
children

## 🧠 Funções/Componentes definidos
`RootLayout`

