---
origem: src/components/private/memorial-card.tsx
origem_hash: 1e1285086359b161188e2c7d6b316187c903bf4a
gerado_em: 2026-06-26T00:33:19
---

# `src/components/private/memorial-card.tsx`

## MemorialCard

Componente de card para exibição de memoriais no dashboard privado.

### Responsabilidade
Renderiza um card com foto, status, métricas de interação e ações para cada memorial do usuário.

### Props principais
- `id`, `name`, `years`, `imageUrl` — dados do memorial
- `status` — "ativo" | "pending_payment" | "rascunho"
- `publicUrl`, `editUrl` — links de navegação
- `qrDataUrlDark`, `qrDataUrlLight` — URLs dos QR codes
- `tributeCount`, `candleCount`, `flowers`, `hearts` — métricas de interação

### Funcionalidades
- Exibe foto, nome, anos e badge de status com cores específicas
- Mostra métricas de interação apenas para memoriais ativos
- Botões de ação: abrir/pagar, editar, QR code (com modal dark/light toggle), compartilhar
- Modal de QR code com download e alternância entre tema escuro/claro
- Usa `createPortal` para renderizar o modal no `document.body`

### Consumo
Importado por `dashboard/page.tsx` para listar memoriais do usuário.

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** next/image, react, react-dom

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(private)/dashboard/page.tsx`

## 📤 Exporta
`MemorialCard`

## 🧩 Componentes usados
Image

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
candleCount, editUrl, flowers, hearts, id, imageUrl, name, publicUrl, qrDataUrlDark, qrDataUrlLight, status, tributeCount, years

## 🧠 Funções/Componentes definidos
`MemorialCard`, `handleShare`

## 📞 O que cada função chama
- `MemorialCard()` → createPortal, replace, setQrTheme, setShowQr, stopPropagation, toLowerCase, useState
- `handleShare()` → alert, share, writeText

