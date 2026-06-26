---
origem: src/app/(public)/landing/page.tsx
origem_hash: 8d2b2f39d41f725cd9444773ca41800048cfb9c2
gerado_em: 2026-06-26T00:33:20
---

# `src/app/(public)/landing/page.tsx`

# Landing Page - Página Inicial Pública

## Responsabilidade Principal
Página de aterrissagem do Preservando Memórias, apresentando o serviço de memoriais digitais com QR Code físico.

## Componentes Chave
- **LandingPage** (default export): Página completa com seções hero, estatísticas, processo, simulador e FAQ
- **Stat**: Componente interno para exibir métricas (value, label, middle)

## Funcionalidades
- **Drawer mobile**: Menu lateral responsivo com navegação e CTAs
- **FAQ interativo**: Accordion com perguntas frequentes (estado `activeFaq`)
- **Animações**: Blobs flutuantes, transições em cards e efeitos hover

## Links de Navegação
- Seções: #legado, #processo, #simulator, #faq
- CTAs: /criar-memorial, /login, /funeraria/login, /memorial?from=landing

## Relações
- Importado por: `src/app/page.tsx`
- Usa: `next/image`, `next/link`, React hooks (`useState`, `useEffect`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/image, next/link, react

## ⬅️ Importado por
- [[page.tsx]] — `src/app/page.tsx`

## 📤 Exporta
`LandingPage`, `default`

## 🧩 Componentes usados
Image, Link, Stat

## 🪝 Hooks / efeitos
useEffect, useState

## 📥 Props recebidas
label, middle, value

## 🧠 Funções/Componentes definidos
`LandingPage`, `Stat`, `closeDrawer`

## 📞 O que cada função chama
- `LandingPage()` → map, setActiveFaq, setDrawerOpen, useEffect, useState
- `closeDrawer()` → setDrawerOpen

