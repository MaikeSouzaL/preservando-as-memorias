---
origem: src/components/admin/qr-code-viewer.tsx
origem_hash: b7bfc3b5577aae74ff43ea35a09c799c4d7f3687
gerado_em: 2026-06-25T23:37:29
---

# `src/components/admin/qr-code-viewer.tsx`

## QR Code Viewer

Componente de visualização e download de QR codes para memoriais.

**Props:**
- `qrDataUrlDark` / `qrDataUrlLight`: URLs dos QR codes nos temas escuro e claro
- `memorialName`: nome do memorial para exibição e nome do arquivo

**Funcionalidades:**
- Abre modal com portal para visualização do QR code
- Alternância entre temas escuro (fundo preto) e claro (fundo branco)
- Preview em tamanho fixo (360px) com fundo correspondente ao tema
- Download do QR code como SVG com nome padronizado

**Estado local:** `open` (controle do modal), `theme` (tema ativo)

**Consumido por:** página de QR codes admin (`/admin/qr-codes`)

<!-- aurora:relacoes -->

## 🔗 Importa
- **Externos/APIs:** react, react-dom

## ⬅️ Importado por
- [[page.tsx]] — `src/app/(admin)/admin/qr-codes/page.tsx`

## 📤 Exporta
`QrCodeViewer`

## 🪝 Hooks / efeitos
useState

## 📥 Props recebidas
memorialName, qrDataUrlDark, qrDataUrlLight

## 🧠 Funções/Componentes definidos
`QrCodeViewer`

## 📞 O que cada função chama
- `QrCodeViewer()` → createPortal, replace, setOpen, setTheme, stopPropagation, toLowerCase, useState

