---
origem: src/components/ui/pwa-install-banner.tsx
origem_hash: eee329005624125ae859abcc6c3b3fb9cf23c284
gerado_em: 2026-06-25T23:37:29
---

# `src/components/ui/pwa-install-banner.tsx`

# PWA Install Banner

Componente que exibe um banner no topo da página incentivando a instalação do app como PWA.

**Responsabilidade:** Detectar plataforma (iOS/Android) e evento `beforeinstallprompt` para guiar o usuário na instalação.

**Funcionalidades:**
- Detecta iOS (Safari) e exibe instruções de "Adicionar à Tela de Início"
- Detecta Android e intercepta `beforeinstallprompt` para oferecer botão "Instalar"
- Oculta banner se já estiver rodando como standalone ou se foi dispensado anteriormente (via `localStorage`)

**Props:** Nenhuma (componente autônomo)

**Ligações:** Importado por `src/app/layout.tsx` para exibição global.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react

## ⬅️ Importado por
- [[layout.tsx]] — `src/app/layout.tsx`

## 📤 Exporta
`PwaInstallBanner`

## 🧩 Componentes usados
BeforeInstallPromptEvent

## 🪝 Hooks / efeitos
useEffect, useState

## 🧠 Funções/Componentes definidos
`PwaInstallBanner`, `dismiss`, `handleBeforeInstallPrompt`, `handleInstall`

## 📞 O que cada função chama
- `PwaInstallBanner()` → addEventListener, getItem, log, matchMedia, removeEventListener, setIsAndroid, setIsIos, setIsVisible, test, toLowerCase, useEffect, useState
- `dismiss()` → setIsVisible, setItem
- `handleBeforeInstallPrompt()` → log, preventDefault, setDeferredPrompt, setIsVisible
- `handleInstall()` → dismiss, prompt, setDeferredPrompt

